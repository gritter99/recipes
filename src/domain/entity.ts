export class Ingredient {
  constructor(
    public readonly id: string,
    public name: string,
    public unit: string,
  ) { }
}

export interface RecipeIngredient {
  ingredient: Ingredient;
  quantity: number;
}

export class Recipe {
  constructor(
    public readonly id: string,
    public name: string,
    public ingredients: RecipeIngredient[],
    public preparation: string,
  ) { }
}
