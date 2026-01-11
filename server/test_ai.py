import json
from ai_utils import generate_recipe_with_ai

def test_ai():
    print("🚀 开始测试 AI 菜谱生成功能...")
    
    # 模拟一些食材数据
    test_ingredients = [
        {"name": "鸡蛋", "amount": 150},
        {"name": "西红柿", "amount": 300},
        {"name": "小葱", "amount": 10}
    ]
    
    try:
        print(f"📦 输入食材: {test_ingredients}")
        recipe = generate_recipe_with_ai(test_ingredients)
        
        print("\n✅ AI 成功生成菜谱:")
        print(json.dumps(recipe, ensure_ascii=False, indent=2))
        
    except Exception as e:
        print(f"\n❌ 测试失败: {str(e)}")
        print("\n💡 提示: 请检查 server/.env 文件中的 API Key 是否正确。")

if __name__ == "__main__":
    test_ai()
