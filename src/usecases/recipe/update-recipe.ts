import { Recipe } from "../../domain/entity";
import { IRecipeRepository } from "../../domain/repository";

export class UpdateRecipe {
  constructor(private repo: IRecipeRepository) { }

  async execute(recipe: Recipe) {
    await this.repo.update(recipe);
    return recipe;
  }
}