import { Ingredient } from "../../domain/entity";
import { IIngredientRepository } from "../../domain/repository";
import { v4 as uuidv4 } from "uuid";

export class CreateIngredient {
  constructor(private repo: IIngredientRepository) { }

  async execute(name: string, unit: string): Promise<Ingredient> {
    if (!name || name.trim() === "") {
      throw new Error("Ingredient name is required.");
    }

    if (!unit || unit.trim() === "") {
      throw new Error("Ingredient unit is required.");
    }
    const ingredient = new Ingredient(uuidv4(), name, unit);
    await this.repo.create(ingredient);
    return ingredient;
  }
}