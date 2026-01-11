import os
import json
import sys

# Add current directory to path so we can import ai_utils
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ai_utils import regenerate_all_data_with_ai

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
INGREDIENTS_FILE = os.path.join(DATA_DIR, "ingredients.json")
RECIPES_FILE = os.path.join(DATA_DIR, "recipes.json")
SHOPPING_FILE = os.path.join(DATA_DIR, "shopping.json")

def main():
    print("Starting data regeneration using ERNIE model...")
    
    # 1. Load ingredients
    if not os.path.exists(INGREDIENTS_FILE):
        print(f"Error: {INGREDIENTS_FILE} not found.")
        return
    
    with open(INGREDIENTS_FILE, "r", encoding="utf-8") as f:
        ingredients = json.load(f)
    
    print(f"Loaded {len(ingredients)} ingredients from {INGREDIENTS_FILE}")
    
    # 2. Call AI to regenerate
    try:
        print("Calling AI, this may take a while...")
        recipes, shopping_list = regenerate_all_data_with_ai(ingredients)
        
        print(f"AI returned {len(recipes)} recipes and {len(shopping_list)} shopping items.")
        
        if not recipes:
            print("Warning: AI returned no recipes.")
        if not shopping_list:
            print("Warning: AI returned no shopping list.")
            
        if not recipes and not shopping_list:
            print("Regeneration failed: No data returned from AI.")
            return
        
        # 3. Save recipes.json
        with open(RECIPES_FILE, "w", encoding="utf-8") as f:
            json.dump(recipes, f, ensure_ascii=False, indent=2)
        print(f"Successfully saved {len(recipes)} recipes to {RECIPES_FILE}")
        
        # 4. Save shopping.json
        with open(SHOPPING_FILE, "w", encoding="utf-8") as f:
            json.dump(shopping_list, f, ensure_ascii=False, indent=2)
        print(f"Successfully saved {len(shopping_list)} shopping items to {SHOPPING_FILE}")
        
        print("\nRegeneration complete!")
        
    except Exception as e:
        print(f"An error occurred during regeneration: {str(e)}")

if __name__ == "__main__":
    main()
