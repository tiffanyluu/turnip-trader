import { Router, Request, Response } from "express";
import { generateTurnipWeek } from "../services/turnipService";
import pool from "../db";
import { generateAdvice, generateEmbedding } from "../services/openaiService";

interface Guide {
  id: number;
  title: string;
  content: string;
  distance?: number;
}

const router = Router();

router.post("/simulate", async (_req: Request, res: Response) => {
  try {
    const week = generateTurnipWeek();

    const query = `
        INSERT INTO turnip_weeks (week_date, pattern_type, prices) 
        VALUES ($1, $2, $3) 
        RETURNING *
    `;

    const result = await pool.query(query, [
      week.weekDate || new Date().toISOString().split("T")[0],
      week.pattern,
      JSON.stringify({ buyPrice: week.buyPrice, prices: week.prices }),
    ]);

    const pricesText = `Current turnip prices: ${week.prices.join(
      ", "
    )} bells. Pattern appears to be: ${week.pattern}`;
    
    let advice = "I couldn't generate advice right now, but your pattern looks interesting!";
    
    try {
      const relevantGuides = await findRelevantGuides(pricesText);
      const context = relevantGuides
        .map((guide) => `${guide.title}: ${guide.content}`)
        .join("\\n\\n");
      
      advice = await generateAdvice(context, pricesText);
    } catch (adviceError) {
      console.log("Advice generation failed, using fallback:", adviceError);
    }

    res.json({
      success: true,
      data: {
        id: result.rows[0].id,
        ...week,
        advice: advice, 
      },
    });
  } catch (error: unknown) {
    console.log("Simulate error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate turnip week",
    });
  }
});

const findRelevantGuides = async (queryText: string): Promise<Guide[]> => {
  try {
    const queryEmbedding = await generateEmbedding(queryText);
    const queryVector = `[${queryEmbedding.join(",")}]`;

    const query = `
      SELECT id, title, content, 
             (embedding <=> $1::vector) as distance
      FROM guides 
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> $1::vector
      LIMIT 3
    `;

    const result = await pool.query(query, [queryVector]);
    return result.rows;
  } catch (error) {
    console.error("Error finding guides with vector search:", error);

    try {
      let keyword = "%random%";
      
      if (queryText.toLowerCase().includes("decreasing")) {
        keyword = "%decreasing%";
      } else if (queryText.toLowerCase().includes("large_spike")) {
        keyword = "%spike%";
      } else if (queryText.toLowerCase().includes("small_spike")) {
        keyword = "%spike%"; 
      } else if (queryText.toLowerCase().includes("spike")) {
        keyword = "%spike%";
      } else if (queryText.toLowerCase().includes("random")) {
        keyword = "%random%";
      }

      const fallbackResult = await pool.query(
        "SELECT id, title, content FROM guides WHERE LOWER(content) LIKE $1 LIMIT 3",
        [keyword]
      );
      return fallbackResult.rows;
    } catch (dbErr) {
      console.error("Fallback guide query error", dbErr);
      return [];
    }
  }
};

export default router;
