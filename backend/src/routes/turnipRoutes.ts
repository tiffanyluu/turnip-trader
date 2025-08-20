import { Router, Request, Response } from "express";
import { generateTurnipWeek } from "../services/turnipService";
import pool from "../db";
import { generateAdvice, generateEmbedding } from "../services/openaiService";

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

async function findRelevantGuides(queryText: string) {
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
  }
}

const analyzePattern = (prices: number[]) => {
  const hasSpike = prices.some((price) => price > prices[0] * 1.5);
  const isDecreasing = prices.every(
    (price, i) => i === 0 || price <= prices[i - 1]
  );

  if (hasSpike) {
    return {
      likelyPattern: "spike",
      confidence: 0.8,
      advice: "Looks like a spike pattern! Consider selling during the peak.",
    };
  } else if (isDecreasing) {
    return {
      likelyPattern: "decreasing",
      confidence: 0.9,
      advice: "Decreasing pattern detected. Sell soon to minimize losses.",
    };
  } else {
    return {
      likelyPattern: "random",
      confidence: 0.6,
      advice: "Random pattern. Monitor prices and sell when profitable.",
    };
  }
};

export default router;
