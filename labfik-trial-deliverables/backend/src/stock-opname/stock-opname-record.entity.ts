import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  KondisiFisik,
  StatusTemuan,
  StatusTindakLanjut,
} from './enums/stock-opname.enum';

@Entity('stock_opname_records')
export class StockOpnameRecord {
  @PrimaryGeneratedColumn('uuid')
  record_id: string;

  @Column()
  periode_id: string;

  @Column()
  asset_id: string;

  @Column({ type: 'enum', enum: KondisiFisik })
  kondisi_fisik: KondisiFisik;

  @Column({ nullable: true })
  lokasi_aktual: string;

  @Column({ type: 'float' })
  qty_fisik: number;

  @Column({ type: 'enum', enum: StatusTemuan })
  status_temuan: StatusTemuan;

  // ---- Tindak lanjut (hanya terisi kalau status_temuan != SESUAI) ----
  @Column({ nullable: true })
  pic_tindak_lanjut: string; // user_id

  @Column({ type: 'date', nullable: true })
  target_selesai: string | null;

  @Column({
    type: 'enum',
    enum: StatusTindakLanjut,
    nullable: true,
  })
  status_tindak_lanjut: StatusTindakLanjut | null;

  // Diisi kalau kondisi_fisik = RUSAK dan sistem membuat Work Order otomatis
  // (lihat StockOpnameService.inputHasilPemeriksaan -> eskalasi Maintenance).
  @Column({ type: 'varchar', nullable: true })
  work_order_id: string | null;

  @Column()
  dicatat_oleh: string; // user_id (Laboran)

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
