import { IIngredientRepository } from '../../domain/repository';

export class GetIngredient {
  constructor(private repo: IIngredientRepository) { }

  public async execute(id: string) {
    return this.repo.findById(id);
  }
}
