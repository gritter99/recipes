import { Ingredient } from '../../domain/entity';
import { IIngredientRepository } from '../../domain/repository';

export class UpdateIngredient {
  constructor(private repo: IIngredientRepository) { }

  public async execute(ingredient: Ingredient) {
    const existingIngredient = await this.repo.findById(ingredient.id);
    if (!existingIngredient) {
      throw new Error('Ingredient not found');
    }
    await this.repo.update(ingredient);
    return ingredient;
  }
}
