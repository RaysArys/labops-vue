import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JadwalStatus } from './enums/calibration-status.enum';

@Entity('calibration_schedules')
export class CalibrationSchedule {
  @PrimaryGeneratedColumn('uuid')
  schedule_id: string;

  @Column()
  asset_id: string;

  @Column()
  interval_bulan: number;

  @Column({ type: 'date', nullable: true })
  tanggal_kalibrasi_terakhir: string | null;

  @Column({ type: 'date', nullable: true })
  tanggal_jatuh_tempo: string | null;

  @Column({
    type: 'enum',
    enum: JadwalStatus,
    default: JadwalStatus.DIJADWALKAN,
  })
  status_kalibrasi: JadwalStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
