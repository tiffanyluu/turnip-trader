export type TurnipPattern = "spike" | "decreasing" | "random";

export interface TurnipWeek {
  pattern: TurnipPattern;
  buyPrice: number;
  prices: number[];
  weekDate: string;
}

export const generateTurnipWeek = (): TurnipWeek => {
  const buyPrice = 90 + Math.floor(Math.random() * 21);
  const patterns: TurnipPattern[] = ["spike", "decreasing", "random"];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];

  const prices: number[] = [];

  for (let i = 0; i < 6; i++) {
    if (pattern === "spike" && i === 2) {
      prices.push(buyPrice * (1.5 + Math.random() * 1.5));
    } else if (pattern === "decreasing") {
      prices.push(buyPrice * (0.8 - i * 0.08));
    } else {
      prices.push(buyPrice * (0.6 + Math.random() * 0.6));
    }
  }

  const today = new Date();
  const weekDate = today.toISOString().split("T")[0];

  return {
    pattern,
    buyPrice,
    prices: prices.map((p) => Math.floor(p)),
    weekDate,
  };
};
