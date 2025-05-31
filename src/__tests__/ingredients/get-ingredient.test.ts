import { v4 as uuidv4 } from 'uuid';
import { Ingredient } from '../../domain/entity';
import { IIngredientRepository } from '../../domain/repository';
import { GetIngredient } from '../../usecases/ingredient/get-ingredient';
import { GetIngredientByName } from '../../usecases/ingredient/get-ingredient-by-name';

describe('GetIngredient Use Case', () => {
  let mockRepo: IIngredientRepository;
  let getIngredient: GetIngredient;
  let getIngredientByName: GetIngredientByName;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn(),
      findByName: jest.fn(),
    } as unknown as IIngredientRepository;

    getIngredient = new GetIngredient(mockRepo);
    getIngredientByName = new GetIngredientByName(mockRepo);
  });

  test('should retrieve an ingredient by ID successfully', async () => {
    const ingredientId = uuidv4();
    const ingredient = new Ingredient(ingredientId, 'Farinha', 'gramas');
    (mockRepo.findById as jest.Mock).mockResolvedValue(ingredient);

    const result = await getIngredient.execute(ingredientId);

    expect(result).toBeInstanceOf(Ingredient);
    expect(result).not.toBeNull();
    expect(result!.id).toBe(ingredientId);
    expect(result!.name).toBe('Farinha');
    expect(mockRepo.findById).toHaveBeenCalledWith(ingredientId);
  });
  test('should retrieve an ingredient by name successfully', async () => {
    const ingredientName = 'Farinha';
    const ingredientId = uuidv4();
    const ingredient = new Ingredient(ingredientId, ingredientName, 'gramas');
    (mockRepo.findByName as jest.Mock).mockResolvedValue(ingredient);

    const result = await getIngredientByName.execute(ingredientName);

    expect(result).toBeInstanceOf(Ingredient);
    expect(result).not.toBeNull();
    expect(result!.name).toBe(ingredientName);
    expect(mockRepo.findByName).toHaveBeenCalledWith(ingredientName);
  });
});
