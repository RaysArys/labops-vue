import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, FindOptionsWhere } from 'typeorm';
import { StockOpnamePeriod } from './stock-opname-period.entity';
import { StockOpnameRecord } from './stock-opname-record.entity';
import { OpenPeriodeDto } from './dto/open-periode.dto';
import { InputHasilPemeriksaanDto } from './dto/input-hasil-pemeriksaan.dto';
import { DaftarkanAsetBaruDto } from './dto/daftarkan-aset-baru.dto';
import { TindakLanjutDto } from './dto/tindak-lanjut.dto';
import {
  KondisiFisik,
  PeriodeStatus,
  StatusTemuan,
  StatusTindakLanjut,
} from './enums/stock-opname.enum';
import { AssetsService } from '../assets/assets.service';
import { Asset } from '../assets/asset.entity';
import { MaintenanceService } from '../maintenance/maintenance.service';
import { WorkOrderAsalTemuan } from '../maintenance/enums/work-order-status.enum';
import { AuditService } from '../audit/audit.service';
import { RequestUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class StockOpnameService {
  constructor(
    @InjectRepository(StockOpnamePeriod)
    private readonly periodeRepo: Repository<StockOpnamePeriod>,
    @InjectRepository(StockOpnameRecord)
    private readonly recordRepo: Repository<StockOpnameRecord>,
    @InjectRepository(Asset)
    private readonly assetRepo: Repository<Asset>,
    private readonly assetsService: AssetsService,
    private readonly maintenanceService: MaintenanceService,
    private readonly auditService: AuditService,
  ) {}

  // ================= PERIODE =================

  // Alur Stock Opname langkah 1: Kepala Lab/Laboran membuka periode baru.
  async openPeriode(
    dto: OpenPeriodeDto,
    user: RequestUser,
  ): Promise<StockOpnamePeriod> {
    const periode = this.periodeRepo.create({
      tanggal_mulai: dto.tanggal_mulai,
      cakupan_lokasi: dto.cakupan_lokasi,
      status: PeriodeStatus.AKTIF,
      dibuat_oleh: user.userId,
    });
    return this.periodeRepo.save(periode);
  }

  async findPeriode(periodeId: string): Promise<StockOpnamePeriod> {
    const periode = await this.periodeRepo.findOne({
      where: { periode_id: periodeId },
    });
    if (!periode) {
      throw new NotFoundException(`Periode ${periodeId} tidak ditemukan`);
    }
    return periode;
  }

  async findAllPeriode(): Promise<StockOpnamePeriod[]> {
    return this.periodeRepo.find({ order: { created_at: 'DESC' } });
  }

  // Alur Stock Opname langkah 9: menutup periode mengunci seluruh record
  // transaksi (FR-09) — tidak ada kolom "locked" terpisah di record, cukup
  // cek status periode induknya setiap kali mau menulis record baru.
  async closePeriode(
    periodeId: string,
    user: RequestUser,
  ): Promise<StockOpnamePeriod> {
    const periode = await this.findPeriode(periodeId);
    if (periode.status === PeriodeStatus.SELESAI) {
      throw new BadRequestException('Periode ini sudah ditutup');
    }
    periode.status = PeriodeStatus.SELESAI;
    periode.tanggal_selesai = new Date().toISOString().slice(0, 10);
    const saved = await this.periodeRepo.save(periode);

    await this.auditService.logChange({
      entityType: 'StockOpnamePeriod',
      entityId: periodeId,
      fieldName: 'status',
      fieldLama: PeriodeStatus.AKTIF,
      fieldBaru: PeriodeStatus.SELESAI,
      diubahOleh: user.userId,
    });

    return saved;
  }

  private async assertPeriodeAktif(periodeId: string): Promise<StockOpnamePeriod> {
    const periode = await this.findPeriode(periodeId);
    if (periode.status !== PeriodeStatus.AKTIF) {
      throw new ForbiddenException(
        'Periode sudah ditutup — data transaksi tidak dapat diubah (FR-09)',
      );
    }
    return periode;
  }

  // ================= PENCARIAN ASET (FR-06, FR-07) =================

  // Satu method dipakai untuk pencarian teks maupun barcode — barcode/QR di
  // sisi frontend hanya men-decode nilai jadi teks (biasanya no_inventaris
  // atau asset_id), lalu memanggil endpoint yang sama.
  async searchAsset(query: string): Promise<Asset[]> {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        query,
      );

    const where: FindOptionsWhere<Asset>[] = [
      { nama_aset: ILike(`%${query}%`) },
      { no_inventaris: ILike(`%${query}%`) },
      { serial_number: ILike(`%${query}%`) },
    ];
    // asset_id bertipe uuid di database — hanya disertakan kalau query
    // memang berbentuk UUID, supaya pencarian teks biasa tidak menyebabkan
    // error "invalid input syntax for type uuid" dari PostgreSQL.
    if (isUuid) {
      where.push({ asset_id: query });
    }

    return this.assetRepo.find({ where, take: 20 });
  }

  // ================= INPUT PEMERIKSAAN =================

  // Alur Stock Opname langkah 3 & 5-7: aset SUDAH terdaftar — catat kondisi
  // fisik, bandingkan otomatis dengan data sistem, dan eskalasi ke
  // Maintenance kalau kondisinya rusak.
  async inputHasilPemeriksaan(
    periodeId: string,
    dto: InputHasilPemeriksaanDto,
    user: RequestUser,
  ): Promise<StockOpnameRecord> {
    await this.assertPeriodeAktif(periodeId);
    const asset = await this.assetsService.findOne(dto.asset_id);

    const statusTemuan = this.bandingkanData(asset, dto);

    let workOrderId: string | null = null;
    if (dto.kondisi_fisik === KondisiFisik.RUSAK) {
      const wo = await this.maintenanceService.createFromEscalation({
        assetId: dto.asset_id,
        deskripsi: `Ditemukan rusak saat Stock Opname periode ${periodeId}`,
        asalTemuan: WorkOrderAsalTemuan.STOCK_OPNAME,
        referensiAsalId: periodeId,
        dilaporkanOleh: user.userId,
      });
      workOrderId = wo.wo_id;
    }

    const record = this.recordRepo.create({
      periode_id: periodeId,
      asset_id: dto.asset_id,
      kondisi_fisik: dto.kondisi_fisik,
      lokasi_aktual: dto.lokasi_aktual,
      qty_fisik: dto.qty_fisik,
      status_temuan: statusTemuan,
      status_tindak_lanjut:
        statusTemuan === StatusTemuan.SESUAI ? null : StatusTindakLanjut.OPEN,
      work_order_id: workOrderId,
      dicatat_oleh: user.userId,
    });
    const saved = await this.recordRepo.save(record);

    await this.auditService.logChange({
      entityType: 'StockOpnameRecord',
      entityId: saved.record_id,
      fieldName: 'status_temuan',
      fieldLama: null,
      fieldBaru: statusTemuan,
      diubahOleh: user.userId,
    });

    return saved;
  }

  // FR-10: perbandingan otomatis data sistem vs data fisik.
  private bandingkanData(
    asset: Asset,
    dto: InputHasilPemeriksaanDto,
  ): StatusTemuan {
    if (dto.qty_fisik <= 0) return StatusTemuan.TIDAK_DITEMUKAN;
    if (dto.qty_fisik > asset.qty_sistem) return StatusTemuan.KELEBIHAN_FISIK;

    const kondisiSesuai = dto.kondisi_fisik === (asset.kondisi as unknown as KondisiFisik);
    const qtySesuai = dto.qty_fisik === asset.qty_sistem;

    if (kondisiSesuai && qtySesuai) return StatusTemuan.SESUAI;
    return StatusTemuan.TIDAK_SESUAI;
  }

  // Alur Stock Opname langkah 4: aset BELUM terdaftar — daftarkan lewat
  // AssetsService (masuk alur persetujuan Master Aset sebagai Draft, FR-08),
  // lalu catat StockOpnameRecord untuk periode berjalan sekaligus.
  async daftarkanAsetBaru(
    periodeId: string,
    dto: DaftarkanAsetBaruDto,
    user: RequestUser,
  ): Promise<{ asset: Asset; record: StockOpnameRecord }> {
    await this.assertPeriodeAktif(periodeId);

    const asset = await this.assetsService.create(
      {
        nama_aset: dto.nama_aset,
        kategori: dto.kategori,
        qty_sistem: dto.qty_fisik,
      },
      user,
    );

    const record = this.recordRepo.create({
      periode_id: periodeId,
      asset_id: asset.asset_id,
      kondisi_fisik: dto.kondisi_fisik,
      lokasi_aktual: dto.lokasi_aktual,
      qty_fisik: dto.qty_fisik,
      // Aset baru dianggap "Sesuai" secara temuan opname (memang belum ada
      // data sistem untuk dibandingkan) — status_approval Asset itu sendiri
      // yang menentukan apakah dia sudah resmi aktif atau masih Draft.
      status_temuan: StatusTemuan.SESUAI,
      status_tindak_lanjut: null,
      dicatat_oleh: user.userId,
    });
    const savedRecord = await this.recordRepo.save(record);

    return { asset, record: savedRecord };
  }

  // ================= TINDAK LANJUT (FR-11) =================

  async findRecordsByPeriode(periodeId: string): Promise<StockOpnameRecord[]> {
    return this.recordRepo.find({
      where: { periode_id: periodeId },
      order: { created_at: 'DESC' },
    });
  }

  async tindakLanjut(
    recordId: string,
    dto: TindakLanjutDto,
    user: RequestUser,
  ): Promise<StockOpnameRecord> {
    if (user.role !== Role.KEPALA_LAB) {
      throw new ForbiddenException(
        'Hanya Kepala Lab yang dapat meninjau/menyetujui tindak lanjut temuan',
      );
    }

    const record = await this.recordRepo.findOne({
      where: { record_id: recordId },
    });
    if (!record) {
      throw new NotFoundException(`Record ${recordId} tidak ditemukan`);
    }
    if (record.status_temuan === StatusTemuan.SESUAI) {
      throw new BadRequestException(
        'Temuan berstatus Sesuai tidak memerlukan tindak lanjut',
      );
    }

    const statusLama = record.status_tindak_lanjut;
    record.pic_tindak_lanjut = dto.pic_tindak_lanjut ?? record.pic_tindak_lanjut;
    record.target_selesai = dto.target_selesai ?? record.target_selesai;
    record.status_tindak_lanjut = dto.status_tindak_lanjut as StatusTindakLanjut;

    const saved = await this.recordRepo.save(record);

    await this.auditService.logChange({
      entityType: 'StockOpnameRecord',
      entityId: recordId,
      fieldName: 'status_tindak_lanjut',
      fieldLama: statusLama,
      fieldBaru: saved.status_tindak_lanjut,
      diubahOleh: user.userId,
    });

    return saved;
  }
}
