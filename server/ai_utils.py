import os
import json
import base64
import httpx
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")
    app_id = os.getenv("APP_ID")
    if not api_key:
        return None
    
    # 创建一个忽略环境变量中代理设置的 http 客户端
    # 这样可以避免 httpx 报错 ValueError: Unknown scheme for proxy URL (socks4)
    http_client = httpx.Client(trust_env=False)
    
    return OpenAI(
        api_key=api_key,
        base_url="https://qianfan.baidubce.com/v2",
        default_headers={ "appid": app_id },
        http_client=http_client
    )

def identify_ingredients_from_image(image_bytes: bytes):
    """
    通过 AI 识别图片中的食材
    """
    client = get_openai_client()
    if not client:
        raise Exception("AI Client not configured.")

    base64_image = base64.b64encode(image_bytes).decode('utf-8')
    
    prompt = """
    你是一个专业的食材识别助手。请分析这张图片，识别其中的食材。
    
    识别要求：
    1. 只识别明显的、可食用的食材（蔬菜、肉类、水果、配菜等）。
    2. 估算每个食材的大致重量（单位：g）。
    3. 将食材归类为以下之一：肉类、蔬菜、海鲜/河鲜、水果、配菜。
    
    输出必须是严格的 JSON 格式，包含一个名为 "ingredients" 的数组，每个对象包含：
    - name: 食材名称
    - amount: 数字（克数）
    - category: 分类
    
    如果图片中没有任何食材，请返回：{"ingredients": []}
    
    请只返回 JSON 对象，不要有任何其他文字。
    """
    
    try:
        print(f"[DEBUG] Sending request to Baidu Qianfan API...")
        response = client.chat.completions.create(
            model="ernie-5.0-thinking-preview", # 使用支持多模态的模型，百度千帆上请确认模型名称
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            response_format={ "type": "json_object" }
        )
        
        raw_content = response.choices[0].message.content
        print(f"[DEBUG] AI Raw Response: {raw_content}")
        
        result = json.loads(raw_content)
        return result.get("ingredients", [])
    except Exception as e:
        print(f"[DEBUG] AI Vision Error: {str(e)}")
        raise e

def generate_recipe_with_ai(ingredients_data: list):
    """
    根据输入的食材清单生成菜谱 JSON 对象
    """
    client = get_openai_client()
    if not client:
        raise Exception("AI Client not configured. Please check OPENAI_API_KEY in .env")

    # Format ingredients for the prompt
    ingredients_list = [f"{item['name']}: {item['amount']}g" for item in ingredients_data]
    ingredients_str = ", ".join(ingredients_list)
    
    prompt = f"""
    你是一个专业的厨师。请根据以下现有的食材清单，为用户推荐一道美味的菜谱。
    食材清单: {ingredients_str}
    
    输出必须是严格的 JSON 格式，包含以下字段：
    - name: 菜名
    - description: 简单介绍
    - type: 餐次（早饭/中饭/晚饭）
    - time: 一个对象，包含 prep (准备时间，分钟) 和 cook (烹饪时间，分钟)
    - ingredients: 一个数组，每个对象包含 name (食材名), amount (建议使用的重量，数字，单位g), isEnough (布尔值，根据现有食材判断是否足够，通常设为 true)
    - steps: 详细步骤数组
    
    请只返回 JSON 对象，不要有任何其他文字。
    """
    
    print(f"DEBUG: Prompt sent to AI:\n{prompt}")
    
    try:
        response = client.chat.completions.create(
            model="ernie-speed-128k",
            messages=[{"role": "user", "content": prompt}]
        )
        
        raw_content = response.choices[0].message.content
        print(f"DEBUG: Raw response from AI:\n{raw_content}")
        
        if not raw_content:
            raise Exception("AI returned an empty response.")
            
        try:
            return json.loads(raw_content)
        except json.JSONDecodeError:
            if "```json" in raw_content:
                content = raw_content.split("```json")[1].split("```")[0].strip()
                return json.loads(content)
            elif "```" in raw_content:
                content = raw_content.split("```")[1].split("```")[0].strip()
                return json.loads(content)
            else:
                raise
    except Exception as e:
        print(f"DEBUG: Unexpected error during AI call: {type(e).__name__}: {str(e)}")
        raise e

def update_data_with_ai(ingredients_data: list, current_recipes: list, current_shopping_list: list):
    """
    使用 AI 更新菜谱和购物单。
    1. 根据现有食材更新菜谱中 ingredients 的 isEnough 状态。
    2. 推荐一个可以使用现有食材制作的新菜谱。
    3. 更新购物清单：移除冰箱已有食材，添加菜谱缺失食材。
    """
    client = get_openai_client()
    if not client:
        raise Exception("AI Client not configured.")

    prompt = f"""
    你是一个智能厨房助手。请根据最新的冰箱食材清单，更新现有的菜谱库和购物单。

    1. 冰箱食材清单: {json.dumps(ingredients_data, ensure_ascii=False)}
    2. 现有菜谱库: {json.dumps(current_recipes, ensure_ascii=False)}
    3. 现有购物单: {json.dumps(current_shopping_list, ensure_ascii=False)}

    任务要求：
    1. 更新现有菜谱库中每个菜谱的 ingredients 列表。如果冰箱中有该食材且数量充足（或大致足够），将 isEnough 设为 true，否则设为 false。
    2. 基于冰箱里的现有食材，推荐 1 个新的美味菜谱，并加入到菜谱库中。
    3. 更新购物单：
       - 如果购物单中的物品已经在冰箱里了（出现在冰箱食材清单中），请从购物单中移除。
       - 如果现有菜谱库（包括新推荐的）中有食材的 isEnough 为 false，请将其加入购物单（如果不在清单中）。
       - 购物单项格式：{{"id": "唯一ID", "name": "名称", "checked": false, "category": "分类"}}。

    输出必须是严格的 JSON 格式，包含两个字段：
    - updated_recipes: 更新后的完整菜谱数组（包含原有的和新增的一个）。
    - updated_shopping_list: 更新后的完整购物单数组。

    请只返回 JSON 对象，不要有任何其他文字。
    """

    try:
        print(f"[DEBUG] Sending update request to AI...")
        response = client.chat.completions.create(
            model="ernie-speed-128k",
            messages=[{"role": "user", "content": prompt}]
        )
        
        raw_content = response.choices[0].message.content
        print(f"[DEBUG] AI Update Response: {raw_content}")
        
        try:
            result = json.loads(raw_content)
        except json.JSONDecodeError:
            if "```json" in raw_content:
                content = raw_content.split("```json")[1].split("```")[0].strip()
                result = json.loads(content)
            elif "```" in raw_content:
                content = raw_content.split("```")[1].split("```")[0].strip()
                result = json.loads(content)
            else:
                raise

        return result.get("updated_recipes", []), result.get("updated_shopping_list", [])
    except Exception as e:
        print(f"[DEBUG] AI Update Error: {str(e)}")
        raise e

def regenerate_all_data_with_ai(ingredients_data: list):
    """
    根据冰箱食材，使用文心一言模型重新生成完整的 recipes.json 和 shopping.json。
    尽可能使用 ingredients.json 中的食材。
    """
    client = get_openai_client()
    if not client:
        raise Exception("AI Client not configured.")

    prompt = f"""
    你是一个智能厨房管家。请根据当前冰箱里的食材清单，为用户重新规划一份完整的菜谱库和购物清单。
    
    冰箱现有食材: {json.dumps(ingredients_data, ensure_ascii=False)}

    任务要求：
    1. 生成 5-8 道菜谱。
    2. **关键要求**：这些菜谱应尽可能多地利用冰箱里的现有食材。
    3. 每个菜谱包含：
       - name: 菜名
       - description: 简介
       - type: 早餐/中饭/晚饭
       - time: {{ "prep": 准备分钟, "cook": 烹饪分钟 }}
       - ingredients: 数组，包含 {{ "name": 名称, "amount": 数量(g/个), "isEnough": 布尔值 }}
         - 如果该食材在“冰箱现有食材”中且数量大致充足，isEnough 设为 true。
         - 否则设为 false。
       - steps: 详细步骤数组。
    4. 生成一份购物清单：
       - 包含上述所有菜谱中 isEnough 为 false 的食材。
       - 格式：{{ "id": "唯一字符串ID", "name": "名称", "checked": false, "category": "分类" }}。

    输出必须是严格的 JSON 格式，包含两个字段：
    - recipes: 菜谱数组
    - shopping_list: 购物清单数组

    请只返回 JSON 对象，不要有任何其他文字。
    """

    try:
        print(f"[DEBUG] Requesting full data regeneration from ERNIE...")
        response = client.chat.completions.create(
            model="ernie-speed-128k",
            messages=[{"role": "user", "content": prompt}]
            # response_format={ "type": "json_object" } # Some Qianfan models don't support this yet
        )
        
        raw_content = response.choices[0].message.content
        print(f"[DEBUG] ERNIE Regeneration Response received, length: {len(raw_content)}")
        # print(f"[DEBUG] Raw content: {raw_content}") # Uncomment if needed for debugging
        
        try:
            result = json.loads(raw_content)
        except json.JSONDecodeError as je:
            print(f"[DEBUG] JSON Decode Error: {str(je)}")
            # Attempt to extract JSON from markdown code blocks if present
            if "```json" in raw_content:
                content = raw_content.split("```json")[1].split("```")[0].strip()
                result = json.loads(content)
            elif "```" in raw_content:
                content = raw_content.split("```")[1].split("```")[0].strip()
                result = json.loads(content)
            else:
                raise je

        return result.get("recipes", []), result.get("shopping_list", [])
    except Exception as e:
        print(f"[DEBUG] ERNIE Regeneration Error: {str(e)}")
        raise e
