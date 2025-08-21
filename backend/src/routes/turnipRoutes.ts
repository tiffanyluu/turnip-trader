import { Router, Request, Response } from "express";
import { generateTurnipWeek, analyzePattern } from "../services/turnipService";
import pool from "../db";
import { generateAdvice, generateEmbedding } from "../services/openaiService";
import { safeRedisGet, safeRedisSet } from "../cache/redis";

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

    res.json({
      success: true,
      data: {
        id: result.rows[0].id,
        ...week,
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

router.post("/predict", async (req: Request, res: Response) => {
  try {
    const { prices } = req.body;

    if (!prices || !Array.isArray(prices)) {
      return res.status(400).json({
        success: false,
        error: "Prices array is required",
      });
    }

    const analysis = analyzePattern(prices);

    return res.json({
      success: true,
      data: analysis,
    });
  } catch (error: unknown) {
    console.error("Predict error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to analyze prices",
    });
  }
});

router.post("/advice", async (req: Request, res: Response) => {
  try {
    const { prices, pattern } = req.body;

    if (!prices || !Array.isArray(prices)) {
      return res.status(400).json({
        success: false,
        error: "Prices array is required.",
      });
    }

    const pricesText = `Current turnip prices: ${prices.join(
      ", "
    )} beels. Pattern appears to be: ${pattern || "unknown"}`;
    const relevantGuides = await findRelevantGuides(pricesText);

    const context = relevantGuides
      .map((guide) => `${guide.title}: ${guide.content}`)
      .join("\\n\\n");

    const advice = await generateAdvice(context, pricesText);

    return res.json({
      success: true,
      data: {
        advice,
        guidesUsed: relevantGuides.map((g) => g.title),
        confidence: relevantGuides.length > 0 ? 0.8 : 0.5,
      },
    });
  } catch (error: unknown) {
    console.error("Advice error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to generate advice",
    });
  }
});

const findRelevantGuides = async (queryText: string): Promise<Guide[]> => {
  const cacheKey = `guides:${Buffer.from(queryText.toLowerCase().trim()).toString("base64")}`;
  
  try {
    // Try to get from cache first
    const cached = await safeRedisGet(cacheKey);
    if (cached) {
      console.log('Cache hit for guides query');
      return JSON.parse(cached);
    }

    console.log('Cache miss, performing vector search...');
    
    // Not in cache, do the expensive vector search
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
    
    // Cache the result for 1 hour (3600 seconds)
    await safeRedisSet(cacheKey, JSON.stringify(result.rows), 3600);
    console.log('Cached guides result for 1 hour');
    
    return result.rows;
  } catch (error) {
    console.error("Error finding guides with vector search:", error);

    // Fallback to keyword search (no caching for fallback)
    try {
      const keyword = queryText.toLowerCase().includes("decreasing")
        ? "%decreasing%"
        : queryText.toLowerCase().includes("spike")
        ? "%spike%"
        : "%random%";

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
