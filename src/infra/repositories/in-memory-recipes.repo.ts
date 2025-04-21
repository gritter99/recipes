import { Recipe } from "../../domain/entity";
import { IRecipeRepository } from "../../domain/repository";

export class InMemoryRecipeRepository implements IRecipeRepository {
  private items = new Map<string, Recipe>();

  async create(recipe: Recipe): Promise<void> {
    this.items.set(recipe.id, recipe);
  }
  async findById(id: string): Promise<Recipe | null> {
    return this.items.get(id) || null;
  }
  async findAll(): Promise<Recipe[]> {
    return Array.from(this.items.values());
  }
  async update(recipe: Recipe): Promise<void> {
    this.items.set(recipe.id, recipe);
  }
  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }
  async findByName(name: string): Promise<Recipe | null> {
    for (const recipe of this.items.values()) {
      if (recipe.name.toLowerCase() === name.toLowerCase()) {
        return recipe;
      }
    }
    return null;
  }
}