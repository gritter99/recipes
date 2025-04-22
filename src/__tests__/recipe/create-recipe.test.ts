import { CreateRecipe } from "../../usecases/recipe/create-recipe";
import { Recipe } from "../../domain/entity";
import { IRecipeRepository } from "../../domain/repository";
import { v4 as uuidv4 } from "uuid";

describe('CreateRecipe Use Case', () => {
  let mockRepo: IRecipeRepository;
  let createRecipe: CreateRecipe;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
    } as unknown as IRecipeRepository;

    createRecipe = new CreateRecipe(mockRepo);
  });

  test('should create a recipe successfully', async () => {
    const name = "Bolo de chocolate";
    const ingredients = [
      { ingredientId: uuidv4(), quantity: 2 },
      { ingredientId: uuidv4(), quantity: 3 },
    ];
    const preparation = "Misturar ingredientes e bater.";

    const result = await createRecipe.execute(name, ingredients, preparation);

    expect(result).toBeInstanceOf(Recipe);
    expect(result.name).toBe(name);
    expect(result.preparation).toBe(preparation);
    expect(result.ingredients).toHaveLength(2);
    expect(mockRepo.create).toHaveBeenCalledWith(result);
  });

  test('should throw an error if no name is provided', async () => {
    const name = "";
    const ingredients = [
      { ingredientId: uuidv4(), quantity: 2 },
      { ingredientId: uuidv4(), quantity: 3 },
    ];
    const preparation = "Misturar ingredientes e bater.";

    await expect(createRecipe.execute(name, ingredients, preparation)).rejects.toThrow();
  });

  test('should throw an error if no ingredients are provided', async () => {
    const name = "Bolo de chocolate";
    const ingredients: { ingredientId: string; quantity: number }[] = [];
    const preparation = "Misturar ingredientes e bater.";

    await expect(createRecipe.execute(name, ingredients, preparation)).rejects.toThrow("Ingredients are required.");
  });
});