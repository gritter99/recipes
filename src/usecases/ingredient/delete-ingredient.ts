import { IIngredientRepository } from "../../domain/repository";

export class DeleteIngredient {
  constructor(private repo: IIngredientRepository) { }

  async execute(id: string) {
    await this.repo.delete(id);
    return { success: true, message: "Ingredient deleted successfully." };
  }
}
