import { Ingredient } from "./domain/entity";
import { IIngredientRepository } from "./domain/repository";

export class UpdateIngredient {
  constructor(private repo: IIngredientRepository) { }

  async execute(ingredient: Ingredient) {
    await this.repo.update(ingredient);
  }
}