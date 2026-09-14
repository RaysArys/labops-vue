import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CalibrationSchedule } from './calibration-schedule.entity';
import { CalibrationLog } from './calibration-log.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { CatatHasilDto } from './dto/catat-hasil.dto';
import { TinjauHasilDto } from './dto/tinjau-hasil.dto';
import {
  JadwalStatus,
  LogApprovalStatus,
} from './enums/calibration-status.enum';
import {
  transitionCalibrationLog,
  CalibrationLogAction,
} from './calibration-log.state-machine';
import { MaintenanceService } from '../maintenance/maintenance.service';
import { WorkOrderAsalTemuan } from '../maintenance/enums/work-order-status.enum';
import { AuditService } from '../audit/audit.service';
import { RequestUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { CalibrationParameter } from './calibration-parameter.entity';
import { CreateCalibrationParameterDto } from './dto/create-parameter.dto';
import { UpdateCalibrationParameterDto } from './dto/update-parameter.dto';
import { AssetKategori } from '../assets/enums/asset-status.enum';
import { evaluateMeasurement } from './calibration-evaluation';
import { HasilKalibrasi } from './enums/calibration-status.enum';
import { AssetsService } from '../assets/assets.service';

@Injectable()
export class CalibrationService {
  constructor(
    @InjectRepository(CalibrationSchedule)
    private readonly scheduleRepo: Repository<CalibrationSchedule>,
    @InjectRepository(CalibrationLog)
    private readonly logRepo: Repository<CalibrationLog>,
    @InjectRepository(CalibrationParameter)
    private readonly parameterRepo: Repository<CalibrationParameter>,
    private readonly maintenanceService: MaintenanceService,
    private readonly auditService: AuditService,
    private readonly assetsService: AssetsService,
  ) {}

  // ================= MASTER PARAMETER =================

  async findParameters(
    kategori?: AssetKategori,
    includeInactive = false,
  ): Promise<CalibrationParameter[]> {
    const where: Record<string, unknown> = {};
    if (kategori) where.kategori_aset = kategori;
    if (!includeInactive) where.aktif = true;
    return this.parameterRepo.find({
      where,
      order: { kategori_aset: 'ASC', nama_parameter: 'ASC' },
    });
  }

  async createParameter(
    dto: CreateCalibrationParameterDto,
    user: RequestUser,
  ): Promise<CalibrationParameter> {
    this.validateParameterBounds(dto.batas_min, dto.batas_max);
    const parameter = this.parameterRepo.create({
      ...dto,
      kode: this.normalizeParameterCode(dto.kode),
      batas_min: dto.batas_min ?? null,
      batas_max: dto.batas_max ?? null,
      aktif: dto.aktif ?? true,
      dibuat_oleh: user.userId,
      diubah_oleh: user.userId,
    });
    const saved = await this.parameterRepo.save(parameter);
    await this.auditService.logChange({
      entityType: 'CalibrationParameter',
      entityId: saved.parameter_id,
      fieldName: 'created',
      fieldLama: null,
      fieldBaru: JSON.stringify(saved),
      diubahOleh: user.userId,
    });
    return saved;
  }

  async updateParameter(
    parameterId: string,
    dto: UpdateCalibrationParameterDto,
    user: RequestUser,
  ): Promise<CalibrationParameter> {
    const parameter = await this.parameterRepo.findOne({
      where: { parameter_id: parameterId },
    });
    if (!parameter) {
      throw new NotFoundException(`Parameter ${parameterId} tidak ditemukan`);
    }
    const before = { ...parameter };
    Object.assign(parameter, dto);
    if (dto.kode) parameter.kode = this.normalizeParameterCode(dto.kode);
    if ('batas_min' in dto) parameter.batas_min = dto.batas_min ?? null;
    if ('batas_max' in dto) parameter.batas_max = dto.batas_max ?? null;
    this.validateParameterBounds(parameter.batas_min, parameter.batas_max);
    parameter.diubah_oleh = user.userId;
    const saved = await this.parameterRepo.save(parameter);
    await this.auditService.logDiff(
      'CalibrationParameter',
      parameterId,
      before as unknown as Record<string, unknown>,
      saved as unknown as Record<string, unknown>,
      user.userId,
    );
    return saved;
  }

  private normalizeParameterCode(value: string): string {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
  }

  private validateParameterBounds(
    min: number | null | undefined,
    max: number | null | undefined,
  ): void {
    if (min == null && max == null) {
      throw new BadRequestException(
        'Parameter harus memiliki minimal batas minimum atau maksimum',
      );
    }
    if (min != null && max != null && min > max) {
      throw new BadRequestException(
        'Batas minimum tidak boleh lebih besar dari batas maksimum',
      );
    }
  }

  // ================= JADWAL =================

  // Alur Kalibrasi langkah 1: hitung tanggal jatuh tempo dari interval +
  // tanggal kalibrasi terakhir (FR-12). Kalau belum pernah dikalibrasi,
  // jatuh tempo dihitung dari hari ini.
  async createSchedule(
    dto: CreateScheduleDto,
    user: RequestUser,
  ): Promise<CalibrationSchedule> {
    const basisTanggal = dto.tanggal_kalibrasi_terakhir
      ? new Date(dto.tanggal_kalibrasi_terakhir)
      : new Date();

    const jatuhTempo = this.hitungJatuhTempo(basisTanggal, dto.interval_bulan);

    const schedule = this.scheduleRepo.create({
      asset_id: dto.asset_id,
      interval_bulan: dto.interval_bulan,
      tanggal_kalibrasi_terakhir: dto.tanggal_kalibrasi_terakhir ?? null,
      tanggal_jatuh_tempo: jatuhTempo.toISOString().slice(0, 10),
      status_kalibrasi: JadwalStatus.DIJADWALKAN,
    });
    return this.scheduleRepo.save(schedule);
  }

  private hitungJatuhTempo(basis: Date, intervalBulan: number): Date {
    const result = new Date(basis);
    result.setMonth(result.getMonth() + intervalBulan);
    return result;
  }

  async findSchedule(scheduleId: string): Promise<CalibrationSchedule> {
    const schedule = await this.scheduleRepo.findOne({
      where: { schedule_id: scheduleId },
    });
    if (!schedule) {
      throw new NotFoundException(`Jadwal ${scheduleId} tidak ditemukan`);
    }
    return schedule;
  }

  async findAllSchedules(): Promise<CalibrationSchedule[]> {
    return this.scheduleRepo.find({ order: { tanggal_jatuh_tempo: 'ASC' } });
  }

  // Alur Kalibrasi langkah 2-3: memperbarui status jadwal berdasarkan
  // kedekatan tanggal jatuh tempo (FR-13, FR-16). Di produksi ini idealnya
  // dipanggil oleh scheduled job (cron) harian; untuk sekarang disediakan
  // sebagai method yang bisa dipanggil manual/lewat endpoint, supaya logic
  // inti sudah ada dan tinggal disambung ke scheduler nanti.
  async refreshStatusJadwal(
    scheduleId: string,
    hariAmbangBatas = 14,
  ): Promise<CalibrationSchedule> {
    const schedule = await this.findSchedule(scheduleId);
    if (!schedule.tanggal_jatuh_tempo) return schedule;

    const now = new Date();
    const jatuhTempo = new Date(schedule.tanggal_jatuh_tempo);
    const selisihHari = Math.floor(
      (jatuhTempo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    const statusLama = schedule.status_kalibrasi;
    let statusBaru = statusLama;

    if (selisihHari < 0) {
      statusBaru = JadwalStatus.OVERDUE;
    } else if (selisihHari <= hariAmbangBatas) {
      statusBaru = JadwalStatus.AKAN_JATUH_TEMPO;
    }

    if (statusBaru !== statusLama) {
      schedule.status_kalibrasi = statusBaru;
      await this.scheduleRepo.save(schedule);
      // FR-16: notifikasi jatuh tempo — mekanisme pengiriman (email/WA/
      // in-app) belum diputuskan (lihat catatan terbuka SRS), jadi di sini
      // baru dicatat sebagai audit trail. Titik integrasi notifikasi
      // sebenarnya tinggal ditambahkan di sini nanti.
      await this.auditService.logChange({
        entityType: 'CalibrationSchedule',
        entityId: scheduleId,
        fieldName: 'status_kalibrasi',
        fieldLama: statusLama,
        fieldBaru: statusBaru,
        diubahOleh: 'system',
      });
    }

    return schedule;
  }

  // ================= CATAT HASIL (FR-14) =================

  async catatHasil(
    scheduleId: string,
    dto: CatatHasilDto,
    user: RequestUser,
  ): Promise<CalibrationLog> {
    if (user.role !== Role.LABORAN) {
      throw new ForbiddenException(
        'Hanya Laboran yang dapat mencatat hasil kalibrasi',
      );
    }

    const schedule = await this.findSchedule(scheduleId);
    const asset = await this.assetsService.findOne(schedule.asset_id);

    const inputs = dto.pengukuran ?? [];
    if (!dto.hasil && inputs.length === 0) {
      throw new BadRequestException(
        'Isi hasil kalibrasi atau minimal satu nilai pengukuran',
      );
    }
    const parameterIds = inputs.map((item) => item.parameter_id);
    const parameters = parameterIds.length
      ? await this.parameterRepo.findBy({ parameter_id: In(parameterIds) })
      : [];
    if (parameters.length !== parameterIds.length) {
      throw new BadRequestException(
        'Ada parameter pengukuran yang tidak ditemukan',
      );
    }
    const parameterMap = new Map(
      parameters.map((parameter) => [parameter.parameter_id, parameter]),
    );
    const pengukuran = inputs.map((input) => {
      const parameter = parameterMap.get(input.parameter_id)!;
      if (!parameter.aktif) {
        throw new BadRequestException(
          `Parameter ${parameter.nama_parameter} sudah tidak aktif`,
        );
      }
      if (parameter.kategori_aset !== asset.kategori) {
        throw new BadRequestException(
          `Parameter ${parameter.nama_parameter} tidak berlaku untuk kategori aset ini`,
        );
      }
      return evaluateMeasurement(parameter, input.nilai_aktual);
    });
    const hasilOtomatis = pengukuran.length
      ? pengukuran.some((item) => item.status === 'tidak_normal')
        ? HasilKalibrasi.TIDAK_LULUS
        : HasilKalibrasi.LULUS
      : dto.hasil!;

    const log = this.logRepo.create({
      schedule_id: scheduleId,
      asset_id: schedule.asset_id,
      vendor_id: dto.vendor_id,
      tanggal_pelaksanaan: dto.tanggal_pelaksanaan,
      hasil: hasilOtomatis,
      deviasi: dto.deviasi,
      pengukuran,
      biaya: dto.biaya,
      status_approval: LogApprovalStatus.PENDING_APPROVAL,
      dicatat_oleh: user.userId,
    });
    const saved = await this.logRepo.save(log);

    await this.auditService.logChange({
      entityType: 'CalibrationLog',
      entityId: saved.log_id,
      fieldName: 'status_approval',
      fieldLama: null,
      fieldBaru: LogApprovalStatus.PENDING_APPROVAL,
      diubahOleh: user.userId,
    });

    return saved;
  }

  async findLog(logId: string): Promise<CalibrationLog> {
    const log = await this.logRepo.findOne({ where: { log_id: logId } });
    if (!log) throw new NotFoundException(`Log ${logId} tidak ditemukan`);
    return log;
  }

  async findLogsBySchedule(scheduleId: string): Promise<CalibrationLog[]> {
    return this.logRepo.find({
      where: { schedule_id: scheduleId },
      order: { created_at: 'DESC' },
    });
  }

  // ================= TINJAU HASIL (FR-15) — inti alur siklikal =================

  // Alur Kalibrasi langkah 5-9: Kepala Lab meninjau, dengan 3 hasil mungkin:
  //   - setujui        -> update jadwal, hitung ulang siklus berikutnya
  //   - tolak_dokumen  -> balik ke Laboran untuk revisi pencatatan
  //   - tolak_teknis   -> buat Work Order ke Teknisi, jadwal jadi
  //                       MENUNGGU_PERBAIKAN sampai WO selesai
  async tinjauHasil(
    logId: string,
    dto: TinjauHasilDto,
    user: RequestUser,
  ): Promise<CalibrationLog> {
    if (user.role !== Role.KEPALA_LAB) {
      throw new ForbiddenException(
        'Hanya Kepala Lab yang dapat meninjau hasil kalibrasi',
      );
    }

    const log = await this.findLog(logId);
    const statusLama = log.status_approval;
    const action = dto.action as CalibrationLogAction;

    log.status_approval = transitionCalibrationLog(statusLama, action);
    log.disetujui_oleh = user.userId;
    log.waktu_approval = new Date();
    log.alasan_penolakan = dto.alasan ?? null;

    if (action === 'setujui') {
      await this.approveDanHitungUlangJadwal(log);
    } else if (action === 'tolak_teknis') {
      await this.eskalasiKeMaintenance(log, user);
    }
    // 'tolak_dokumen': tidak ada efek samping ke Asset/Schedule/Maintenance,
    // cukup kembalikan log ke Laboran untuk direvisi (FR-15).

    const saved = await this.logRepo.save(log);

    await this.auditService.logChange({
      entityType: 'CalibrationLog',
      entityId: logId,
      fieldName: 'status_approval',
      fieldLama: statusLama,
      fieldBaru: saved.status_approval,
      diubahOleh: user.userId,
      alasan: dto.alasan,
    });

    return saved;
  }

  // Cabang 'setujui': update tanggal_kalibrasi_terakhir di jadwal, hitung
  // ulang tanggal_jatuh_tempo berikutnya, status kembali ke Dijadwalkan —
  // ini yang membuat siklus kalibrasi berulang otomatis.
  private async approveDanHitungUlangJadwal(log: CalibrationLog): Promise<void> {
    const schedule = await this.findSchedule(log.schedule_id);

    schedule.tanggal_kalibrasi_terakhir = log.tanggal_pelaksanaan;
    schedule.tanggal_jatuh_tempo = this.hitungJatuhTempo(
      new Date(log.tanggal_pelaksanaan),
      schedule.interval_bulan,
    )
      .toISOString()
      .slice(0, 10);
    schedule.status_kalibrasi = JadwalStatus.DIJADWALKAN;

    await this.scheduleRepo.save(schedule);
  }

  // Cabang 'tolak_teknis': buat Work Order otomatis ke Teknisi (lintas-modul,
  // sama polanya dengan eskalasi dari Stock Opname), dan set status jadwal
  // jadi MENUNGGU_PERBAIKAN sampai Work Order-nya selesai.
  private async eskalasiKeMaintenance(
    log: CalibrationLog,
    user: RequestUser,
  ): Promise<void> {
    const wo = await this.maintenanceService.createFromEscalation({
      assetId: log.asset_id,
      deskripsi: `Hasil kalibrasi menunjukkan alat perlu perbaikan (log ${log.log_id})`,
      asalTemuan: WorkOrderAsalTemuan.KALIBRASI,
      referensiAsalId: log.log_id,
      dilaporkanOleh: user.userId,
    });
    log.work_order_id = wo.wo_id;

    const schedule = await this.findSchedule(log.schedule_id);
    schedule.status_kalibrasi = JadwalStatus.MENUNGGU_PERBAIKAN;
    await this.scheduleRepo.save(schedule);
  }

  // Dipanggil setelah Work Order hasil eskalasi 'tolak_teknis' ditutup
  // (lihat catatan integrasi di MaintenanceService — untuk sekarang dipicu
  // manual lewat endpoint, bisa disambungkan ke event WO closed nanti).
  // Mengembalikan status jadwal dari MENUNGGU_PERBAIKAN ke DIJADWALKAN,
  // supaya Laboran bisa kalibrasi ulang.
  async selesaikanPerbaikanKembaliKeJadwal(
    scheduleId: string,
    user: RequestUser,
  ): Promise<CalibrationSchedule> {
    if (user.role !== Role.TEKNISI && user.role !== Role.KEPALA_LAB) {
      throw new ForbiddenException(
        'Hanya Teknisi/Kepala Lab yang dapat mengonfirmasi perbaikan selesai',
      );
    }

    const schedule = await this.findSchedule(scheduleId);
    if (schedule.status_kalibrasi !== JadwalStatus.MENUNGGU_PERBAIKAN) {
      throw new BadRequestException(
        'Jadwal ini tidak sedang berstatus Menunggu Perbaikan',
      );
    }

    const statusLama = schedule.status_kalibrasi;
    schedule.status_kalibrasi = JadwalStatus.DIJADWALKAN;
    const saved = await this.scheduleRepo.save(schedule);

    await this.auditService.logChange({
      entityType: 'CalibrationSchedule',
      entityId: scheduleId,
      fieldName: 'status_kalibrasi',
      fieldLama: statusLama,
      fieldBaru: saved.status_kalibrasi,
      diubahOleh: user.userId,
    });

    return saved;
  }
}
