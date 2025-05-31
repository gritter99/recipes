import { IRecipeRepository } from '../../domain/repository';

export class GetRecipeByName {
  constructor(private repo: IRecipeRepository) { }

  public async execute(name: string) {
    const recipe = await this.repo.findByName(name);
    if (!recipe) {
      throw new Error(`Recipe with name "${name}" not found.`);
    }
    return recipe;
  }
}
