import { v4 as uuidv4 } from 'uuid';
import { Ingredient } from '../../domain/entity';
import { IIngredientRepository } from '../../domain/repository';
import { DeleteIngredient } from '../../usecases/ingredient/delete-ingredient';

describe('DeleteIngredient Use Case', () => {
  let mockRepo: IIngredientRepository;
  let deleteIngredient: DeleteIngredient;

  beforeEach(() => {
    mockRepo = {
      delete: jest.fn(),
      findById: jest.fn(),
    } as unknown as IIngredientRepository;

    deleteIngredient = new DeleteIngredient(mockRepo);
  });

  test('should delete an ingredient successfully', async () => {
    const ingredientId = uuidv4();
    const name = 'Farinha';
    const unit = 'gramas';

    const existingIngredient = new Ingredient(ingredientId, name, unit);
    (mockRepo.findById as jest.Mock).mockResolvedValue(existingIngredient);

    await deleteIngredient.execute(ingredientId);

    expect(mockRepo.delete).toHaveBeenCalledWith(ingredientId);
  });
});
