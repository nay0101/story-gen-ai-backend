import { Story, Page } from "../types/db";
import { Pool } from "pg";

export const storyModel = (db: Pool) => ({
  async create(story: Story): Promise<number> {
    const { rows } = await db.query(
      "INSERT INTO stories (title, description, characters, readingLevel, language, pages, artStyle) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [
        story.title,
        story.description,
        story.characters,
        story.readingLevel,
        story.language,
        story.pages,
        story.artStyle,
      ]
    );

    return rows[0].id;
  },
  async findById(id: number): Promise<Story | null> {
    const { rows } = await db.query("SELECT * FROM stories WHERE id = $1", [
      id,
    ]);
    return rows[0] || null;
  },
  async findAll(): Promise<Story[] | null> {
    const { rows } = await db.query("SELECT * FROM stories");
    return rows || null;
  },
});

export const pageModel = (db: Pool) => ({
  async create(page: Page): Promise<number> {
    const { rows } = await db.query(
      "INSERT INTO pages (story_id, title, page_number, page_content, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [
        page.story_id,
        page.title,
        page.page_number,
        page.page_content,
        page.image_url,
      ]
    );
    return rows[0].id;
  },
  async findByStoryId(storyId: number): Promise<Page[]> {
    const { rows } = await db.query(
      "SELECT * FROM pages WHERE story_id = $1 ORDER BY page_number",
      [storyId]
    );
    return rows;
  },
});
