import { v4 as uuidv4 } from 'uuid';
import { Recipe } from '../../domain/entity';
import { IRecipeRepository } from '../../domain/repository';
import { ListRecipes } from '../../usecases/recipe/list-recipes';

describe('ListRecipes Use Case', () => {
  let mockRepo: IRecipeRepository;
  let listRecipes: ListRecipes;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
    } as unknown as IRecipeRepository;

    listRecipes = new ListRecipes(mockRepo);
  });

  test('should retrieve all recipes successfully', async () => {
    const recipe1 = new Recipe(uuidv4(), 'Bolo de chocolate', [], 'Misturar ingredientes e bater.');
    const recipe2 = new Recipe(uuidv4(), 'Bolo de baunilha', [], 'Misturar ingredientes e assar.');
    (mockRepo.findAll as jest.Mock).mockResolvedValue([recipe1, recipe2]);

    const result = await listRecipes.execute();

    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Recipe);
    expect(result[0].name).toBe('Bolo de chocolate');
    expect(result[1].name).toBe('Bolo de baunilha');
    expect(mockRepo.findAll).toHaveBeenCalled();
  });
});
