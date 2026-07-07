// V0 stub — analytics types
export type OfficeUsageAnalyticsParams = {
  gatewayUrl?: string;
};

export function useOfficeUsageAnalyticsViewModel(_params: OfficeUsageAnalyticsParams) {
  return {
    totalRuns: 0,
    totalTokens: 0,
    totalCost: 0,
    topModels: [],
  };
}
