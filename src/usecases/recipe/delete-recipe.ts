import { IRecipeRepository } from '../../domain/repository';

export class DeleteRecipe {
  constructor(private repo: IRecipeRepository) { }

  public async execute(id: string) {
    await this.repo.delete(id);
    return id;
  }
}
