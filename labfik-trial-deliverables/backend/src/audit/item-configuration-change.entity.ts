import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

// Mencatat setiap perubahan field pada entitas apa pun (Asset, CalibrationLog,
// StockOpnameRecord, dst). FR-24/FR-25 di SRS: wajib ada di seluruh modul,
// bukan cuma Master Aset.
@Entity('item_configuration_changes')
export class ItemConfigurationChange {
  @PrimaryGeneratedColumn('uuid')
  icc_id: string;

  // Nama entitas yang berubah, mis. "Asset", "CalibrationLog", "WorkOrder"
  @Column()
  entity_type: string;

  // PK dari baris yang berubah di tabel aslinya
  @Column()
  entity_id: string;

  @Column()
  field_name: string;

  @Column({ type: 'text', nullable: true })
  field_lama: string | null;

  @Column({ type: 'text', nullable: true })
  field_baru: string | null;

  @Column()
  diubah_oleh: string; // user_id

  @Column({ nullable: true })
  alasan: string;

  @CreateDateColumn()
  waktu_perubahan: Date;
}
