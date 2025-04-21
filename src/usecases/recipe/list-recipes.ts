import { IRecipeRepository } from "../../domain/repository";

export class ListRecipes {
  constructor(private repo: IRecipeRepository) { }

  async execute() {
    const recipes = await this.repo.findAll();
    return recipes;
  }
}