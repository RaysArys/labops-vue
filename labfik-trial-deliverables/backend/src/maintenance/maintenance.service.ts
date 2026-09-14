import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkOrder } from './work-order.entity';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import {
  WorkOrderAsalTemuan,
  WorkOrderStatus,
} from './enums/work-order-status.enum';
import {
  transitionWorkOrder,
  WorkOrderAction,
} from './work-order.state-machine';
import { AuditService } from '../audit/audit.service';
import { RequestUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { AssetsService } from '../assets/assets.service';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(WorkOrder)
    private readonly repo: Repository<WorkOrder>,
    private readonly auditService: AuditService,
    private readonly assetsService: AssetsService,
  ) {}

  async findAll(user?: RequestUser): Promise<WorkOrder[]> {
    return this.repo.find({
      where: user?.role === Role.WAKIL_DEKAN ? { laporan_ke_wadek: true } : {},
      order: { created_at: 'DESC' },
    });
  }

  async findOne(woId: string, user?: RequestUser): Promise<WorkOrder> {
    const wo = await this.repo.findOne({ where: { wo_id: woId } });
    if (!wo) throw new NotFoundException(`Work Order ${woId} tidak ditemukan`);
    if (user?.role === Role.WAKIL_DEKAN && !wo.laporan_ke_wadek) {
      throw new ForbiddenException(
        'Laporan Work Order ini belum dikirim ke Wakil Dekan',
      );
    }
    return wo;
  }

  // FR-17: Laboran (atau siapa pun yang lapor manual) membuat tiket.
  async create(dto: CreateWorkOrderDto, user: RequestUser): Promise<WorkOrder> {
    const wo = this.repo.create({
      asset_id: dto.asset_id,
      deskripsi_kerusakan: dto.deskripsi_kerusakan,
      asal_temuan: dto.asal_temuan ?? WorkOrderAsalTemuan.MANUAL,
      referensi_asal_id: dto.referensi_asal_id,
      dilaporkan_oleh: user.userId,
      status_tiket: WorkOrderStatus.OPEN,
    });
    const saved = await this.repo.save(wo);

    await this.auditService.logChange({
      entityType: 'WorkOrder',
      entityId: saved.wo_id,
      fieldName: 'status_tiket',
      fieldLama: null,
      fieldBaru: WorkOrderStatus.OPEN,
      diubahOleh: user.userId,
    });

    return saved;
  }

  // Dipanggil dari StockOpnameService / CalibrationService saat modul itu
  // mendeteksi aset rusak dan perlu eskalasi otomatis (lihat Activity Diagram
  // Stock Opname langkah 7-8 dan Activity Diagram Kalibrasi cabang
  // "Ditolak-Teknis"). Tidak lewat HTTP endpoint — dipanggil langsung
  // sebagai service method antar-module.
  async createFromEscalation(params: {
    assetId: string;
    deskripsi: string;
    asalTemuan: WorkOrderAsalTemuan;
    referensiAsalId: string;
    dilaporkanOleh: string;
  }): Promise<WorkOrder> {
    const wo = this.repo.create({
      asset_id: params.assetId,
      deskripsi_kerusakan: params.deskripsi,
      asal_temuan: params.asalTemuan,
      referensi_asal_id: params.referensiAsalId,
      dilaporkan_oleh: params.dilaporkanOleh,
      status_tiket: WorkOrderStatus.OPEN,
    });
    const saved = await this.repo.save(wo);

    await this.auditService.logChange({
      entityType: 'WorkOrder',
      entityId: saved.wo_id,
      fieldName: 'status_tiket',
      fieldLama: null,
      fieldBaru: WorkOrderStatus.OPEN,
      diubahOleh: params.dilaporkanOleh,
      alasan: `Eskalasi otomatis dari ${params.asalTemuan}`,
    });

    return saved;
  }

  // FR-18: Teknisi mengelola siklus tiket (mulai_kerjakan/selesaikan/dst).
  // FR-19-terkait: 'tutup' juga dibuka untuk Kepala Lab, karena secara alur
  // dialah yang meninjau/mengonfirmasi penyelesaian pada modul yang
  // mengeskalasi (Stock Opname/Kalibrasi).
  async transitionStatus(
    woId: string,
    action: WorkOrderAction,
    user: RequestUser,
    extra: { catatan_perbaikan?: string; biaya?: number; downtime_jam?: number },
  ): Promise<WorkOrder> {
    if (
      ['mulai_kerjakan', 'selesaikan', 'buka_kembali', 'batalkan'].includes(
        action,
      ) &&
      user.role !== Role.TEKNISI
    ) {
      throw new ForbiddenException(
        'Hanya Teknisi yang dapat mengubah status pengerjaan Work Order',
      );
    }
    if (
      action === 'tutup' &&
      user.role !== Role.TEKNISI &&
      user.role !== Role.KEPALA_LAB
    ) {
      throw new ForbiddenException(
        'Hanya Teknisi atau Kepala Lab yang dapat menutup Work Order',
      );
    }

    const wo = await this.findOne(woId);
    const statusLama = wo.status_tiket;
    wo.status_tiket = transitionWorkOrder(statusLama, action);

    if (action === 'mulai_kerjakan') {
      wo.dikerjakan_oleh = user.userId;
    }
    if (action === 'selesaikan') {
      wo.catatan_perbaikan = extra.catatan_perbaikan ?? wo.catatan_perbaikan;
      wo.biaya = extra.biaya ?? wo.biaya;
      wo.downtime_jam = extra.downtime_jam ?? wo.downtime_jam;
      wo.waktu_selesai = new Date();
    }

    const saved = await this.repo.save(wo);

    await this.auditService.logChange({
      entityType: 'WorkOrder',
      entityId: woId,
      fieldName: 'status_tiket',
      fieldLama: statusLama,
      fieldBaru: saved.status_tiket,
      diubahOleh: user.userId,
    });

    return saved;
  }

  // FR-19: Kepala Lab menetapkan prioritas.
  async setPrioritas(
    woId: string,
    prioritas: string,
    user: RequestUser,
  ): Promise<WorkOrder> {
    if (user.role !== Role.KEPALA_LAB) {
      throw new ForbiddenException(
        'Hanya Kepala Lab yang dapat menetapkan prioritas Work Order',
      );
    }

    const wo = await this.findOne(woId);
    const prioritasLama = wo.prioritas;
    wo.prioritas = prioritas as WorkOrder['prioritas'];
    wo.diprioritaskan_oleh = user.userId;

    const saved = await this.repo.save(wo);

    await this.auditService.logChange({
      entityType: 'WorkOrder',
      entityId: woId,
      fieldName: 'prioritas',
      fieldLama: prioritasLama,
      fieldBaru: saved.prioritas,
      diubahOleh: user.userId,
    });

    return saved;
  }

  async buildDamageReport(woId: string, user: RequestUser) {
    const workOrder = await this.findOne(woId, user);
    const asset = await this.assetsService.findOne(workOrder.asset_id);
    return {
      nomor_laporan: `LK-${workOrder.created_at.getFullYear()}-${workOrder.wo_id.slice(0, 8).toUpperCase()}`,
      dibuat_pada: new Date(),
      asset: {
        asset_id: asset.asset_id,
        nama_aset: asset.nama_aset,
        no_inventaris: asset.no_inventaris,
        kategori: asset.kategori,
        merek: asset.merek,
        model: asset.model,
        serial_number: asset.serial_number,
        lokasi: [asset.gedung, asset.lantai, asset.ruangan, asset.rak]
          .filter(Boolean)
          .join(' / '),
      },
      work_order: workOrder,
    };
  }

  async markReportToWadek(
    woId: string,
    dikirim: boolean,
    user: RequestUser,
  ): Promise<WorkOrder> {
    if (user.role !== Role.KEPALA_LAB) {
      throw new ForbiddenException(
        'Hanya Kepala Lab yang dapat menandai pengiriman laporan ke Wakil Dekan',
      );
    }
    const wo = await this.findOne(woId);
    const statusLama = wo.laporan_ke_wadek;
    wo.laporan_ke_wadek = dikirim;
    wo.waktu_laporan_ke_wadek = dikirim ? new Date() : null;
    wo.dilaporkan_ke_wadek_oleh = dikirim ? user.userId : null;
    const saved = await this.repo.save(wo);
    await this.auditService.logChange({
      entityType: 'WorkOrder',
      entityId: woId,
      fieldName: 'laporan_ke_wadek',
      fieldLama: statusLama,
      fieldBaru: dikirim,
      diubahOleh: user.userId,
      alasan: dikirim
        ? 'Laporan kerusakan ditandai telah dikirim manual ke Wakil Dekan'
        : 'Penandaan pengiriman laporan dibatalkan',
    });
    return saved;
  }
}
