import { Pool } from 'pg';

export async function setupDatabase() {
  const pool = new Pool({
    host: process.env.PG_HOST,
    port: +(process.env.PG_PORT || 5432),
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ingredients (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      unit TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS recipes (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      preparation TEXT
    );

    CREATE TABLE IF NOT EXISTS recipe_ingredients (
      recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
      ingredient_id UUID REFERENCES ingredients(id),
      quantity NUMERIC NOT NULL,
      PRIMARY KEY (recipe_id, ingredient_id)
    );
  `);

  await pool.end();
}
