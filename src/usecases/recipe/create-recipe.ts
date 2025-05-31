import { v4 as uuidv4 } from 'uuid';
import { Recipe, RecipeIngredient } from '../../domain/entity';
import { IRecipeRepository } from '../../domain/repository';

export class CreateRecipe {
  constructor(private repo: IRecipeRepository) { }

  public async execute(
    name: string,
    ingredients: RecipeIngredient[],
    preparation: string,
  ): Promise<Recipe> {
    if (!name || name.trim() === '') {
      throw new Error('Recipe name is required.');
    }

    if (!ingredients || ingredients.length === 0) {
      throw new Error('Ingredients are required.');
    }

    const items: RecipeIngredient[] = [];
    // Assume repository will hydrate Ingredient
    for (const i of ingredients) {
      items.push({ ingredient: { id: i.ingredient.id, name: i.ingredient.name, unit: i.ingredient.unit }, quantity: i.quantity });
    }
    const recipe = new Recipe(uuidv4(), name, items, preparation);
    await this.repo.create(recipe);
    return recipe;
  }
}
