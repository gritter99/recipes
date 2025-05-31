import { Request, Response } from 'express';
import { PostgresRecipeRepository } from '../infra/repositories/postgres-recipes.repo';
import { CreateRecipe } from '../usecases/recipe/create-recipe';
import { DeleteRecipe } from '../usecases/recipe/delete-recipe';
import { GetRecipe } from '../usecases/recipe/get-recipe';
import { GetRecipeByName } from '../usecases/recipe/get-recipe-by-name';
import { ListRecipes } from '../usecases/recipe/list-recipes';
import { UpdateRecipe } from '../usecases/recipe/update-recipe';

const repo = new PostgresRecipeRepository();
export class RecipeController {
  public static async create(req: Request, res: Response): Promise<any> {
    const usecase = new CreateRecipe(repo);
    const recipe = await usecase.execute(req.body.name, req.body.ingredients, req.body.preparation);
    res.status(201).json(recipe);
  }
  public static async list(req: Request, res: Response): Promise<any> {
    const usecase = new ListRecipes(repo);
    const items = await usecase.execute();
    res.json(items);
  }
  public static async get(req: Request, res: Response): Promise<any> {
    const usecase = new GetRecipe(repo);
    const item = await usecase.execute(req.params.id);
    if (!item) { return res.status(404).send(); }
    res.json(item);
  }
  public static async getByName(req: Request, res: Response): Promise<any> {
    const usecase = new GetRecipeByName(repo);
    const item = await usecase.execute(req.params.name);
    if (!item) { return res.status(404).send(); }
    res.json(item);
  }
  public static async update(req: Request, res: Response): Promise<any> {
    const usecase = new UpdateRecipe(repo);
    const recipe = await repo.findById(req.params.id);
    if (!recipe) { return res.status(404).send(); }
    recipe.name = req.body.name;
    recipe.ingredients = req.body.ingredients;
    recipe.preparation = req.body.preparation;
    await usecase.execute(recipe);
    res.json(recipe);
  }
  public static async delete(req: Request, res: Response): Promise<any> {
    const usecase = new DeleteRecipe(repo);
    await usecase.execute(req.params.id);
    res.status(204).send();
  }
}
