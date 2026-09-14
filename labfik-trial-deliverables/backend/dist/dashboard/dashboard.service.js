"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const asset_entity_1 = require("../assets/asset.entity");
const calibration_log_entity_1 = require("../calibration/calibration-log.entity");
const calibration_schedule_entity_1 = require("../calibration/calibration-schedule.entity");
const role_enum_1 = require("../common/enums/role.enum");
const work_order_entity_1 = require("../maintenance/work-order.entity");
const work_order_status_enum_1 = require("../maintenance/enums/work-order-status.enum");
const stock_opname_record_entity_1 = require("../stock-opname/stock-opname-record.entity");
const stock_opname_enum_1 = require("../stock-opname/enums/stock-opname.enum");
const vendor_entity_1 = require("../vendors/vendor.entity");
let DashboardService = class DashboardService {
    assetRepo;
    workOrderRepo;
    opnameRecordRepo;
    scheduleRepo;
    calibrationLogRepo;
    vendorRepo;
    ambangKalibrasiHari = 14;
    ambangVendorHari = 30;
    constructor(assetRepo, workOrderRepo, opnameRecordRepo, scheduleRepo, calibrationLogRepo, vendorRepo) {
        this.assetRepo = assetRepo;
        this.workOrderRepo = workOrderRepo;
        this.opnameRecordRepo = opnameRecordRepo;
        this.scheduleRepo = scheduleRepo;
        this.calibrationLogRepo = calibrationLogRepo;
        this.vendorRepo = vendorRepo;
    }
    async getOverview(filter, user) {
        const scope = await this.resolveScope(user);
        const [kpi, distribusiAset, trenKalibrasi, biayaMaintenance, perluPerhatian] = await Promise.all([
            this.getKpiWithScope(filter, scope),
            this.getAssetDistributionWithScope(filter, scope),
            this.getCalibrationTrendWithScope(filter, scope),
            this.getMaintenanceCostWithScope(filter, scope),
            this.getAttentionWithScope(filter, scope),
        ]);
        return {
            cakupan_data: scope.scope,
            filter,
            kpi,
            grafik: {
                distribusi_aset: distribusiAset,
                tren_kalibrasi: trenKalibrasi,
                biaya_maintenance: biayaMaintenance,
            },
            perlu_perhatian: perluPerhatian,
        };
    }
    async getKpi(filter, user) {
        return this.getKpiWithScope(filter, await this.resolveScope(user));
    }
    async getAssetDistribution(filter, user) {
        return this.getAssetDistributionWithScope(filter, await this.resolveScope(user));
    }
    async getCalibrationTrend(filter, user) {
        return this.getCalibrationTrendWithScope(filter, await this.resolveScope(user));
    }
    async getMaintenanceCost(filter, user) {
        return this.getMaintenanceCostWithScope(filter, await this.resolveScope(user));
    }
    async getAttention(filter, user) {
        return this.getAttentionWithScope(filter, await this.resolveScope(user));
    }
    async getKpiWithScope(filter, scope) {
        const assetBase = this.assetRepo.createQueryBuilder('asset');
        this.applyAssetFilter(assetBase, 'asset', filter, scope);
        const asetPerKategoriQuery = assetBase
            .clone()
            .select('asset.kategori', 'label')
            .addSelect('COUNT(asset.asset_id)', 'total')
            .groupBy('asset.kategori')
            .orderBy('asset.kategori', 'ASC');
        const overdueQuery = this.scheduleRepo
            .createQueryBuilder('schedule')
            .innerJoin(asset_entity_1.Asset, 'asset', 'asset.asset_id = schedule.asset_id::uuid')
            .where('schedule.tanggal_jatuh_tempo < CURRENT_DATE')
            .andWhere("schedule.status_kalibrasi != 'menunggu_perbaikan'");
        this.applyAssetFilter(overdueQuery, 'asset', filter, scope);
        this.applyDateFilter(overdueQuery, 'schedule.tanggal_jatuh_tempo', filter, true);
        const akanJatuhTempoQuery = this.scheduleRepo
            .createQueryBuilder('schedule')
            .innerJoin(asset_entity_1.Asset, 'asset', 'asset.asset_id = schedule.asset_id::uuid')
            .where('schedule.tanggal_jatuh_tempo >= CURRENT_DATE')
            .andWhere(`schedule.tanggal_jatuh_tempo <= CURRENT_DATE + INTERVAL '${this.ambangKalibrasiHari} days'`)
            .andWhere("schedule.status_kalibrasi != 'menunggu_perbaikan'");
        this.applyAssetFilter(akanJatuhTempoQuery, 'asset', filter, scope);
        this.applyDateFilter(akanJatuhTempoQuery, 'schedule.tanggal_jatuh_tempo', filter, true);
        const temuanQuery = this.opnameRecordRepo
            .createQueryBuilder('record')
            .innerJoin(asset_entity_1.Asset, 'asset', 'asset.asset_id = record.asset_id::uuid')
            .where('record.status_tindak_lanjut IN (:...statusTindakLanjut)', {
            statusTindakLanjut: [
                stock_opname_enum_1.StatusTindakLanjut.OPEN,
                stock_opname_enum_1.StatusTindakLanjut.IN_PROGRESS,
            ],
        });
        this.applyAssetFilter(temuanQuery, 'asset', filter, scope);
        this.applyDateFilter(temuanQuery, 'record.created_at', filter);
        const workOrderQuery = this.workOrderRepo
            .createQueryBuilder('wo')
            .innerJoin(asset_entity_1.Asset, 'asset', 'asset.asset_id = wo.asset_id::uuid')
            .where('wo.status_tiket IN (:...statusTiket)', {
            statusTiket: [
                work_order_status_enum_1.WorkOrderStatus.OPEN,
                work_order_status_enum_1.WorkOrderStatus.IN_PROGRESS,
                work_order_status_enum_1.WorkOrderStatus.RESOLVED,
            ],
        });
        this.applyAssetFilter(workOrderQuery, 'asset', filter, scope);
        this.applyDateFilter(workOrderQuery, 'wo.created_at', filter);
        const vendorQuery = this.buildVendorExpiringQuery(filter, scope);
        const [totalAset, asetPerKategoriRaw, kalibrasiOverdue, kalibrasiAkanJatuhTempo, temuanOpnameBelumDitindaklanjuti, workOrderAktif, sertifikatVendorAkanExpired,] = await Promise.all([
            assetBase.getCount(),
            asetPerKategoriQuery.getRawMany(),
            overdueQuery.getCount(),
            akanJatuhTempoQuery.getCount(),
            temuanQuery.getCount(),
            workOrderQuery.getCount(),
            vendorQuery.getCount(),
        ]);
        return {
            total_aset: totalAset,
            aset_per_kategori: this.mapCountRows(asetPerKategoriRaw),
            kalibrasi_overdue: kalibrasiOverdue,
            kalibrasi_akan_jatuh_tempo: kalibrasiAkanJatuhTempo,
            temuan_stock_opname_belum_ditindaklanjuti: temuanOpnameBelumDitindaklanjuti,
            work_order_aktif: workOrderAktif,
            sertifikat_vendor_akan_expired: sertifikatVendorAkanExpired,
        };
    }
    async getAssetDistributionWithScope(filter, scope) {
        const groupBy = async (column) => {
            const query = this.assetRepo.createQueryBuilder('asset');
            this.applyAssetFilter(query, 'asset', filter, scope);
            const rows = await query
                .select(`COALESCE(asset.${column}::text, 'tidak_diketahui')`, 'label')
                .addSelect('COUNT(asset.asset_id)', 'total')
                .groupBy(`asset.${column}`)
                .orderBy('total', 'DESC')
                .getRawMany();
            return this.mapCountRows(rows);
        };
        const lokasiQuery = this.assetRepo.createQueryBuilder('asset');
        this.applyAssetFilter(lokasiQuery, 'asset', filter, scope);
        const [perKategori, perLokasiRaw, perKondisi] = await Promise.all([
            groupBy('kategori'),
            lokasiQuery
                .select(`COALESCE(NULLIF(CONCAT_WS(' / ', asset.gedung, asset.lantai, asset.ruangan), ''), 'tidak_diketahui')`, 'label')
                .addSelect('COUNT(asset.asset_id)', 'total')
                .groupBy('asset.gedung')
                .addGroupBy('asset.lantai')
                .addGroupBy('asset.ruangan')
                .orderBy('total', 'DESC')
                .getRawMany(),
            groupBy('kondisi'),
        ]);
        return {
            per_kategori: perKategori,
            per_lokasi: this.mapCountRows(perLokasiRaw),
            per_kondisi: perKondisi,
        };
    }
    async getCalibrationTrendWithScope(filter, scope) {
        const query = this.calibrationLogRepo
            .createQueryBuilder('log')
            .innerJoin(asset_entity_1.Asset, 'asset', 'asset.asset_id = log.asset_id::uuid');
        this.applyAssetFilter(query, 'asset', filter, scope);
        this.applyDateFilter(query, 'log.tanggal_pelaksanaan', filter, true);
        const rows = await query
            .select("TO_CHAR(DATE_TRUNC('month', log.tanggal_pelaksanaan), 'YYYY-MM')", 'periode')
            .addSelect('COUNT(log.log_id)', 'total')
            .groupBy("DATE_TRUNC('month', log.tanggal_pelaksanaan)")
            .orderBy("DATE_TRUNC('month', log.tanggal_pelaksanaan)", 'ASC')
            .getRawMany();
        return rows.map((row) => ({ periode: row.periode, total: Number(row.total) }));
    }
    async getMaintenanceCostWithScope(filter, scope) {
        const query = this.workOrderRepo
            .createQueryBuilder('wo')
            .innerJoin(asset_entity_1.Asset, 'asset', 'asset.asset_id = wo.asset_id::uuid')
            .where('wo.biaya IS NOT NULL');
        this.applyAssetFilter(query, 'asset', filter, scope);
        this.applyDateFilter(query, 'COALESCE(wo.waktu_selesai, wo.updated_at)', filter);
        const rows = await query
            .select("TO_CHAR(DATE_TRUNC('month', COALESCE(wo.waktu_selesai, wo.updated_at)), 'YYYY-MM')", 'periode')
            .addSelect('COALESCE(SUM(wo.biaya), 0)', 'total')
            .groupBy("DATE_TRUNC('month', COALESCE(wo.waktu_selesai, wo.updated_at))")
            .orderBy("DATE_TRUNC('month', COALESCE(wo.waktu_selesai, wo.updated_at))", 'ASC')
            .getRawMany();
        return rows.map((row) => ({ periode: row.periode, total: Number(row.total) }));
    }
    async getAttentionWithScope(filter, scope) {
        const overdueQuery = this.scheduleRepo
            .createQueryBuilder('schedule')
            .innerJoin(asset_entity_1.Asset, 'asset', 'asset.asset_id = schedule.asset_id::uuid')
            .where('schedule.tanggal_jatuh_tempo < CURRENT_DATE')
            .andWhere("schedule.status_kalibrasi != 'menunggu_perbaikan'");
        this.applyAssetFilter(overdueQuery, 'asset', filter, scope);
        this.applyDateFilter(overdueQuery, 'schedule.tanggal_jatuh_tempo', filter, true);
        const temuanQuery = this.opnameRecordRepo
            .createQueryBuilder('record')
            .innerJoin(asset_entity_1.Asset, 'asset', 'asset.asset_id = record.asset_id::uuid')
            .where('record.status_tindak_lanjut IN (:...statusTindakLanjut)', {
            statusTindakLanjut: [stock_opname_enum_1.StatusTindakLanjut.OPEN, stock_opname_enum_1.StatusTindakLanjut.IN_PROGRESS],
        });
        this.applyAssetFilter(temuanQuery, 'asset', filter, scope);
        this.applyDateFilter(temuanQuery, 'record.created_at', filter);
        const vendorQuery = this.buildVendorExpiringQuery(filter, scope);
        const [asetOverdueKalibrasi, temuanOpnameOpen, sertifikatVendorMendekatiExpired] = await Promise.all([
            overdueQuery
                .select([
                'schedule.schedule_id AS schedule_id',
                'schedule.asset_id AS asset_id',
                'asset.nama_aset AS nama_aset',
                'asset.no_inventaris AS no_inventaris',
                'asset.gedung AS gedung',
                'asset.lantai AS lantai',
                'asset.ruangan AS ruangan',
                'schedule.tanggal_jatuh_tempo AS tanggal_jatuh_tempo',
            ])
                .orderBy('schedule.tanggal_jatuh_tempo', 'ASC')
                .getRawMany(),
            temuanQuery
                .select([
                'record.record_id AS record_id',
                'record.asset_id AS asset_id',
                'asset.nama_aset AS nama_aset',
                'record.status_temuan AS status_temuan',
                'record.status_tindak_lanjut AS status_tindak_lanjut',
                'record.target_selesai AS target_selesai',
                'record.work_order_id AS work_order_id',
            ])
                .orderBy('record.target_selesai', 'ASC', 'NULLS LAST')
                .addOrderBy('record.created_at', 'ASC')
                .getRawMany(),
            vendorQuery
                .select([
                'vendor.vendor_id AS vendor_id',
                'vendor.nama_vendor AS nama_vendor',
                'vendor.no_akreditasi AS no_akreditasi',
                'vendor.tanggal_expired_akreditasi AS tanggal_expired_akreditasi',
                'vendor.status_akreditasi AS status_akreditasi',
            ])
                .orderBy('vendor.tanggal_expired_akreditasi', 'ASC')
                .getRawMany(),
        ]);
        return {
            aset_overdue_kalibrasi: asetOverdueKalibrasi,
            temuan_opname_open: temuanOpnameOpen,
            sertifikat_vendor_mendekati_expired: sertifikatVendorMendekatiExpired,
        };
    }
    async resolveScope(user) {
        const fullRoles = [
            role_enum_1.Role.KEPALA_LAB,
            role_enum_1.Role.TATA_USAHA,
            role_enum_1.Role.WAKIL_DEKAN,
        ];
        if (fullRoles.includes(user.role)) {
            return { scope: 'full', assetIds: null, vendorIds: null };
        }
        const assetIdSet = new Set();
        if (user.role === role_enum_1.Role.LABORAN) {
            const [assets, records, logs, workOrders] = await Promise.all([
                this.assetRepo.find({
                    select: { asset_id: true },
                    where: { pic_pengguna: user.userId },
                }),
                this.opnameRecordRepo.find({
                    select: { asset_id: true },
                    where: { dicatat_oleh: user.userId },
                }),
                this.calibrationLogRepo.find({
                    select: { asset_id: true },
                    where: { dicatat_oleh: user.userId },
                }),
                this.workOrderRepo.find({
                    select: { asset_id: true },
                    where: { dilaporkan_oleh: user.userId },
                }),
            ]);
            [...assets, ...records, ...logs, ...workOrders].forEach((row) => assetIdSet.add(row.asset_id));
        }
        else if (user.role === role_enum_1.Role.TEKNISI) {
            const workOrders = await this.workOrderRepo.find({
                select: { asset_id: true },
                where: { dikerjakan_oleh: user.userId },
            });
            workOrders.forEach((row) => assetIdSet.add(row.asset_id));
        }
        const assetIds = [...assetIdSet];
        const vendorIds = assetIds.length
            ? [
                ...new Set((await this.calibrationLogRepo
                    .createQueryBuilder('log')
                    .select('log.vendor_id', 'vendor_id')
                    .where('log.asset_id IN (:...assetIds)', { assetIds })
                    .andWhere('log.vendor_id IS NOT NULL')
                    .getRawMany()).map((row) => row.vendor_id)),
            ]
            : [];
        return { scope: 'terbatas', assetIds, vendorIds };
    }
    applyAssetFilter(query, alias, filter, scope) {
        if (scope.assetIds !== null) {
            if (scope.assetIds.length === 0)
                query.andWhere('1 = 0');
            else
                query.andWhere(`${alias}.asset_id IN (:...scopeAssetIds)`, {
                    scopeAssetIds: scope.assetIds,
                });
        }
        if (filter.gedung)
            query.andWhere(`${alias}.gedung = :gedung`, { gedung: filter.gedung });
        if (filter.lantai)
            query.andWhere(`${alias}.lantai = :lantai`, { lantai: filter.lantai });
        if (filter.ruangan)
            query.andWhere(`${alias}.ruangan = :ruangan`, { ruangan: filter.ruangan });
        if (filter.kategori)
            query.andWhere(`${alias}.kategori = :kategori`, { kategori: filter.kategori });
    }
    applyDateFilter(query, column, filter, isDateColumn = false) {
        if (filter.tanggal_mulai) {
            query.andWhere(`${column} >= :tanggalMulai`, {
                tanggalMulai: filter.tanggal_mulai,
            });
        }
        if (filter.tanggal_selesai) {
            query.andWhere(isDateColumn
                ? `${column} <= :tanggalSelesai`
                : `${column} < (CAST(:tanggalSelesai AS date) + INTERVAL '1 day')`, { tanggalSelesai: filter.tanggal_selesai });
        }
    }
    buildVendorExpiringQuery(filter, scope) {
        const query = this.vendorRepo
            .createQueryBuilder('vendor')
            .where('vendor.tanggal_expired_akreditasi >= CURRENT_DATE')
            .andWhere(`vendor.tanggal_expired_akreditasi <= CURRENT_DATE + INTERVAL '${this.ambangVendorHari} days'`);
        if (scope.vendorIds !== null) {
            if (scope.vendorIds.length === 0)
                query.andWhere('1 = 0');
            else
                query.andWhere('vendor.vendor_id IN (:...scopeVendorIds)', {
                    scopeVendorIds: scope.vendorIds,
                });
        }
        const hasAssetFilter = Boolean(filter.gedung || filter.lantai || filter.ruangan || filter.kategori);
        if (hasAssetFilter) {
            query
                .innerJoin(calibration_log_entity_1.CalibrationLog, 'log', 'log.vendor_id = vendor.vendor_id::varchar')
                .innerJoin(asset_entity_1.Asset, 'asset', 'asset.asset_id = log.asset_id::uuid')
                .distinct(true);
            this.applyAssetFilter(query, 'asset', filter, scope);
        }
        this.applyDateFilter(query, 'vendor.tanggal_expired_akreditasi', filter, true);
        return query;
    }
    mapCountRows(rows) {
        return rows.map((row) => ({ label: row.label, total: Number(row.total) }));
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asset_entity_1.Asset)),
    __param(1, (0, typeorm_1.InjectRepository)(work_order_entity_1.WorkOrder)),
    __param(2, (0, typeorm_1.InjectRepository)(stock_opname_record_entity_1.StockOpnameRecord)),
    __param(3, (0, typeorm_1.InjectRepository)(calibration_schedule_entity_1.CalibrationSchedule)),
    __param(4, (0, typeorm_1.InjectRepository)(calibration_log_entity_1.CalibrationLog)),
    __param(5, (0, typeorm_1.InjectRepository)(vendor_entity_1.Vendor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map