export interface RateLimitWindow {
  used_percentage: number;
  resets_at: number;
}

export interface CostInfo {
  total_cost_usd?: number;
  total_duration_ms?: number;
}

export interface ContextWindow {
  used_percentage?: number;
  context_window_size?: number;
  total_input_tokens?: number;
  total_output_tokens?: number;
}

export interface StatuslineInput {
  model: {
    id: string;
    display_name: string;
  };
  workspace: {
    current_dir: string;
    project_dir: string;
  };
  cwd?: string;
  transcript_path?: string;
  version?: string;
  cost?: CostInfo;
  context_window?: ContextWindow;
  rate_limits?: {
    five_hour?: RateLimitWindow;
    seven_day?: RateLimitWindow;
  };
}