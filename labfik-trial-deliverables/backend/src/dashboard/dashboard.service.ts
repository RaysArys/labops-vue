import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { Asset } from '../assets/asset.entity';
import { CalibrationLog } from '../calibration/calibration-log.entity';
import { CalibrationSchedule } from '../calibration/calibration-schedule.entity';
import { RequestUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { WorkOrder } from '../maintenance/work-order.entity';
import { WorkOrderStatus } from '../maintenance/enums/work-order-status.enum';
import { StockOpnameRecord } from '../stock-opname/stock-opname-record.entity';
import { StatusTindakLanjut } from '../stock-opname/enums/stock-opname.enum';
import { Vendor } from '../vendors/vendor.entity';
import { DashboardFilterDto } from './dto/dashboard-filter.dto';
import {
  DashboardCountByLabel,
  DashboardPeriodValue,
  DashboardScopeContext,
} from './dashboard.types';

@Injectable()
export class DashboardService {
  private readonly ambangKalibrasiHari = 14;
  private readonly ambangVendorHari = 30;

  constructor(
    @InjectRepository(Asset)
    private readonly assetRepo: Repository<Asset>,
    @InjectRepository(WorkOrder)
    private readonly workOrderRepo: Repository<WorkOrder>,
    @InjectRepository(StockOpnameRecord)
    private readonly opnameRecordRepo: Repository<StockOpnameRecord>,
    @InjectRepository(CalibrationSchedule)
    private readonly scheduleRepo: Repository<CalibrationSchedule>,
    @InjectRepository(CalibrationLog)
    private readonly calibrationLogRepo: Repository<CalibrationLog>,
    @InjectRepository(Vendor)
    private readonly vendorRepo: Repository<Vendor>,
  ) {}

  // Satu payload untuk initial load frontend. Endpoint per-bagian tetap ada
  // agar grafik/daftar dapat di-refresh secara independen.
  async getOverview(filter: DashboardFilterDto, user: RequestUser) {
    const scope = await this.resolveScope(user);
    const [kpi, distribusiAset, trenKalibrasi, biayaMaintenance, perluPerhatian] =
      await Promise.all([
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

  async getKpi(filter: DashboardFilterDto, user: RequestUser) {
    return this.getKpiWithScope(filter, await this.resolveScope(user));
  }

  async getAssetDistribution(filter: DashboardFilterDto, user: RequestUser) {
    return this.getAssetDistributionWithScope(
      filter,
      await this.resolveScope(user),
    );
  }

  async getCalibrationTrend(filter: DashboardFilterDto, user: RequestUser) {
    return this.getCalibrationTrendWithScope(
      filter,
      await this.resolveScope(user),
    );
  }

  async getMaintenanceCost(filter: DashboardFilterDto, user: RequestUser) {
    return this.getMaintenanceCostWithScope(
      filter,
      await this.resolveScope(user),
    );
  }

  async getAttention(filter: DashboardFilterDto, user: RequestUser) {
    return this.getAttentionWithScope(filter, await this.resolveScope(user));
  }

  private async getKpiWithScope(
    filter: DashboardFilterDto,
    scope: DashboardScopeContext,
  ) {
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
      .innerJoin(Asset, 'asset', 'asset.asset_id = schedule.asset_id::uuid')
      .where('schedule.tanggal_jatuh_tempo < CURRENT_DATE')
      .andWhere("schedule.status_kalibrasi != 'menunggu_perbaikan'");
    this.applyAssetFilter(overdueQuery, 'asset', filter, scope);
    this.applyDateFilter(
      overdueQuery,
      'schedule.tanggal_jatuh_tempo',
      filter,
      true,
    );

    const akanJatuhTempoQuery = this.scheduleRepo
      .createQueryBuilder('schedule')
      .innerJoin(Asset, 'asset', 'asset.asset_id = schedule.asset_id::uuid')
      .where('schedule.tanggal_jatuh_tempo >= CURRENT_DATE')
      .andWhere(
        `schedule.tanggal_jatuh_tempo <= CURRENT_DATE + INTERVAL '${this.ambangKalibrasiHari} days'`,
      )
      .andWhere("schedule.status_kalibrasi != 'menunggu_perbaikan'");
    this.applyAssetFilter(akanJatuhTempoQuery, 'asset', filter, scope);
    this.applyDateFilter(
      akanJatuhTempoQuery,
      'schedule.tanggal_jatuh_tempo',
      filter,
      true,
    );

    const temuanQuery = this.opnameRecordRepo
      .createQueryBuilder('record')
      .innerJoin(Asset, 'asset', 'asset.asset_id = record.asset_id::uuid')
      .where('record.status_tindak_lanjut IN (:...statusTindakLanjut)', {
        statusTindakLanjut: [
          StatusTindakLanjut.OPEN,
          StatusTindakLanjut.IN_PROGRESS,
        ],
      });
    this.applyAssetFilter(temuanQuery, 'asset', filter, scope);
    this.applyDateFilter(temuanQuery, 'record.created_at', filter);

    const workOrderQuery = this.workOrderRepo
      .createQueryBuilder('wo')
      .innerJoin(Asset, 'asset', 'asset.asset_id = wo.asset_id::uuid')
      .where('wo.status_tiket IN (:...statusTiket)', {
        statusTiket: [
          WorkOrderStatus.OPEN,
          WorkOrderStatus.IN_PROGRESS,
          WorkOrderStatus.RESOLVED,
        ],
      });
    this.applyAssetFilter(workOrderQuery, 'asset', filter, scope);
    this.applyDateFilter(workOrderQuery, 'wo.created_at', filter);

    const vendorQuery = this.buildVendorExpiringQuery(filter, scope);

    const [
      totalAset,
      asetPerKategoriRaw,
      kalibrasiOverdue,
      kalibrasiAkanJatuhTempo,
      temuanOpnameBelumDitindaklanjuti,
      workOrderAktif,
      sertifikatVendorAkanExpired,
    ] = await Promise.all([
      assetBase.getCount(),
      asetPerKategoriQuery.getRawMany<{ label: string; total: string }>(),
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
      temuan_stock_opname_belum_ditindaklanjuti:
        temuanOpnameBelumDitindaklanjuti,
      work_order_aktif: workOrderAktif,
      sertifikat_vendor_akan_expired: sertifikatVendorAkanExpired,
    };
  }

  private async getAssetDistributionWithScope(
    filter: DashboardFilterDto,
    scope: DashboardScopeContext,
  ) {
    const groupBy = async (column: 'kategori' | 'kondisi') => {
      const query = this.assetRepo.createQueryBuilder('asset');
      this.applyAssetFilter(query, 'asset', filter, scope);
      const rows = await query
        .select(`COALESCE(asset.${column}::text, 'tidak_diketahui')`, 'label')
        .addSelect('COUNT(asset.asset_id)', 'total')
        .groupBy(`asset.${column}`)
        .orderBy('total', 'DESC')
        .getRawMany<{ label: string; total: string }>();
      return this.mapCountRows(rows);
    };

    const lokasiQuery = this.assetRepo.createQueryBuilder('asset');
    this.applyAssetFilter(lokasiQuery, 'asset', filter, scope);

    const [perKategori, perLokasiRaw, perKondisi] = await Promise.all([
      groupBy('kategori'),
      lokasiQuery
        .select(
          `COALESCE(NULLIF(CONCAT_WS(' / ', asset.gedung, asset.lantai, asset.ruangan), ''), 'tidak_diketahui')`,
          'label',
        )
        .addSelect('COUNT(asset.asset_id)', 'total')
        .groupBy('asset.gedung')
        .addGroupBy('asset.lantai')
        .addGroupBy('asset.ruangan')
        .orderBy('total', 'DESC')
        .getRawMany<{ label: string; total: string }>(),
      groupBy('kondisi'),
    ]);

    return {
      per_kategori: perKategori,
      per_lokasi: this.mapCountRows(perLokasiRaw),
      per_kondisi: perKondisi,
    };
  }

  private async getCalibrationTrendWithScope(
    filter: DashboardFilterDto,
    scope: DashboardScopeContext,
  ): Promise<DashboardPeriodValue[]> {
    const query = this.calibrationLogRepo
      .createQueryBuilder('log')
      .innerJoin(Asset, 'asset', 'asset.asset_id = log.asset_id::uuid');
    this.applyAssetFilter(query, 'asset', filter, scope);
    this.applyDateFilter(query, 'log.tanggal_pelaksanaan', filter, true);

    const rows = await query
      .select("TO_CHAR(DATE_TRUNC('month', log.tanggal_pelaksanaan), 'YYYY-MM')", 'periode')
      .addSelect('COUNT(log.log_id)', 'total')
      .groupBy("DATE_TRUNC('month', log.tanggal_pelaksanaan)")
      .orderBy("DATE_TRUNC('month', log.tanggal_pelaksanaan)", 'ASC')
      .getRawMany<{ periode: string; total: string }>();

    return rows.map((row) => ({ periode: row.periode, total: Number(row.total) }));
  }

  private async getMaintenanceCostWithScope(
    filter: DashboardFilterDto,
    scope: DashboardScopeContext,
  ): Promise<DashboardPeriodValue[]> {
    const query = this.workOrderRepo
      .createQueryBuilder('wo')
      .innerJoin(Asset, 'asset', 'asset.asset_id = wo.asset_id::uuid')
      .where('wo.biaya IS NOT NULL');
    this.applyAssetFilter(query, 'asset', filter, scope);
    this.applyDateFilter(query, 'COALESCE(wo.waktu_selesai, wo.updated_at)', filter);

    const rows = await query
      .select(
        "TO_CHAR(DATE_TRUNC('month', COALESCE(wo.waktu_selesai, wo.updated_at)), 'YYYY-MM')",
        'periode',
      )
      .addSelect('COALESCE(SUM(wo.biaya), 0)', 'total')
      .groupBy(
        "DATE_TRUNC('month', COALESCE(wo.waktu_selesai, wo.updated_at))",
      )
      .orderBy(
        "DATE_TRUNC('month', COALESCE(wo.waktu_selesai, wo.updated_at))",
        'ASC',
      )
      .getRawMany<{ periode: string; total: string }>();

    return rows.map((row) => ({ periode: row.periode, total: Number(row.total) }));
  }

  private async getAttentionWithScope(
    filter: DashboardFilterDto,
    scope: DashboardScopeContext,
  ) {
    const overdueQuery = this.scheduleRepo
      .createQueryBuilder('schedule')
      .innerJoin(Asset, 'asset', 'asset.asset_id = schedule.asset_id::uuid')
      .where('schedule.tanggal_jatuh_tempo < CURRENT_DATE')
      .andWhere("schedule.status_kalibrasi != 'menunggu_perbaikan'");
    this.applyAssetFilter(overdueQuery, 'asset', filter, scope);
    this.applyDateFilter(overdueQuery, 'schedule.tanggal_jatuh_tempo', filter, true);

    const temuanQuery = this.opnameRecordRepo
      .createQueryBuilder('record')
      .innerJoin(Asset, 'asset', 'asset.asset_id = record.asset_id::uuid')
      .where('record.status_tindak_lanjut IN (:...statusTindakLanjut)', {
        statusTindakLanjut: [StatusTindakLanjut.OPEN, StatusTindakLanjut.IN_PROGRESS],
      });
    this.applyAssetFilter(temuanQuery, 'asset', filter, scope);
    this.applyDateFilter(temuanQuery, 'record.created_at', filter);

    const vendorQuery = this.buildVendorExpiringQuery(filter, scope);

    const [asetOverdueKalibrasi, temuanOpnameOpen, sertifikatVendorMendekatiExpired] =
      await Promise.all([
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
      sertifikat_vendor_mendekati_expired:
        sertifikatVendorMendekatiExpired,
    };
  }

  // Role full sesuai kebutuhan Dashboard. Karena User saat ini belum punya
  // assignment lokasi, scope terbatas diturunkan dari keterlibatan eksplisit
  // pada transaksi. Method ini sengaja diisolasi agar mudah diganti menjadi
  // join tabel user_location_assignments ketika skema tersebut ditambahkan.
  private async resolveScope(user: RequestUser): Promise<DashboardScopeContext> {
    const fullRoles: string[] = [
      Role.KEPALA_LAB,
      Role.TATA_USAHA,
      Role.WAKIL_DEKAN,
    ];
    if (fullRoles.includes(user.role)) {
      return { scope: 'full', assetIds: null, vendorIds: null };
    }

    const assetIdSet = new Set<string>();

    if (user.role === Role.LABORAN) {
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
      [...assets, ...records, ...logs, ...workOrders].forEach((row) =>
        assetIdSet.add(row.asset_id),
      );
    } else if (user.role === Role.TEKNISI) {
      const workOrders = await this.workOrderRepo.find({
        select: { asset_id: true },
        where: { dikerjakan_oleh: user.userId },
      });
      workOrders.forEach((row) => assetIdSet.add(row.asset_id));
    }

    const assetIds = [...assetIdSet];
    const vendorIds = assetIds.length
      ? [
          ...new Set(
            (
              await this.calibrationLogRepo
                .createQueryBuilder('log')
                .select('log.vendor_id', 'vendor_id')
                .where('log.asset_id IN (:...assetIds)', { assetIds })
                .andWhere('log.vendor_id IS NOT NULL')
                .getRawMany<{ vendor_id: string }>()
            ).map((row) => row.vendor_id),
          ),
        ]
      : [];

    return { scope: 'terbatas', assetIds, vendorIds };
  }

  private applyAssetFilter<T extends ObjectLiteral>(
    query: SelectQueryBuilder<T>,
    alias: string,
    filter: DashboardFilterDto,
    scope: DashboardScopeContext,
  ): void {
    if (scope.assetIds !== null) {
      if (scope.assetIds.length === 0) query.andWhere('1 = 0');
      else query.andWhere(`${alias}.asset_id IN (:...scopeAssetIds)`, {
        scopeAssetIds: scope.assetIds,
      });
    }
    if (filter.gedung) query.andWhere(`${alias}.gedung = :gedung`, { gedung: filter.gedung });
    if (filter.lantai) query.andWhere(`${alias}.lantai = :lantai`, { lantai: filter.lantai });
    if (filter.ruangan) query.andWhere(`${alias}.ruangan = :ruangan`, { ruangan: filter.ruangan });
    if (filter.kategori) query.andWhere(`${alias}.kategori = :kategori`, { kategori: filter.kategori });
  }

  private applyDateFilter<T extends ObjectLiteral>(
    query: SelectQueryBuilder<T>,
    column: string,
    filter: DashboardFilterDto,
    isDateColumn = false,
  ): void {
    if (filter.tanggal_mulai) {
      query.andWhere(`${column} >= :tanggalMulai`, {
        tanggalMulai: filter.tanggal_mulai,
      });
    }
    if (filter.tanggal_selesai) {
      query.andWhere(
        isDateColumn
          ? `${column} <= :tanggalSelesai`
          : `${column} < (CAST(:tanggalSelesai AS date) + INTERVAL '1 day')`,
        { tanggalSelesai: filter.tanggal_selesai },
      );
    }
  }

  private buildVendorExpiringQuery(
    filter: DashboardFilterDto,
    scope: DashboardScopeContext,
  ): SelectQueryBuilder<Vendor> {
    const query = this.vendorRepo
      .createQueryBuilder('vendor')
      .where('vendor.tanggal_expired_akreditasi >= CURRENT_DATE')
      .andWhere(
        `vendor.tanggal_expired_akreditasi <= CURRENT_DATE + INTERVAL '${this.ambangVendorHari} days'`,
      );

    if (scope.vendorIds !== null) {
      if (scope.vendorIds.length === 0) query.andWhere('1 = 0');
      else query.andWhere('vendor.vendor_id IN (:...scopeVendorIds)', {
        scopeVendorIds: scope.vendorIds,
      });
    }

    const hasAssetFilter = Boolean(
      filter.gedung || filter.lantai || filter.ruangan || filter.kategori,
    );
    if (hasAssetFilter) {
      query
        .innerJoin(CalibrationLog, 'log', 'log.vendor_id = vendor.vendor_id::varchar')
        .innerJoin(Asset, 'asset', 'asset.asset_id = log.asset_id::uuid')
        .distinct(true);
      this.applyAssetFilter(query, 'asset', filter, scope);
    }

    this.applyDateFilter(
      query,
      'vendor.tanggal_expired_akreditasi',
      filter,
      true,
    );
    return query;
  }

  private mapCountRows(
    rows: Array<{ label: string; total: string }>,
  ): DashboardCountByLabel[] {
    return rows.map((row) => ({ label: row.label, total: Number(row.total) }));
  }
}
