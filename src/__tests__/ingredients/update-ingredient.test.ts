import { v4 as uuidv4 } from 'uuid';
import { Ingredient } from '../../domain/entity';
import { IIngredientRepository } from '../../domain/repository';
import { UpdateIngredient } from '../../usecases/ingredient/update-ingredient';

describe('UpdateIngredient Use Case', () => {
  let mockRepo: IIngredientRepository;
  let updateIngredient: UpdateIngredient;

  beforeEach(() => {
    mockRepo = {
      update: jest.fn(),
      findById: jest.fn(),
    } as unknown as IIngredientRepository;

    updateIngredient = new UpdateIngredient(mockRepo);
  });

  test('should update an ingredient successfully', async () => {
    const ingredientId = uuidv4();
    const name = 'Farinha';
    const unit = 'gramas';

    const existingIngredient = new Ingredient(ingredientId, name, unit);
    (mockRepo.findById as jest.Mock).mockResolvedValue(existingIngredient);

    const updatedName = 'Açúcar';
    const updatedUnit = 'colheres';
    const updatedIngredient = await updateIngredient.execute(new Ingredient(ingredientId, updatedName, updatedUnit));

    expect(updatedIngredient).toBeInstanceOf(Ingredient);
    expect(updatedIngredient.id).toBe(ingredientId);
    expect(updatedIngredient.name).toBe(updatedName);
    expect(updatedIngredient.unit).toBe(updatedUnit);
    expect(mockRepo.update).toHaveBeenCalledWith(updatedIngredient);
  });

  test('should throw an error if the ingredient does not exist', async () => {
    const ingredientId = uuidv4();
    const name = 'Farinha';
    const unit = 'gramas';

    (mockRepo.findById as jest.Mock).mockResolvedValue(null);

    await expect(updateIngredient.execute(new Ingredient(ingredientId, name, unit))).rejects.toThrow();
  });
});
