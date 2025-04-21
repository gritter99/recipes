import { Request, Response } from "express";
import { UpdateIngredient } from "../usecases/ingredient/update-ingredient";
import { InMemoryIngredientRepository } from "../infra/repositories/in-memory-ingredients.repo";
import { CreateIngredient } from "../usecases/ingredient/create-ingredient";
import { DeleteIngredient } from "../usecases/ingredient/delete-ingredient";
import { GetIngredient } from "../usecases/ingredient/get-ingredient";
import { ListIngredients } from "../usecases/ingredient/list-ingredients";
import { GetIngredientByName } from "../usecases/ingredient/get-ingredient-by-name";

const repo = new InMemoryIngredientRepository();
export class IngredientController {
  static async create(req: Request, res: Response): Promise<any> {
    const usecase = new CreateIngredient(repo);
    const ingredient = await usecase.execute(req.body.name, req.body.unit);
    res.status(201).json(ingredient);
  }
  static async list(req: Request, res: Response) {
    const usecase = new ListIngredients(repo);
    const items = await usecase.execute();
    res.json(items);
  }
  static async get(req: Request, res: Response): Promise<any> {
    const usecase = new GetIngredient(repo);
    const item = await usecase.execute(req.params.id);
    if (!item) return res.status(404).send();
    res.json(item);
  }
  static async getByName(req: Request, res: Response): Promise<any> {
    const usecase = new GetIngredientByName(repo);
    const item = await usecase.execute(req.params.name);
    if (!item) return res.status(404).send();
    res.json(item);
  }
  static async update(req: Request, res: Response): Promise<any> {
    const usecase = new UpdateIngredient(repo);
    const ingredient = await repo.findById(req.params.id);
    if (!ingredient) return res.status(404).send();
    ingredient.name = req.body.name;
    ingredient.unit = req.body.unit;
    await usecase.execute(ingredient);
    res.json(ingredient);
  }
  static async delete(req: Request, res: Response): Promise<any> {
    const usecase = new DeleteIngredient(repo);
    await usecase.execute(req.params.id);
    res.status(204).send();
  }
}