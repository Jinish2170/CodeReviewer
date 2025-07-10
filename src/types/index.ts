export interface CodeSuggestion {
  line_number: number;
  column_number?: number;
  severity: 'info' | 'warning' | 'error' | 'critical';
  type: 'performance' | 'security' | 'maintainability' | 'readability' | 'best_practices' | 'bug_fix';
  title: string;
  description: string;
  explanation: string;
  suggested_fix?: string;
  code_example?: string;
  learning_resources?: string[];
}

export interface CodeMetrics {
  lines_of_code: number;
  complexity_score: number;
  maintainability_index: number;
  test_coverage?: number;
  duplicate_lines: number;
}

export interface CodeReviewRequest {
  code: string;
  language: string;
  file_path?: string;
  context?: string;
  focus_areas?: string[];
}

export interface CodeReviewResponse {
  suggestions: CodeSuggestion[];
  metrics: CodeMetrics;
  overall_score: number;
  summary: string;
  learning_points: string[];
  next_steps: string[];
}

export interface AnalysisState {
  isLoading: boolean;
  result: CodeReviewResponse | null;
  error: string | null;
}
