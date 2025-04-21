import { Ingredient } from "../../domain/entity";
import { IIngredientRepository } from "../../domain/repository";

export class InMemoryIngredientRepository implements IIngredientRepository {
  private items = new Map<string, Ingredient>();

  async create(ingredient: Ingredient): Promise<void> {
    this.items.set(ingredient.id, ingredient);
  }
  async findById(id: string): Promise<Ingredient | null> {
    return this.items.get(id) || null;
  }
  async findAll(): Promise<Ingredient[]> {
    return Array.from(this.items.values());
  }
  async update(ingredient: Ingredient): Promise<void> {
    this.items.set(ingredient.id, ingredient);
  }
  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }
  async findByName(name: string): Promise<Ingredient | null> {
    for (const ingredient of this.items.values()) {
      if (ingredient.name === name) {
        return ingredient;
      }
    }
    return null;
  }
}
