import { Ingredient, Recipe } from "./entity";

export interface IIngredientRepository {
  create(ingredient: Ingredient): Promise<void>;
  findById(id: string): Promise<Ingredient | null>;
  findAll(): Promise<Ingredient[]>;
  update(ingredient: Ingredient): Promise<void>;
  delete(id: string): Promise<void>;
  findByName(name: string): Promise<Ingredient | null>;
}


export interface IRecipeRepository {
  create(recipe: Recipe): Promise<void>;
  findById(id: string): Promise<Recipe | null>;
  findAll(): Promise<Recipe[]>;
  update(recipe: Recipe): Promise<void>;
  delete(id: string): Promise<void>;
  findByName(name: string): Promise<Recipe | null>;
}
