import { CreateIngredient } from "../../usecases/ingredient/create-ingredient";
import { Ingredient } from "../../domain/entity";
import { IIngredientRepository } from "../../domain/repository";
import { v4 as uuidv4 } from "uuid";

describe('CreateIngredient Use Case', () => {
  let mockRepo: IIngredientRepository;
  let createIngredient: CreateIngredient;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
    } as unknown as IIngredientRepository;

    createIngredient = new CreateIngredient(mockRepo);
  });

  test('should create an ingredient successfully', async () => {
    const name = "Farinha";
    const unit = "gramas";

    const result = await createIngredient.execute(name, unit);

    expect(result).toBeInstanceOf(Ingredient);
    expect(result.name).toBe(name);
    expect(result.unit).toBe(unit);
    expect(mockRepo.create).toHaveBeenCalledWith(result);
  });

  test('should throw an error if no name is provided', async () => {
    const name = "";
    const unit = "gramas";

    await expect(createIngredient.execute(name, unit)).rejects.toThrow();
  });

  test('should throw an error if no unit is provided', async () => {
    const name = "Farinha";
    const unit = "";

    await expect(createIngredient.execute(name, unit)).rejects.toThrow();
  });
});