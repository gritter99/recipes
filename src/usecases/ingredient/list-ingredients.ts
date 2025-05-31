import { IIngredientRepository } from '../../domain/repository';

export class ListIngredients {
  constructor(private repo: IIngredientRepository) { }

  public async execute() {
    return this.repo.findAll();
  }
}
