import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  AssetKategori,
  AssetKondisi,
  AssetStatus,
  ApprovalStatus,
} from './enums/asset-status.enum';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  asset_id: string;

  @Column()
  nama_aset: string;

  @Column({ type: 'enum', enum: AssetKategori })
  kategori: AssetKategori;

  @Column({ nullable: true })
  subkategori: string;

  @Column({ nullable: true })
  merek: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  serial_number: string;

  @Column({ nullable: true })
  no_inventaris: string;

  @Column({ nullable: true })
  tahun_perolehan: number;

  @Column({ type: 'float', default: 1 })
  qty_sistem: number;

  @Column({ nullable: true })
  satuan: string;

  @Column({ type: 'enum', enum: AssetKondisi, default: AssetKondisi.BAIK })
  kondisi: AssetKondisi;

  @Column({ type: 'enum', enum: AssetStatus, default: AssetStatus.AKTIF })
  status_aset: AssetStatus;

  @Column({ nullable: true })
  criticality: string;

  // Lokasi bertingkat
  @Column({ nullable: true })
  gedung: string;

  @Column({ nullable: true })
  lantai: string;

  @Column({ nullable: true })
  ruangan: string;

  @Column({ nullable: true })
  rak: string;

  @Column({ nullable: true })
  pic_pengguna: string;

  @Column({ nullable: true })
  unit_pemilik: string;

  @Column({ nullable: true })
  supplier: string;

  @Column({ nullable: true })
  contract_sla: string;

  // Foto disimpan sebagai binary langsung di DB, sesuai keputusan yang
  // sudah dikonfirmasi (bukan file storage eksternal).
  @Column({ type: 'bytea', nullable: true })
  foto: Buffer | null;

  @Column({ type: 'text', nullable: true })
  catatan: string;

  // Atribut spesifik per kategori (Instrument/Network/ServerPC/dst) disimpan
  // di sini sebagai JSONB, bukan tabel terpisah per kategori — keputusan ini
  // diambil supaya penambahan kategori baru di masa depan tidak perlu
  // migrasi skema. Bentuk isinya menyesuaikan `kategori` di atas, contoh
  // untuk kategori alat_ukur:
  //   { range_ukur: "...", akurasi: "...", resolusi: "...", ... }
  @Column({ type: 'jsonb', default: {} })
  atribut_kategori: Record<string, unknown>;

  // ---- Kolom governance / approval (State Machine A) ----
  @Column({ type: 'enum', enum: ApprovalStatus, default: ApprovalStatus.DRAFT })
  status_approval: ApprovalStatus;

  @Column({ nullable: true })
  diajukan_oleh: string; // user_id

  @Column({ nullable: true })
  disetujui_oleh: string; // user_id (Wakil Dekan)

  @Column({ type: 'timestamp', nullable: true })
  waktu_approval: Date | null;

  // organizational_unit_id disiapkan dari awal (bukan hardcode "FIK")
  // karena sistem berpotensi diperluas ke unit lain di UPNVJ.
  @Column({ default: 'FIK' })
  organizational_unit_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
