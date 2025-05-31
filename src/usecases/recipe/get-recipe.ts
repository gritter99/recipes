import { Recipe } from '../../domain/entity';
import { IRecipeRepository } from '../../domain/repository';

export class GetRecipe {
  constructor(private repo: IRecipeRepository) { }

  public async execute(id: string): Promise<Recipe> {
    const recipe = await this.repo.findById(id);
    if (!recipe) {
      throw new Error(`Recipe with id ${id} not found`);
    }
    return recipe;
  }
}
