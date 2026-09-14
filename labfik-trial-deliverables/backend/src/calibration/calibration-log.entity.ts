import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HasilKalibrasi, LogApprovalStatus } from './enums/calibration-status.enum';
import { CalibrationMeasurementSnapshot } from './calibration-measurement.types';

@Entity('calibration_logs')
export class CalibrationLog {
  @PrimaryGeneratedColumn('uuid')
  log_id: string;

  @Column()
  schedule_id: string;

  @Column()
  asset_id: string;

  @Column({ nullable: true })
  vendor_id: string;

  @Column({ type: 'date' })
  tanggal_pelaksanaan: string;

  @Column({ type: 'enum', enum: HasilKalibrasi })
  hasil: HasilKalibrasi;

  @Column({ type: 'text', nullable: true })
  deviasi: string;

  // Snapshot parameter dan batas saat pengukuran dilakukan. Snapshot menjaga
  // riwayat tetap valid walaupun standar master diubah di kemudian hari.
  @Column({ type: 'jsonb', default: [] })
  pengukuran: CalibrationMeasurementSnapshot[];

  @Column({ type: 'float', nullable: true })
  biaya: number | null;

  // Sertifikat disimpan sebagai binary di DB, konsisten dengan keputusan
  // yang sama untuk foto Asset.
  @Column({ type: 'bytea', nullable: true })
  sertifikat: Buffer | null;

  @Column({
    type: 'enum',
    enum: LogApprovalStatus,
    default: LogApprovalStatus.PENDING_APPROVAL,
  })
  status_approval: LogApprovalStatus;

  @Column()
  dicatat_oleh: string; // user_id (Laboran)

  @Column({ nullable: true })
  disetujui_oleh: string; // user_id (Kepala Lab)

  @Column({ type: 'timestamp', nullable: true })
  waktu_approval: Date | null;

  @Column({ type: 'text', nullable: true })
  alasan_penolakan: string | null;

  // Diisi kalau ditolak karena alasan teknis dan sistem membuat Work Order
  // otomatis (lihat CalibrationService -> eskalasi Maintenance).
  @Column({ type: 'varchar', nullable: true })
  work_order_id: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
