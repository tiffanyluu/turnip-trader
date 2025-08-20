import dotenv from "dotenv";
dotenv.config();
import { generateEmbedding } from "../services/openaiService";
import pool from "../db";
import { turnipGuides } from "./turnipGuides";

const seedTurnipGuides = async () => {
  try {
    console.log("Seeding turnip guides...");

    for (const guide of turnipGuides) {
      console.log(`Processing: ${guide.title}`);
      const embedding = await generateEmbedding(guide.content);

      const vectorString = `[${embedding.join(",")}]`;

      await pool.query(
        "INSERT INTO guides (title, content, embedding) VALUES ($1, $2, $3)",
        [guide.title, guide.content, vectorString]
      );
    }

    console.log("Successfully seeded all turnip guides");
  } catch (error) {
    console.error("Error seeding guides:", error);
  } finally {
    await pool.end();
  }
};

seedTurnipGuides();
