export type TurnipPattern = "spike" | "decreasing" | "random" | "flat" | "mixed";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}