import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './vendor.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { StatusAkreditasi } from './enums/status-akreditasi.enum';
import { AuditService } from '../audit/audit.service';
import { RequestUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly repo: Repository<Vendor>,
    private readonly auditService: AuditService,
  ) {}

  async findAll(): Promise<Vendor[]> {
    return this.repo.find({ order: { created_at: 'DESC' } });
  }

  async findOne(vendorId: string): Promise<Vendor> {
    const vendor = await this.repo.findOne({ where: { vendor_id: vendorId } });
    if (!vendor) throw new NotFoundException(`Vendor ${vendorId} tidak ditemukan`);
    return vendor;
  }

  private assertTataUsaha(user: RequestUser): void {
    if (user.role !== Role.TATA_USAHA) {
      throw new ForbiddenException(
        'Hanya Tata Usaha yang dapat mengelola data vendor',
      );
    }
  }

  // FR-20: Tata Usaha mengelola data vendor (CRUD) dan masa berlaku akreditasi.
  async create(dto: CreateVendorDto, user: RequestUser): Promise<Vendor> {
    this.assertTataUsaha(user);

    const vendor = this.repo.create({
      ...dto,
      dikelola_oleh: user.userId,
      status_akreditasi: StatusAkreditasi.AKTIF,
    });
    return this.repo.save(vendor);
  }

  async update(
    vendorId: string,
    dto: UpdateVendorDto,
    user: RequestUser,
  ): Promise<Vendor> {
    this.assertTataUsaha(user);

    const vendor = await this.findOne(vendorId);
    const before = { ...vendor };
    Object.assign(vendor, dto);
    const saved = await this.repo.save(vendor);

    await this.auditService.logDiff(
      'Vendor',
      vendorId,
      before as unknown as Record<string, unknown>,
      saved as unknown as Record<string, unknown>,
      user.userId,
    );

    return saved;
  }

  // FR-21: notifikasi menjelang akreditasi expired. Sama seperti
  // CalibrationService.refreshStatusJadwal — untuk sekarang dipanggil
  // manual/lewat endpoint, siap disambungkan ke scheduled job nanti.
  // Mekanisme pengiriman notifikasi sungguhan (email/WA/in-app) belum
  // diputuskan (lihat catatan terbuka SRS), jadi transisi status di sini
  // dicatat sebagai audit trail sebagai titik integrasi.
  async refreshStatusAkreditasi(
    vendorId: string,
    hariAmbangBatas = 30,
  ): Promise<Vendor> {
    const vendor = await this.findOne(vendorId);
    if (!vendor.tanggal_expired_akreditasi) return vendor;

    const now = new Date();
    const expired = new Date(vendor.tanggal_expired_akreditasi);
    const selisihHari = Math.floor(
      (expired.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    const statusLama = vendor.status_akreditasi;
    let statusBaru = statusLama;

    if (selisihHari < 0) {
      statusBaru = StatusAkreditasi.EXPIRED;
    } else if (selisihHari <= hariAmbangBatas) {
      statusBaru = StatusAkreditasi.AKAN_EXPIRED;
    } else {
      statusBaru = StatusAkreditasi.AKTIF;
    }

    if (statusBaru !== statusLama) {
      vendor.status_akreditasi = statusBaru;
      await this.repo.save(vendor);

      await this.auditService.logChange({
        entityType: 'Vendor',
        entityId: vendorId,
        fieldName: 'status_akreditasi',
        fieldLama: statusLama,
        fieldBaru: statusBaru,
        diubahOleh: 'system',
      });
    }

    return vendor;
  }
}
