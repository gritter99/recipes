import { IIngredientRepository } from "../../domain/repository";


export class GetIngredientByName {
  constructor(private repo: IIngredientRepository) { }

  async execute(name: string) {
    const ingredient = await this.repo.findByName(name);
    return ingredient;
  }
}