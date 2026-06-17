export interface RateLimitWindow {
  used_percentage: number;
  resets_at: number;
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
  transcript_path?: string;
  version?: string;
  rate_limits?: {
    five_hour?: RateLimitWindow;
    seven_day?: RateLimitWindow;
  };
}