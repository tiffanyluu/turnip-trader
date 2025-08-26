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
  if (process.env.NODE_ENV === 'test') {
    return [
      {
        id: 1,
        title: "Mock Guide",
        content: "Mock trading advice for testing"
      }
    ];
  }
  
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

router.get("/setup-db", async (_req: Request, res: Response) => {
  try {
    console.log('Setting up database tables...');
    await pool.query('CREATE EXTENSION IF NOT EXISTS vector;');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS guides (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        embedding vector(1536),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS turnip_weeks (
        id SERIAL PRIMARY KEY,
        week_date DATE NOT NULL,
        pattern_type VARCHAR(50) NOT NULL CHECK (pattern_type IN ('large_spike', 'small_spike', 'decreasing', 'random')),
        prices JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    res.json({ success: true, message: "Database tables created successfully" });
  } catch (error) {
    console.error("Setup error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/seed-guides", async (_req: Request, res: Response) => {
  try {
    console.log("Seeding turnip guides...");

    const guides = [
      {
        title: "Understanding Turnip Patterns - The Basics",
        content: "There are four main turnip patterns in Animal Crossing: Large Spike, Small Spike, Decreasing, and Random. Large spike patterns have one massive price increase (200-600% of buy price) during the week, usually Tuesday-Thursday. Small spike patterns have a moderate increase (140-200%). Decreasing patterns steadily drop from Monday to Saturday. Random patterns fluctuate unpredictably with small peaks."
      },
      {
        title: "When to Sell - Timing Your Sales", 
        content: "Monitor your prices daily. If you see prices above 150 bells and you bought for 90-110, that's usually a good profit. Don't wait too long on Thursday/Friday as prices often crash. Saturday is your last chance, so sell even at a loss rather than lose everything."
      },
      {
        title: "Large Spike Pattern Recognition",
        content: "Large spikes typically happen Tuesday through Thursday. Look for a sudden jump from low prices (60-80 bells) to very high prices (300-600 bells). This is the most profitable pattern - sell immediately during the spike as it only lasts one price period and won't repeat."
      },
      {
        title: "Small Spike Pattern Strategy", 
        content: "Small spikes reach 140-200% of your buy price and are more predictable than large spikes. They usually occur mid-week after an initial price drop. While not as profitable as large spikes, they're still good opportunities - sell during the peak."
      },
      {
        title: "Decreasing Pattern Strategy",
        content: "If Monday and Tuesday prices keep dropping, you're likely in a decreasing pattern. Cut your losses early - sell by Wednesday if possible. Waiting longer will only make losses worse. Better to lose 20-30% than 60-80%."
      },
      {
        title: "Random Pattern Strategy",
        content: "Random patterns can surprise you with good prices any day, but peaks rarely exceed 140% of buy price. Monitor prices carefully and sell when you see a good opportunity above 120-130 bells. Don't wait too long as random patterns can drop unexpectedly."
      },
      {
        title: "Risk Management for Turnip Trading",
        content: "Never invest more than you can afford to lose. Diversify by visiting friends' islands for better prices. Keep track of your patterns week to week. If you've had decreasing patterns recently, you're more likely to get a spike pattern next week."
      },
      {
        title: "Using Online Tools and Communities", 
        content: "Join turnip trading communities to find islands with good prices. Use prediction tools to forecast your week's pattern. Share your prices to help others. Remember that patterns can change, so always have a backup plan."
      },
      {
        title: "Common Mistakes to Avoid",
        content: "Don't hold turnips past Saturday - they rot Sunday morning. Don't panic sell on Monday unless prices are really good. Don't ignore daily price checks. Don't travel backwards in time as it will rot your turnips instantly."
      }
    ];

    for (const guide of guides) {
      console.log(`Processing: ${guide.title}`);
      
      const { generateEmbedding } = require('../services/openaiService');
      const embedding = await generateEmbedding(guide.content);
      const vectorString = `[${embedding.join(",")}]`;

      await pool.query(
        "INSERT INTO guides (title, content, embedding) VALUES ($1, $2, $3)",
        [guide.title, guide.content, vectorString]
      );
    }

    res.json({ success: true, message: "Successfully seeded all turnip guides" });
  } catch (error) {
    console.error("Seeding error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
