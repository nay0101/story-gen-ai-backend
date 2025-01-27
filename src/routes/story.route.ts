import { Router } from "express";
import { Pool } from "pg";
import { storyController } from "../controllers/story.controller";

export const createRoutes = (pool: Pool) => {
  const router = Router();
  const stories = storyController(pool);

  router.post("/generate", stories.create);
  router.get("/", stories.list);
  router.get("/:id", stories.get);

  return router;
};
