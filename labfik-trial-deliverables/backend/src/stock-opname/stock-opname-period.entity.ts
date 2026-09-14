import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { PeriodeStatus } from './enums/stock-opname.enum';

@Entity('stock_opname_periods')
export class StockOpnamePeriod {
  @PrimaryGeneratedColumn('uuid')
  periode_id: string;

  @Column({ type: 'date' })
  tanggal_mulai: string;

  @Column({ type: 'date', nullable: true })
  tanggal_selesai: string | null;

  @Column({ type: 'enum', enum: PeriodeStatus, default: PeriodeStatus.AKTIF })
  status: PeriodeStatus;

  @Column({ nullable: true })
  cakupan_lokasi: string;

  @Column()
  dibuat_oleh: string; // user_id

  @CreateDateColumn()
  created_at: Date;
}
