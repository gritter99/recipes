import { UpdateRecipe } from "../../usecases/recipe/update-recipe";
import { Recipe } from "../../domain/entity";
import { IRecipeRepository } from "../../domain/repository";
import { v4 as uuidv4 } from "uuid";

describe('UpdateRecipe Use Case', () => {
  let mockRepo: IRecipeRepository;
  let updateRecipe: UpdateRecipe;

  beforeEach(() => {
    mockRepo = {
      update: jest.fn(),
      findById: jest.fn(),
    } as unknown as IRecipeRepository;

    updateRecipe = new UpdateRecipe(mockRepo);
  });

  test('should update a recipe successfully', async () => {
    const recipeId = uuidv4();
    const name = "Bolo de chocolate";
    const ingredients = [
      { ingredient: { id: uuidv4(), name: "Farinha", unit: "gramas" }, quantity: 2 },
      { ingredient: { id: uuidv4(), name: "Açúcar", unit: 'gramas' }, quantity: 3 },
    ];
    const preparation = "Misturar ingredientes e bater.";

    const existingRecipe = new Recipe(recipeId, name, ingredients, preparation);
    (mockRepo.findById as jest.Mock).mockResolvedValue(existingRecipe);


    const updatedName = "Bolo de chocolate com Ganache";
    const updatedRecipe = await updateRecipe.execute(new Recipe(recipeId, updatedName, ingredients, preparation));

    expect(updatedRecipe).toBeInstanceOf(Recipe);
    expect(updatedRecipe.id).toBe(recipeId);
    expect(updatedRecipe.name).toBe(updatedName);
    expect(updatedRecipe.preparation).toBe(preparation);
    expect(updatedRecipe.ingredients).toHaveLength(2);
    expect(mockRepo.update).toHaveBeenCalledWith(updatedRecipe);
  });

});