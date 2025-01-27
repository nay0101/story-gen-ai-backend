import { Pool } from "pg";

export const initDB = async (): Promise<Pool> => {
  try {
    const pool = new Pool({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      password: process.env.POSTGRES_PASSWORD,
      port: process.env.POSTGRES_PORT as number | undefined,
    });

    await pool.query(`
      CREATE TABLE IF NOT EXISTS stories (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        characters TEXT NOT NULL,
        readingLevel TEXT NOT NULL,
        language TEXT NOT NULL,
        pages INTEGER NOT NULL,
        artStyle TEXT NOT NULL
      );
  
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        story_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        page_number INTEGER NOT NULL,
        page_content TEXT NOT NULL,
        image_url TEXT NOT NULL,
        FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
      );
    `);

    return pool;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
