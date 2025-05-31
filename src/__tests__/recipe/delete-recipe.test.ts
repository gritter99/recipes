import { v4 as uuidv4 } from 'uuid';
import { Recipe } from '../../domain/entity';
import { IRecipeRepository } from '../../domain/repository';
import { DeleteRecipe } from '../../usecases/recipe/delete-recipe';

describe('DeleteRecipe Use Case', () => {
  let mockRepo: IRecipeRepository;
  let deleteRecipe: DeleteRecipe;

  beforeEach(() => {
    mockRepo = {
      delete: jest.fn(),
      findById: jest.fn(),
    } as unknown as IRecipeRepository;

    deleteRecipe = new DeleteRecipe(mockRepo);
  });

  test('should delete a recipe successfully', async () => {
    const recipeId = uuidv4();
    const name = 'Bolo de chocolate';
    const ingredients = [
      { ingredient: { id: uuidv4(), name: 'Farinha', unit: 'gramas' }, quantity: 2 },
      { ingredient: { id: uuidv4(), name: 'Açúcar', unit: 'gramas' }, quantity: 3 },
    ];
    const preparation = 'Misturar ingredientes e bater.';

    const existingRecipe = new Recipe(recipeId, name, ingredients, preparation);
    (mockRepo.findById as jest.Mock).mockResolvedValue(existingRecipe);

    await deleteRecipe.execute(recipeId);

    expect(mockRepo.delete).toHaveBeenCalledWith(recipeId);
  });

});
