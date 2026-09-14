import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Role } from '../common/enums/role.enum';

// Catatan mode AUTH_STRATEGY:
// - local   : password_hash dipakai untuk login manual (bcrypt).
// - keycloak: password_hash tidak dipakai; tabel ini jadi "profile" tambahan
//             saja (nama, dsb), sumber kebenaran login & role pindah ke Keycloak.
//             Kolom role di sini tetap disimpan untuk kemudahan query lokal,
//             tapi saat mode keycloak aktif nilainya di-sync dari token claim,
//             bukan dianggap otoritatif.
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column()
  nama: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true, select: false })
  password_hash: string | null;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @CreateDateColumn()
  created_at: Date;
}
