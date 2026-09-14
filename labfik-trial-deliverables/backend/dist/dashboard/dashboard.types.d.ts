export type DashboardScope = 'full' | 'terbatas';
export interface DashboardScopeContext {
    scope: DashboardScope;
    assetIds: string[] | null;
    vendorIds: string[] | null;
}
export interface DashboardCountByLabel {
    label: string;
    total: number;
}
export interface DashboardPeriodValue {
    periode: string;
    total: number;
}
