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
            model="deepseek-v3.2", # 或者使用 "gpt-4"
            messages=[{"role": "user", "content": prompt}],
            response_format={ "type": "json_object" }
        )
        
        raw_content = response.choices[0].message.content
        print(f"DEBUG: Raw response from AI:\n{raw_content}")
        
        if not raw_content:
            raise Exception("AI returned an empty response.")
            
        return json.loads(raw_content)
    except json.JSONDecodeError as e:
        print(f"DEBUG: JSON decode error. Content that failed to parse:\n{raw_content}")
        raise Exception(f"Failed to parse AI response as JSON: {str(e)}")
    except Exception as e:
        print(f"DEBUG: Unexpected error during AI call: {type(e).__name__}: {str(e)}")
        raise e
