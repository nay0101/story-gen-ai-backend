import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import { config } from "dotenv";
import { initDB } from "./db/index";
import { createRoutes } from "./routes/story.route";

config();

const start = async () => {
  const app = express();
  const pool = await initDB();
  const port = process.env.NODE_PORT || 8080;

  app.use(cors());
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use("/api/health", (_, res) => {
    res.status(200).send("OK");
  });

  app.use("/api/stories", createRoutes(pool));

  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  process.on("SIGINT", async () => {
    await pool.end();
    process.exit();
  });
};

start().catch(console.error);
