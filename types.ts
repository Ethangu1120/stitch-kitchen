export interface Ingredient {
  name: string;
  amount?: string;
  available?: boolean; // For shopping/fridge logic
}

export interface Step {
  id: number;
  instruction: string;
}

export interface Recipe {
  id: string;
  title: string;
  image: string;
  tags: string[];
  ingredients: Ingredient[];
  prepTime: string;
  cookTime: string;
  totalTime: string;
  steps: Step[];
  category: string;
}

export interface FridgeItem {
  id: string;
  name: string;
  quantity: string;
  image: string;
  category: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
  category: string;
}

export type ViewState = 'home' | 'fridge' | 'shopping' | 'profile';