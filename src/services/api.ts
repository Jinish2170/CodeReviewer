import axios from 'axios';
import { CodeReviewRequest, CodeReviewResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class CodeReviewService {
  static async analyzeCode(request: CodeReviewRequest): Promise<CodeReviewResponse> {
    try {
      const response = await api.post<CodeReviewResponse>('/analyze', request);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Failed to analyze code');
      }
      throw new Error('An unexpected error occurred');
    }
  }

  static async healthCheck(): Promise<{ status: string }> {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend service is not available');
    }
  }
}

export default CodeReviewService;
