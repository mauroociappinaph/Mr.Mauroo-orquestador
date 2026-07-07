// V0 stub — cron types
export type CronJobSummary = {
  id: string;
  name: string;
  schedule: string;
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
};
