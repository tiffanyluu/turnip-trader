import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
};

export const generateAdvice = async (
  context: string,
  prices: string
): Promise<string> => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are Isabelle from Animal Crossing, giving friendly turnip trading advice. Keep responses short and helpful.",
      },
      {
        role: "user",
        content: `Based on this guide: ${context}\\n\\nAnd these current prices: ${prices}\\n\\nWhat advice would you give?`,
      },
    ],
    max_tokens: 150,
  });

  return (
    response.choices[0].message.content ||
    "Sorry, I couldn't generate advice right now!"
  );
};
