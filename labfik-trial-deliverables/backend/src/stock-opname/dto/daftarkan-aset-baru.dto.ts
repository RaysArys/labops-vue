import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { AssetKategori } from '../../assets/enums/asset-status.enum';
import { KondisiFisik } from '../enums/stock-opname.enum';

// Dipakai saat Laboran menemukan aset fisik yang belum terdaftar di sistem
// (FR-08). Endpoint ini membuat Asset baru (via AssetsService.create — tetap
// tunduk ke alur persetujuan Master Aset, lihat catatan di service) SEKALIGUS
// StockOpnameRecord untuk periode berjalan, dalam satu panggilan.
export class DaftarkanAsetBaruDto {
  @IsString()
  @IsNotEmpty()
  nama_aset: string;

  @IsEnum(AssetKategori)
  kategori: AssetKategori;

  @IsOptional()
  @IsString()
  lokasi_aktual?: string;

  @IsEnum(KondisiFisik)
  kondisi_fisik: KondisiFisik;

  @IsNumber()
  qty_fisik: number;
}
