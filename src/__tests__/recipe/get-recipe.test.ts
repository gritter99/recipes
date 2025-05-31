import { v4 as uuidv4 } from 'uuid';
import { Recipe } from '../../domain/entity';
import { IRecipeRepository } from '../../domain/repository';
import { GetRecipe } from '../../usecases/recipe/get-recipe';
import { GetRecipeByName } from '../../usecases/recipe/get-recipe-by-name';

describe('GetRecipe Use Case', () => {
  let mockRepo: IRecipeRepository;
  let getRecipe: GetRecipe;
  let getRecipeByName: GetRecipeByName;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn(),
      findByName: jest.fn(),
    } as unknown as IRecipeRepository;

    getRecipe = new GetRecipe(mockRepo);
    getRecipeByName = new GetRecipeByName(mockRepo);
  });

  test('should retrieve a recipe by ID successfully', async () => {
    const recipeId = uuidv4();
    const recipe = new Recipe(recipeId, 'Chocolate Cake', [], 'Misturar ingredientes e bater.');
    (mockRepo.findById as jest.Mock).mockResolvedValue(recipe);

    const result = await getRecipe.execute(recipeId);

    expect(result).toBeInstanceOf(Recipe);
    expect(result.id).toBe(recipeId);
    expect(result.name).toBe('Chocolate Cake');
    expect(mockRepo.findById).toHaveBeenCalledWith(recipeId);
  });
  test('should retrieve a recipe by name successfully', async () => {
    const recipeName = 'Chocolate Cake';
    const recipeId = uuidv4();
    const recipe = new Recipe(recipeId, recipeName, [], 'Misturar ingredientes e bater.');
    (mockRepo.findByName as jest.Mock).mockResolvedValue(recipe);

    const result = await getRecipeByName.execute(recipeName);

    expect(result).toBeInstanceOf(Recipe);
    expect(result.name).toBe(recipeName);
    expect(mockRepo.findByName).toHaveBeenCalledWith(recipeName);
  });
});
