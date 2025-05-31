import { Pool } from 'pg';
import { Ingredient } from '../../domain/entity';
import { IIngredientRepository } from '../../domain/repository';

export class PostgresIngredientRepository implements IIngredientRepository {
  private pool: Pool;

  constructor(pool?: Pool) {
    this.pool = pool ?? new Pool({
      host: process.env.PG_HOST || 'localhost',
      port: +(process.env.PG_PORT || 5432),
      user: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASSWORD || '',
      database: process.env.PG_DATABASE || 'mydb',
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  public async create(ingredient: Ingredient): Promise<void> {
    const query = `
      INSERT INTO ingredients (id, name, unit)
      VALUES ($1, $2, $3)
    `;
    const values = [ingredient.id, ingredient.name, ingredient.unit];
    await this.pool.query(query, values);
  }

  public async findById(id: string): Promise<Ingredient | null> {
    const query = `
      SELECT id, name, unit
      FROM ingredients
      WHERE id = $1
    `;
    const { rows } = await this.pool.query(query, [id]);
    if (rows.length === 0) { return null; }
    const { name, unit } = rows[0];
    return new Ingredient(id, name, unit);
  }

  public async findAll(): Promise<Ingredient[]> {
    const query = `
      SELECT id, name, unit
      FROM ingredients
    `;
    const { rows } = await this.pool.query(query);
    return rows.map((r) => new Ingredient(r.id, r.name, r.unit));
  }

  public async update(ingredient: Ingredient): Promise<void> {
    const query = `
      UPDATE ingredients
      SET name = $2,
          unit = $3
      WHERE id = $1
    `;
    const values = [ingredient.id, ingredient.name, ingredient.unit];
    await this.pool.query(query, values);
  }

  public async delete(id: string): Promise<void> {
    const query = `
      DELETE FROM ingredients
      WHERE id = $1
    `;
    await this.pool.query(query, [id]);
  }

  public async findByName(name: string): Promise<Ingredient | null> {
    const query = `
      SELECT id, name, unit
      FROM ingredients
      WHERE LOWER(name) = LOWER($1)
      LIMIT 1
    `;
    const { rows } = await this.pool.query(query, [name]);
    if (rows.length === 0) { return null; }
    const { id, name: nm, unit } = rows[0];
    return new Ingredient(id, nm, unit);
  }

  public async dispose(): Promise<void> {
    await this.pool.end();
  }
}
