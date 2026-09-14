import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  WorkOrderAsalTemuan,
  WorkOrderPrioritas,
  WorkOrderStatus,
} from './enums/work-order-status.enum';

@Entity('work_orders')
export class WorkOrder {
  @PrimaryGeneratedColumn('uuid')
  wo_id: string;

  @Column()
  asset_id: string;

  @Column({
    type: 'enum',
    enum: WorkOrderAsalTemuan,
    default: WorkOrderAsalTemuan.MANUAL,
  })
  asal_temuan: WorkOrderAsalTemuan;

  // Kalau tiket ini dibuat otomatis oleh modul Stock Opname/Kalibrasi,
  // ini diisi id record/log asal, untuk keperluan telusur balik.
  @Column({ nullable: true })
  referensi_asal_id: string;

  @Column({ type: 'text' })
  deskripsi_kerusakan: string;

  @Column({ type: 'enum', enum: WorkOrderStatus, default: WorkOrderStatus.OPEN })
  status_tiket: WorkOrderStatus;

  @Column({
    type: 'enum',
    enum: WorkOrderPrioritas,
    default: WorkOrderPrioritas.SEDANG,
  })
  prioritas: WorkOrderPrioritas;

  @Column({ type: 'float', nullable: true })
  biaya: number | null;

  @Column({ type: 'float', nullable: true })
  downtime_jam: number | null;

  @Column({ type: 'text', nullable: true })
  catatan_perbaikan: string | null;

  @Column()
  dilaporkan_oleh: string; // user_id (Laboran)

  @Column({ nullable: true })
  dikerjakan_oleh: string; // user_id (Teknisi)

  @Column({ nullable: true })
  diprioritaskan_oleh: string; // user_id (Kepala Lab)

  @Column({ type: 'timestamp', nullable: true })
  waktu_selesai: Date | null;

  @Column({ default: false })
  laporan_ke_wadek: boolean;

  @Column({ type: 'timestamp', nullable: true })
  waktu_laporan_ke_wadek: Date | null;

  @Column({ nullable: true })
  dilaporkan_ke_wadek_oleh: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
