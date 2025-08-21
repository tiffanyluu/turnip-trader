export type TurnipPattern = "spike" | "decreasing" | "random" | "flat" | "mixed";

export interface TurnipWeek {
  pattern: TurnipPattern;
  buyPrice: number;
  prices: number[];
  weekDate: string;
}

export const generateTurnipWeek = (): TurnipWeek => {
  const buyPrice = 90 + Math.floor(Math.random() * 21);
  const patterns: TurnipPattern[] = ["spike", "decreasing", "random", "flat", "mixed"];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];

  const prices: number[] = [];

  for (let i = 0; i < 6; i++) {
    if (pattern === "spike" && i === 2) {
      prices.push(buyPrice * (1.5 + Math.random() * 1.5));
    } else if (pattern === "decreasing") {
      prices.push(buyPrice * (0.8 - i * 0.08));
    } else if (pattern === "flat") {
      prices.push(buyPrice * (0.9 + Math.random() * 0.2));
    } else if (pattern === "mixed") {
      if (i <= 2) {
        prices.push(buyPrice * (1.2 + Math.random() * 0.6));
      } else {
        prices.push(buyPrice * (0.7 + Math.random() * 0.4));
      }
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

export const analyzePattern = (prices: number[]) => {
  if (!prices || prices.length === 0) {
    return {
      likelyPattern: "random",
      confidence: 0,
      advice: "No price data available",
    };
  }

  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  
  // Check for spike pattern
  const hasSpike = maxPrice > avgPrice * 1.8;
  const spikeDay = prices.indexOf(maxPrice);
  const isGoodSpikeDay = spikeDay >= 1 && spikeDay <= 3; // Tue-Thu
  
  // Check for decreasing pattern
  const isDecreasing = prices.every((price, i) => i === 0 || price <= prices[i - 1] * 1.1);
  
  // Check for flat pattern
  const isFlat = (maxPrice - minPrice) < avgPrice * 0.3;
  
  // Check for mixed pattern
  const earlyHigh = Math.max(...prices.slice(0, 3));
  const lateHigh = Math.max(...prices.slice(3));
  const isMixed = Math.abs(earlyHigh - lateHigh) > avgPrice * 0.5;

  // Determine best match
  if (hasSpike && !isMixed) {
    return {
      likelyPattern: "spike" as TurnipPattern,
      confidence: isGoodSpikeDay ? 0.85 : 0.7,
      advice: "Spike pattern! Sell during the peak for maximum profit.",
    };
  } else if (isDecreasing && !isMixed) {
    return {
      likelyPattern: "decreasing" as TurnipPattern,
      confidence: 0.8,
      advice: "Decreasing pattern. Sell soon to minimize losses.",
    };
  } else if (isFlat) {
    return {
      likelyPattern: "flat" as TurnipPattern,
      confidence: 0.75,
      advice: "Stable prices. Safe to hold or sell for small profit.",
    };
  } else if (isMixed) {
    return {
      likelyPattern: "mixed" as TurnipPattern,
      confidence: 0.6,
      advice: "Mixed pattern. Sell during any good peaks you see.",
    };
  } else {
    return {
      likelyPattern: "random" as TurnipPattern,
      confidence: 0.5,
      advice: "Random pattern. Monitor prices and sell when profitable.",
    };
  }
};