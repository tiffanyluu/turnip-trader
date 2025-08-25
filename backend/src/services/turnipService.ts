export type TurnipPattern = "large_spike" | "small_spike" | "decreasing" | "random";

export interface TurnipWeek {
  pattern: TurnipPattern;
  buyPrice: number;
  prices: number[];
  weekDate: string;
}

export const generateTurnipWeek = (): TurnipWeek => {
  const buyPrice = 90 + Math.floor(Math.random() * 21);
  const patterns: TurnipPattern[] = ["large_spike", "small_spike", "decreasing", "random"];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];

  const prices: number[] = [];

  for (let i = 0; i < 6; i++) {
    if (pattern === "large_spike" && i === 2) {
      prices.push(buyPrice * (2.0 + Math.random() * 4.0));
    } else if (pattern === "small_spike" && i === 2) {
      prices.push(buyPrice * (1.4 + Math.random() * 0.6));
    } else if (pattern === "decreasing") {
      prices.push(buyPrice * (0.85 - i * 0.1));
    } else {
      prices.push(buyPrice * (0.7 + Math.random() * 0.6));
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