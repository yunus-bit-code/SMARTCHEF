export interface Source {
  title: string;
  uri: string;
}

export type IngredientCategory = 'Meat' | 'Vegetable' | 'Fruit' | 'Grain' | 'Pulse' | 'Dairy' | 'Spice' | 'Condiment';

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  expirationDate: string; // YYYY-MM-DD
  category: IngredientCategory;
}

export interface RecipeIngredient {
  name: string;
  quantity: string;
  inPantry: boolean;
}

export interface Recipe {
  title: string;
  description: string;
  cuisine: string;
  cookTime: number;
  ingredients: RecipeIngredient[];
  instructions: string[];
  sources?: Source[];
}