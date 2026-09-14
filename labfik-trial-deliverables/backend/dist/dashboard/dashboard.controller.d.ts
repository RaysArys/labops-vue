import type { RequestUser } from '../common/decorators/current-user.decorator';
import { DashboardService } from './dashboard.service';
import { DashboardFilterDto } from './dto/dashboard-filter.dto';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getOverview(filter: DashboardFilterDto, user: RequestUser): Promise<{
        cakupan_data: import("./dashboard.types").DashboardScope;
        filter: DashboardFilterDto;
        kpi: {
            total_aset: number;
            aset_per_kategori: import("./dashboard.types").DashboardCountByLabel[];
            kalibrasi_overdue: number;
            kalibrasi_akan_jatuh_tempo: number;
            temuan_stock_opname_belum_ditindaklanjuti: number;
            work_order_aktif: number;
            sertifikat_vendor_akan_expired: number;
        };
        grafik: {
            distribusi_aset: {
                per_kategori: import("./dashboard.types").DashboardCountByLabel[];
                per_lokasi: import("./dashboard.types").DashboardCountByLabel[];
                per_kondisi: import("./dashboard.types").DashboardCountByLabel[];
            };
            tren_kalibrasi: import("./dashboard.types").DashboardPeriodValue[];
            biaya_maintenance: import("./dashboard.types").DashboardPeriodValue[];
        };
        perlu_perhatian: {
            aset_overdue_kalibrasi: any[];
            temuan_opname_open: any[];
            sertifikat_vendor_mendekati_expired: any[];
        };
    }>;
    getKpi(filter: DashboardFilterDto, user: RequestUser): Promise<{
        total_aset: number;
        aset_per_kategori: import("./dashboard.types").DashboardCountByLabel[];
        kalibrasi_overdue: number;
        kalibrasi_akan_jatuh_tempo: number;
        temuan_stock_opname_belum_ditindaklanjuti: number;
        work_order_aktif: number;
        sertifikat_vendor_akan_expired: number;
    }>;
    getAssetDistribution(filter: DashboardFilterDto, user: RequestUser): Promise<{
        per_kategori: import("./dashboard.types").DashboardCountByLabel[];
        per_lokasi: import("./dashboard.types").DashboardCountByLabel[];
        per_kondisi: import("./dashboard.types").DashboardCountByLabel[];
    }>;
    getCalibrationTrend(filter: DashboardFilterDto, user: RequestUser): Promise<import("./dashboard.types").DashboardPeriodValue[]>;
    getMaintenanceCost(filter: DashboardFilterDto, user: RequestUser): Promise<import("./dashboard.types").DashboardPeriodValue[]>;
    getAttention(filter: DashboardFilterDto, user: RequestUser): Promise<{
        aset_overdue_kalibrasi: any[];
        temuan_opname_open: any[];
        sertifikat_vendor_mendekati_expired: any[];
    }>;
}
