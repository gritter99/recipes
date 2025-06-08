import { Pool, PoolClient } from 'pg';
import { Recipe, RecipeIngredient, Ingredient } from "../../domain/entity";
import { IRecipeRepository } from "../../domain/repository";

export class PostgresRecipeRepository implements IRecipeRepository {
  private pool: Pool;

  constructor(pool?: Pool) {
    this.pool = pool ?? new Pool({
      host: process.env.PG_HOST || 'localhost',
      port: +(process.env.PG_PORT || 5432),
      user: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASSWORD || '',
      database: process.env.PG_DATABASE || 'mydb',
      // ssl: {
      //   rejectUnauthorized: false
      // }
    });
  }

  private async withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async create(recipe: Recipe): Promise<void> {
    console.log("Iniciando criação da receita...");
    console.log("Receita recebida:", {
      id: recipe.id,
      name: recipe.name,
      preparation: recipe.preparation,
      ingredients: recipe.ingredients.map(i => ({
        ingredientId: i.ingredient.id,
        name: i.ingredient.name,
        unit: i.ingredient.unit,
        quantity: i.quantity
      }))
    });

    await this.withTransaction(async client => {
      const insertRecipe = `
        INSERT INTO recipes (id, name, preparation)
        VALUES ($1, $2, $3)
      `;
      console.log("Inserindo receita na tabela 'recipes'...");
      await client.query(insertRecipe, [recipe.id, recipe.name, recipe.preparation]);

      const insertLink = `
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity)
        VALUES ($1, $2, $3)
      `;
      for (const ri of recipe.ingredients) {
        console.log(`Vinculando ingrediente ${ri.ingredient.id} à receita ${recipe.id} com quantidade ${ri.quantity}...`);
        await client.query(insertLink, [
          recipe.id,
          ri.ingredient.id,
          ri.quantity,
        ]);
      }
    });

    console.log(`✅ Receita '${recipe.name}' criada com sucesso (ID: ${recipe.id})`);
  }


  async findById(id: string): Promise<Recipe | null> {
    const recQ = `SELECT id, name, preparation FROM recipes WHERE id = $1`;
    const { rows: recRows } = await this.pool.query(recQ, [id]);
    if (recRows.length === 0) return null;
    const { name, preparation } = recRows[0];

    const ingQ = `
      SELECT i.id AS ingr_id, i.name AS ingr_name, i.unit AS ingr_unit, ri.quantity
      FROM recipe_ingredients ri
      JOIN ingredients i ON ri.ingredient_id = i.id
      WHERE ri.recipe_id = $1
    `;
    const { rows: ingRows } = await this.pool.query(ingQ, [id]);

    const ingredients: RecipeIngredient[] = ingRows.map(r => ({
      ingredient: new Ingredient(r.ingr_id, r.ingr_name, r.ingr_unit),
      quantity: r.quantity,
    }));

    return new Recipe(id, name, ingredients, preparation);
  }

  async findAll(): Promise<Recipe[]> {
    const recQ = `SELECT id, name, preparation FROM recipes`;
    const { rows } = await this.pool.query(recQ);
    const recipes: Recipe[] = [];

    for (const row of rows) {
      const ingQ = `
        SELECT i.id AS ingr_id, i.name AS ingr_name, i.unit AS ingr_unit, ri.quantity
        FROM recipe_ingredients ri
        JOIN ingredients i ON ri.ingredient_id = i.id
        WHERE ri.recipe_id = $1
      `;
      const { rows: ingRows } = await this.pool.query(ingQ, [row.id]);
      const ingredients: RecipeIngredient[] = ingRows.map(r => ({
        ingredient: new Ingredient(r.ingr_id, r.ingr_name, r.ingr_unit),
        quantity: r.quantity,
      }));

      recipes.push(new Recipe(row.id, row.name, ingredients, row.preparation));
    }

    return recipes;
  }

  async update(recipe: Recipe): Promise<void> {
    await this.withTransaction(async client => {
      const updRec = `
        UPDATE recipes SET name = $2, preparation = $3 WHERE id = $1
      `;
      await client.query(updRec, [recipe.id, recipe.name, recipe.preparation]);

      await client.query(`DELETE FROM recipe_ingredients WHERE recipe_id = $1`, [recipe.id]);
      const insertLink = `
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity)
        VALUES ($1, $2, $3)
      `;
      for (const ri of recipe.ingredients) {
        await client.query(insertLink, [recipe.id, ri.ingredient.id, ri.quantity]);
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.withTransaction(async client => {
      await client.query(`DELETE FROM recipe_ingredients WHERE recipe_id = $1`, [id]);
      await client.query(`DELETE FROM recipes WHERE id = $1`, [id]);
    });
  }

  async findByName(name: string): Promise<Recipe | null> {
    const recQ = `SELECT id, name, preparation FROM recipes WHERE LOWER(name) = LOWER($1) LIMIT 1`;
    const { rows } = await this.pool.query(recQ, [name]);
    if (rows.length === 0) return null;
    return this.findById(rows[0].id);
  }

  async dispose(): Promise<void> {
    await this.pool.end();
  }
}
