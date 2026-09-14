import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatusAkreditasi } from './enums/status-akreditasi.enum';

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  vendor_id: string;

  @Column()
  nama_vendor: string;

  @Column({ nullable: true })
  kontak: string;

  @Column({ nullable: true })
  no_akreditasi: string;

  @Column({ type: 'date', nullable: true })
  tanggal_expired_akreditasi: string | null;

  @Column({
    type: 'enum',
    enum: StatusAkreditasi,
    default: StatusAkreditasi.AKTIF,
  })
  status_akreditasi: StatusAkreditasi;

  @Column()
  dikelola_oleh: string; // user_id (Tata Usaha)

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
