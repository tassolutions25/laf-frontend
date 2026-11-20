export interface LafDashboardMetrics {
    monthlyRegistrations: number;
    totalRegisteredLafs: number;
    lastRegisteredLaf: string | null;
    todaysRegistrations: number;
}

export interface IterationDashboardMetrics {
    totalRegisteredIterations: number;
    totalRemainingIterations: number;
    totalFullyUtilizedIterations: number;
    iterationsNearMaximumLimit: number;
    configuredNearLimitThreshold: number;
    todaysIterations: number;
}

export interface DashboardSummaryResponse {
    lafDashboard: LafDashboardMetrics;
    iterationDashboard: IterationDashboardMetrics;
}