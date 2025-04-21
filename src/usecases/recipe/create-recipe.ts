import { Recipe, RecipeIngredient } from "../../domain/entity";
import { IRecipeRepository } from "../../domain/repository";
import { v4 as uuidv4 } from "uuid";

export class CreateRecipe {
  constructor(private repo: IRecipeRepository) { }

  async execute(
    name: string,
    ingredients: { ingredientId: string; quantity: number }[],
    preparation: string
  ): Promise<Recipe> {
    const items: RecipeIngredient[] = [];
    // Assume repository will hydrate Ingredient
    for (const i of ingredients) {
      items.push({ ingredient: { id: i.ingredientId, name: "", unit: "" } as any, quantity: i.quantity });
    }
    const recipe = new Recipe(uuidv4(), name, items, preparation);
    await this.repo.create(recipe);
    return recipe;
  }
}