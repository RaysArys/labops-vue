import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './asset.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { ApprovalStatus } from './enums/asset-status.enum';
import {
  transitionAssetApproval,
  AssetApprovalAction,
} from './asset-approval.state-machine';
import { AuditService } from '../audit/audit.service';
import { RequestUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private readonly repo: Repository<Asset>,
    private readonly auditService: AuditService,
  ) {}

  async findAll(): Promise<Asset[]> {
    return this.repo.find({ order: { created_at: 'DESC' } });
  }

  async findOne(assetId: string): Promise<Asset> {
    const asset = await this.repo.findOne({ where: { asset_id: assetId } });
    if (!asset) throw new NotFoundException(`Aset ${assetId} tidak ditemukan`);
    return asset;
  }

  // FR-01/FR-05: siapa pun boleh membuat draft (Tata Usaha untuk aset baru
  // hasil pengadaan, atau Laboran saat menemukan aset belum terdaftar
  // ketika stock opname — lihat StockOpnameService). Draft ini belum aktif
  // sampai diajukan dan disetujui.
  async create(dto: CreateAssetDto, user: RequestUser): Promise<Asset> {
    const asset = this.repo.create({
      ...dto,
      status_approval: ApprovalStatus.DRAFT,
      diajukan_oleh: user.userId,
    });
    return this.repo.save(asset);
  }

  // FR-02: perubahan pada aset yang statusnya sudah APPROVED tidak langsung
  // berlaku — kembali jadi DRAFT (revisi) dan harus melalui approval lagi.
  // Aset yang masih DRAFT/REJECTED boleh diedit langsung tanpa reset status.
  async update(
    assetId: string,
    dto: UpdateAssetDto,
    user: RequestUser,
  ): Promise<Asset> {
    const asset = await this.findOne(assetId);
    const before = { ...asset };

    Object.assign(asset, dto);

    if (asset.status_approval === ApprovalStatus.APPROVED) {
      asset.status_approval = ApprovalStatus.DRAFT;
      asset.diajukan_oleh = user.userId;
      asset.disetujui_oleh = null as unknown as string;
      asset.waktu_approval = null;
    }

    const saved = await this.repo.save(asset);

    await this.auditService.logDiff(
      'Asset',
      assetId,
      before as unknown as Record<string, unknown>,
      saved as unknown as Record<string, unknown>,
      user.userId,
    );

    return saved;
  }

  // Menjalankan transisi state machine approval (ajukan/setujui/tolak/revisi).
  // RolesGuard di controller yang membatasi siapa boleh panggil aksi apa
  // (mis. hanya WAKIL_DEKAN yang boleh 'setujui'/'tolak').
  async transitionApproval(
    assetId: string,
    action: AssetApprovalAction,
    user: RequestUser,
    alasan?: string,
  ): Promise<Asset> {
    // FR-03: hanya Wakil Dekan yang boleh menyetujui/menolak. RolesGuard di
    // controller sengaja dibuka untuk semua role (karena 'ajukan'/'revisi'
    // memang boleh dilakukan role operasional), jadi pembatasan spesifik per
    // aksi ini divalidasi di sini.
    if (
      (action === 'setujui' || action === 'tolak') &&
      user.role !== Role.WAKIL_DEKAN
    ) {
      throw new ForbiddenException(
        'Hanya Wakil Dekan yang dapat menyetujui/menolak perubahan aset',
      );
    }

    const asset = await this.findOne(assetId);
    const statusLama = asset.status_approval;

    asset.status_approval = transitionAssetApproval(statusLama, action);

    if (action === 'ajukan') {
      asset.diajukan_oleh = user.userId;
    }
    if (action === 'setujui' || action === 'tolak') {
      asset.disetujui_oleh = user.userId;
      asset.waktu_approval = new Date();
    }

    const saved = await this.repo.save(asset);

    await this.auditService.logChange({
      entityType: 'Asset',
      entityId: assetId,
      fieldName: 'status_approval',
      fieldLama: statusLama,
      fieldBaru: asset.status_approval,
      diubahOleh: user.userId,
      alasan,
    });

    return saved;
  }
}
