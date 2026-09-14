import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AssetKategori } from '../assets/enums/asset-status.enum';

@Entity('calibration_parameters')
@Index(['kategori_aset', 'kode'], { unique: true })
export class CalibrationParameter {
  @PrimaryGeneratedColumn('uuid')
  parameter_id: string;

  @Column({ type: 'varchar' })
  kategori_aset: AssetKategori;

  @Column({ type: 'varchar', length: 60 })
  kode: string;

  @Column({ type: 'varchar', length: 160 })
  nama_parameter: string;

  @Column({ type: 'varchar', length: 40 })
  satuan: string;

  @Column({ type: 'float', nullable: true })
  batas_min: number | null;

  @Column({ type: 'float', nullable: true })
  batas_max: number | null;

  @Column({ default: true })
  aktif: boolean;

  @Column()
  dibuat_oleh: string;

  @Column({ nullable: true })
  diubah_oleh: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
