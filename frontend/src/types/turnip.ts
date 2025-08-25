export type TurnipPattern = "large_spike" | "small_spike" | "decreasing" | "random";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}