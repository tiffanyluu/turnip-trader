import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { ApiResponse, TurnipPattern } from '../types/turnip';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://turnip-trader.onrender.com/api';
const TIMEOUT = 10000;

interface SimulateData {
  id: number;
  pattern: TurnipPattern;
  buyPrice: number;
  prices: number[];
  weekDate: string;
  advice: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleApiError = (error: unknown, operation: string): never => {
  let userMessage = `Failed to ${operation}. Please try again.`;
  let consoleError: string = `${operation} failed`;

  if (axios.isAxiosError(error)) {
    if (error.response) {
      consoleError = `${operation} failed: ${error.response.status} - ${error.response.data?.error || error.response.statusText}`;
      
      if (error.response.status >= 500) {
        userMessage = 'Server error. Please try again later.';
      } else if (error.response.status === 400) {
        userMessage = error.response.data?.error || 'Invalid request. Please check your input.';
      }
    } else if (error.request) {
      consoleError = `${operation} failed: No response from server`;
      userMessage = 'Cannot connect to server. Please check your connection.';
    }
  } else if (error instanceof Error) {
    consoleError = `${operation} failed: ${error.message}`;
    userMessage = error.message;
  }

  console.error('API Error:', consoleError);
  throw new Error(userMessage);
};

export const simulateWeek = async (): Promise<SimulateData> => {
  try {
    const response: AxiosResponse<ApiResponse<SimulateData>> = await api.post('/simulate');
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.error || 'Simulation failed');
    }
  } catch (error) {
    return handleApiError(error, 'simulate turnip week');
  }
};

export default api;