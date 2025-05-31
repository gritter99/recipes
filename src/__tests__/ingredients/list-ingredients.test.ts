import { v4 as uuidv4 } from 'uuid';
import { Ingredient } from '../../domain/entity';
import { IIngredientRepository } from '../../domain/repository';
import { ListIngredients } from '../../usecases/ingredient/list-ingredients';

describe('ListIngredients Use Case', () => {
  let mockRepo: IIngredientRepository;
  let listIngredients: ListIngredients;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
    } as unknown as IIngredientRepository;

    listIngredients = new ListIngredients(mockRepo);
  });

  test('should retrieve all ingredients successfully', async () => {
    const ingredient1 = new Ingredient(uuidv4(), 'Farinha', 'gramas');
    const ingredient2 = new Ingredient(uuidv4(), 'Açúcar', 'gramas');
    (mockRepo.findAll as jest.Mock).mockResolvedValue([ingredient1, ingredient2]);

    const result = await listIngredients.execute();

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Ingredient);
    expect(result[1]).toBeInstanceOf(Ingredient);
    expect(result[0].name).toBe('Farinha');
    expect(result[1].name).toBe('Açúcar');
    expect(mockRepo.findAll).toHaveBeenCalled();
  });
});
