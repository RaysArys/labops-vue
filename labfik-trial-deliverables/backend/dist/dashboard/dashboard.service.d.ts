import { Repository } from 'typeorm';
import { Asset } from '../assets/asset.entity';
import { CalibrationLog } from '../calibration/calibration-log.entity';
import { CalibrationSchedule } from '../calibration/calibration-schedule.entity';
import { RequestUser } from '../common/decorators/current-user.decorator';
import { WorkOrder } from '../maintenance/work-order.entity';
import { StockOpnameRecord } from '../stock-opname/stock-opname-record.entity';
import { Vendor } from '../vendors/vendor.entity';
import { DashboardFilterDto } from './dto/dashboard-filter.dto';
import { DashboardCountByLabel, DashboardPeriodValue } from './dashboard.types';
export declare class DashboardService {
    private readonly assetRepo;
    private readonly workOrderRepo;
    private readonly opnameRecordRepo;
    private readonly scheduleRepo;
    private readonly calibrationLogRepo;
    private readonly vendorRepo;
    private readonly ambangKalibrasiHari;
    private readonly ambangVendorHari;
    constructor(assetRepo: Repository<Asset>, workOrderRepo: Repository<WorkOrder>, opnameRecordRepo: Repository<StockOpnameRecord>, scheduleRepo: Repository<CalibrationSchedule>, calibrationLogRepo: Repository<CalibrationLog>, vendorRepo: Repository<Vendor>);
    getOverview(filter: DashboardFilterDto, user: RequestUser): Promise<{
        cakupan_data: import("./dashboard.types").DashboardScope;
        filter: DashboardFilterDto;
        kpi: {
            total_aset: number;
            aset_per_kategori: DashboardCountByLabel[];
            kalibrasi_overdue: number;
            kalibrasi_akan_jatuh_tempo: number;
            temuan_stock_opname_belum_ditindaklanjuti: number;
            work_order_aktif: number;
            sertifikat_vendor_akan_expired: number;
        };
        grafik: {
            distribusi_aset: {
                per_kategori: DashboardCountByLabel[];
                per_lokasi: DashboardCountByLabel[];
                per_kondisi: DashboardCountByLabel[];
            };
            tren_kalibrasi: DashboardPeriodValue[];
            biaya_maintenance: DashboardPeriodValue[];
        };
        perlu_perhatian: {
            aset_overdue_kalibrasi: any[];
            temuan_opname_open: any[];
            sertifikat_vendor_mendekati_expired: any[];
        };
    }>;
    getKpi(filter: DashboardFilterDto, user: RequestUser): Promise<{
        total_aset: number;
        aset_per_kategori: DashboardCountByLabel[];
        kalibrasi_overdue: number;
        kalibrasi_akan_jatuh_tempo: number;
        temuan_stock_opname_belum_ditindaklanjuti: number;
        work_order_aktif: number;
        sertifikat_vendor_akan_expired: number;
    }>;
    getAssetDistribution(filter: DashboardFilterDto, user: RequestUser): Promise<{
        per_kategori: DashboardCountByLabel[];
        per_lokasi: DashboardCountByLabel[];
        per_kondisi: DashboardCountByLabel[];
    }>;
    getCalibrationTrend(filter: DashboardFilterDto, user: RequestUser): Promise<DashboardPeriodValue[]>;
    getMaintenanceCost(filter: DashboardFilterDto, user: RequestUser): Promise<DashboardPeriodValue[]>;
    getAttention(filter: DashboardFilterDto, user: RequestUser): Promise<{
        aset_overdue_kalibrasi: any[];
        temuan_opname_open: any[];
        sertifikat_vendor_mendekati_expired: any[];
    }>;
    private getKpiWithScope;
    private getAssetDistributionWithScope;
    private getCalibrationTrendWithScope;
    private getMaintenanceCostWithScope;
    private getAttentionWithScope;
    private resolveScope;
    private applyAssetFilter;
    private applyDateFilter;
    private buildVendorExpiringQuery;
    private mapCountRows;
}
