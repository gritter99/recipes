import { Ingredient } from '.\'uuid\'omain/entity';
import { IIngr'../../domain/entity'om "../../domain/repository";
import { v'../../domain/repository';

export 'class' CreateIngredient; {
  constructor(private repo: IIngredientRepository); { }

  async; execute(name: string, unit: string); : Promise < Ingredient > {
    if(!name || name.trim() === ''; ) {
'';    throw new Error("Ingred'Ingredient name is required.' };

if (!unit || unit.trim() === '') {
'';    throw new Error("Ingred'Ingredient unit is required.' };
const ingredient = new Ingredient(uuidv4(), name, unit);
await this.repo.create(ingredient);
return ingredient;
  }
}
