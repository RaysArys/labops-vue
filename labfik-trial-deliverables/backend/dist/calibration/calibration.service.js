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
exports.CalibrationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const calibration_schedule_entity_1 = require("./calibration-schedule.entity");
const calibration_log_entity_1 = require("./calibration-log.entity");
const calibration_status_enum_1 = require("./enums/calibration-status.enum");
const calibration_log_state_machine_1 = require("./calibration-log.state-machine");
const maintenance_service_1 = require("../maintenance/maintenance.service");
const work_order_status_enum_1 = require("../maintenance/enums/work-order-status.enum");
const audit_service_1 = require("../audit/audit.service");
const role_enum_1 = require("../common/enums/role.enum");
const calibration_parameter_entity_1 = require("./calibration-parameter.entity");
const calibration_evaluation_1 = require("./calibration-evaluation");
const calibration_status_enum_2 = require("./enums/calibration-status.enum");
const assets_service_1 = require("../assets/assets.service");
let CalibrationService = class CalibrationService {
    scheduleRepo;
    logRepo;
    parameterRepo;
    maintenanceService;
    auditService;
    assetsService;
    constructor(scheduleRepo, logRepo, parameterRepo, maintenanceService, auditService, assetsService) {
        this.scheduleRepo = scheduleRepo;
        this.logRepo = logRepo;
        this.parameterRepo = parameterRepo;
        this.maintenanceService = maintenanceService;
        this.auditService = auditService;
        this.assetsService = assetsService;
    }
    async findParameters(kategori, includeInactive = false) {
        const where = {};
        if (kategori)
            where.kategori_aset = kategori;
        if (!includeInactive)
            where.aktif = true;
        return this.parameterRepo.find({
            where,
            order: { kategori_aset: 'ASC', nama_parameter: 'ASC' },
        });
    }
    async createParameter(dto, user) {
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
    async updateParameter(parameterId, dto, user) {
        const parameter = await this.parameterRepo.findOne({
            where: { parameter_id: parameterId },
        });
        if (!parameter) {
            throw new common_1.NotFoundException(`Parameter ${parameterId} tidak ditemukan`);
        }
        const before = { ...parameter };
        Object.assign(parameter, dto);
        if (dto.kode)
            parameter.kode = this.normalizeParameterCode(dto.kode);
        if ('batas_min' in dto)
            parameter.batas_min = dto.batas_min ?? null;
        if ('batas_max' in dto)
            parameter.batas_max = dto.batas_max ?? null;
        this.validateParameterBounds(parameter.batas_min, parameter.batas_max);
        parameter.diubah_oleh = user.userId;
        const saved = await this.parameterRepo.save(parameter);
        await this.auditService.logDiff('CalibrationParameter', parameterId, before, saved, user.userId);
        return saved;
    }
    normalizeParameterCode(value) {
        return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
    }
    validateParameterBounds(min, max) {
        if (min == null && max == null) {
            throw new common_1.BadRequestException('Parameter harus memiliki minimal batas minimum atau maksimum');
        }
        if (min != null && max != null && min > max) {
            throw new common_1.BadRequestException('Batas minimum tidak boleh lebih besar dari batas maksimum');
        }
    }
    async createSchedule(dto, user) {
        const basisTanggal = dto.tanggal_kalibrasi_terakhir
            ? new Date(dto.tanggal_kalibrasi_terakhir)
            : new Date();
        const jatuhTempo = this.hitungJatuhTempo(basisTanggal, dto.interval_bulan);
        const schedule = this.scheduleRepo.create({
            asset_id: dto.asset_id,
            interval_bulan: dto.interval_bulan,
            tanggal_kalibrasi_terakhir: dto.tanggal_kalibrasi_terakhir ?? null,
            tanggal_jatuh_tempo: jatuhTempo.toISOString().slice(0, 10),
            status_kalibrasi: calibration_status_enum_1.JadwalStatus.DIJADWALKAN,
        });
        return this.scheduleRepo.save(schedule);
    }
    hitungJatuhTempo(basis, intervalBulan) {
        const result = new Date(basis);
        result.setMonth(result.getMonth() + intervalBulan);
        return result;
    }
    async findSchedule(scheduleId) {
        const schedule = await this.scheduleRepo.findOne({
            where: { schedule_id: scheduleId },
        });
        if (!schedule) {
            throw new common_1.NotFoundException(`Jadwal ${scheduleId} tidak ditemukan`);
        }
        return schedule;
    }
    async findAllSchedules() {
        return this.scheduleRepo.find({ order: { tanggal_jatuh_tempo: 'ASC' } });
    }
    async refreshStatusJadwal(scheduleId, hariAmbangBatas = 14) {
        const schedule = await this.findSchedule(scheduleId);
        if (!schedule.tanggal_jatuh_tempo)
            return schedule;
        const now = new Date();
        const jatuhTempo = new Date(schedule.tanggal_jatuh_tempo);
        const selisihHari = Math.floor((jatuhTempo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const statusLama = schedule.status_kalibrasi;
        let statusBaru = statusLama;
        if (selisihHari < 0) {
            statusBaru = calibration_status_enum_1.JadwalStatus.OVERDUE;
        }
        else if (selisihHari <= hariAmbangBatas) {
            statusBaru = calibration_status_enum_1.JadwalStatus.AKAN_JATUH_TEMPO;
        }
        if (statusBaru !== statusLama) {
            schedule.status_kalibrasi = statusBaru;
            await this.scheduleRepo.save(schedule);
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
    async catatHasil(scheduleId, dto, user) {
        if (user.role !== role_enum_1.Role.LABORAN) {
            throw new common_1.ForbiddenException('Hanya Laboran yang dapat mencatat hasil kalibrasi');
        }
        const schedule = await this.findSchedule(scheduleId);
        const asset = await this.assetsService.findOne(schedule.asset_id);
        const inputs = dto.pengukuran ?? [];
        if (!dto.hasil && inputs.length === 0) {
            throw new common_1.BadRequestException('Isi hasil kalibrasi atau minimal satu nilai pengukuran');
        }
        const parameterIds = inputs.map((item) => item.parameter_id);
        const parameters = parameterIds.length
            ? await this.parameterRepo.findBy({ parameter_id: (0, typeorm_2.In)(parameterIds) })
            : [];
        if (parameters.length !== parameterIds.length) {
            throw new common_1.BadRequestException('Ada parameter pengukuran yang tidak ditemukan');
        }
        const parameterMap = new Map(parameters.map((parameter) => [parameter.parameter_id, parameter]));
        const pengukuran = inputs.map((input) => {
            const parameter = parameterMap.get(input.parameter_id);
            if (!parameter.aktif) {
                throw new common_1.BadRequestException(`Parameter ${parameter.nama_parameter} sudah tidak aktif`);
            }
            if (parameter.kategori_aset !== asset.kategori) {
                throw new common_1.BadRequestException(`Parameter ${parameter.nama_parameter} tidak berlaku untuk kategori aset ini`);
            }
            return (0, calibration_evaluation_1.evaluateMeasurement)(parameter, input.nilai_aktual);
        });
        const hasilOtomatis = pengukuran.length
            ? pengukuran.some((item) => item.status === 'tidak_normal')
                ? calibration_status_enum_2.HasilKalibrasi.TIDAK_LULUS
                : calibration_status_enum_2.HasilKalibrasi.LULUS
            : dto.hasil;
        const log = this.logRepo.create({
            schedule_id: scheduleId,
            asset_id: schedule.asset_id,
            vendor_id: dto.vendor_id,
            tanggal_pelaksanaan: dto.tanggal_pelaksanaan,
            hasil: hasilOtomatis,
            deviasi: dto.deviasi,
            pengukuran,
            biaya: dto.biaya,
            status_approval: calibration_status_enum_1.LogApprovalStatus.PENDING_APPROVAL,
            dicatat_oleh: user.userId,
        });
        const saved = await this.logRepo.save(log);
        await this.auditService.logChange({
            entityType: 'CalibrationLog',
            entityId: saved.log_id,
            fieldName: 'status_approval',
            fieldLama: null,
            fieldBaru: calibration_status_enum_1.LogApprovalStatus.PENDING_APPROVAL,
            diubahOleh: user.userId,
        });
        return saved;
    }
    async findLog(logId) {
        const log = await this.logRepo.findOne({ where: { log_id: logId } });
        if (!log)
            throw new common_1.NotFoundException(`Log ${logId} tidak ditemukan`);
        return log;
    }
    async findLogsBySchedule(scheduleId) {
        return this.logRepo.find({
            where: { schedule_id: scheduleId },
            order: { created_at: 'DESC' },
        });
    }
    async tinjauHasil(logId, dto, user) {
        if (user.role !== role_enum_1.Role.KEPALA_LAB) {
            throw new common_1.ForbiddenException('Hanya Kepala Lab yang dapat meninjau hasil kalibrasi');
        }
        const log = await this.findLog(logId);
        const statusLama = log.status_approval;
        const action = dto.action;
        log.status_approval = (0, calibration_log_state_machine_1.transitionCalibrationLog)(statusLama, action);
        log.disetujui_oleh = user.userId;
        log.waktu_approval = new Date();
        log.alasan_penolakan = dto.alasan ?? null;
        if (action === 'setujui') {
            await this.approveDanHitungUlangJadwal(log);
        }
        else if (action === 'tolak_teknis') {
            await this.eskalasiKeMaintenance(log, user);
        }
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
    async approveDanHitungUlangJadwal(log) {
        const schedule = await this.findSchedule(log.schedule_id);
        schedule.tanggal_kalibrasi_terakhir = log.tanggal_pelaksanaan;
        schedule.tanggal_jatuh_tempo = this.hitungJatuhTempo(new Date(log.tanggal_pelaksanaan), schedule.interval_bulan)
            .toISOString()
            .slice(0, 10);
        schedule.status_kalibrasi = calibration_status_enum_1.JadwalStatus.DIJADWALKAN;
        await this.scheduleRepo.save(schedule);
    }
    async eskalasiKeMaintenance(log, user) {
        const wo = await this.maintenanceService.createFromEscalation({
            assetId: log.asset_id,
            deskripsi: `Hasil kalibrasi menunjukkan alat perlu perbaikan (log ${log.log_id})`,
            asalTemuan: work_order_status_enum_1.WorkOrderAsalTemuan.KALIBRASI,
            referensiAsalId: log.log_id,
            dilaporkanOleh: user.userId,
        });
        log.work_order_id = wo.wo_id;
        const schedule = await this.findSchedule(log.schedule_id);
        schedule.status_kalibrasi = calibration_status_enum_1.JadwalStatus.MENUNGGU_PERBAIKAN;
        await this.scheduleRepo.save(schedule);
    }
    async selesaikanPerbaikanKembaliKeJadwal(scheduleId, user) {
        if (user.role !== role_enum_1.Role.TEKNISI && user.role !== role_enum_1.Role.KEPALA_LAB) {
            throw new common_1.ForbiddenException('Hanya Teknisi/Kepala Lab yang dapat mengonfirmasi perbaikan selesai');
        }
        const schedule = await this.findSchedule(scheduleId);
        if (schedule.status_kalibrasi !== calibration_status_enum_1.JadwalStatus.MENUNGGU_PERBAIKAN) {
            throw new common_1.BadRequestException('Jadwal ini tidak sedang berstatus Menunggu Perbaikan');
        }
        const statusLama = schedule.status_kalibrasi;
        schedule.status_kalibrasi = calibration_status_enum_1.JadwalStatus.DIJADWALKAN;
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
};
exports.CalibrationService = CalibrationService;
exports.CalibrationService = CalibrationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(calibration_schedule_entity_1.CalibrationSchedule)),
    __param(1, (0, typeorm_1.InjectRepository)(calibration_log_entity_1.CalibrationLog)),
    __param(2, (0, typeorm_1.InjectRepository)(calibration_parameter_entity_1.CalibrationParameter)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        maintenance_service_1.MaintenanceService,
        audit_service_1.AuditService,
        assets_service_1.AssetsService])
], CalibrationService);
//# sourceMappingURL=calibration.service.js.map