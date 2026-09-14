import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { Role } from '../common/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { RequestUser } from '../common/decorators/current-user.decorator';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private readonly auditService: AuditService,
  ) {}

  // select: false pada password_hash, jadi query biasa tidak ikut menariknya.
  async findByEmail(email: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder('user')
      .addSelect('user.password_hash')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findById(userId: string): Promise<User | null> {
    return this.repo.findOne({ where: { user_id: userId } });
  }

  async create(data: {
    nama: string;
    email: string;
    passwordHash: string | null;
    role: Role;
  }): Promise<User> {
    const user = this.repo.create({
      nama: data.nama,
      email: data.email,
      password_hash: data.passwordHash,
      role: data.role,
    });
    return this.repo.save(user);
  }

  // Administrasi akun lokal oleh Tata Usaha. Method create() di atas tetap
  // dipertahankan sebagai primitive internal, sedangkan jalur HTTP memakai
  // method ini agar hash, validasi strategy, duplikat, dan audit konsisten.
  //
  // Saat AUTH_STRATEGY=keycloak, user/credential dibuat di Keycloak; endpoint
  // lokal ditolak agar tidak muncul dua sumber kebenaran identitas.
  async createByTataUsaha(
    dto: CreateUserDto,
    dibuatOleh: RequestUser,
  ): Promise<Pick<User, 'user_id' | 'nama' | 'email' | 'role' | 'created_at'>> {
    if (dibuatOleh.role !== Role.TATA_USAHA) {
      throw new ForbiddenException(
        'Hanya Tata Usaha yang dapat membuat user baru',
      );
    }

    if ((process.env.AUTH_STRATEGY ?? 'local') !== 'local') {
      throw new BadRequestException(
        'Pembuatan user lokal tidak tersedia saat AUTH_STRATEGY=keycloak; gunakan administrasi Keycloak',
      );
    }

    // Defense in depth: DTO + ValidationPipe menjadi lapisan pertama, tetapi
    // service tetap menolak role invalid jika dipanggil langsung antar-module.
    if (!Object.values(Role).includes(dto.role)) {
      throw new BadRequestException('Role user tidak valid');
    }

    const email = dto.email.trim().toLowerCase();
    const existing = await this.repo.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException(`Email ${email} sudah terdaftar`);
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = this.repo.create({
      nama: dto.nama.trim(),
      email,
      password_hash: passwordHash,
      role: dto.role,
    });

    let saved: User;
    try {
      saved = await this.repo.save(user);
    } catch (error) {
      // PostgreSQL unique_violation (23505) tetap ditangani untuk menutup
      // race condition di antara pengecekan email dan INSERT.
      if (
        error instanceof QueryFailedError &&
        (error as QueryFailedError & { driverError?: { code?: string } })
          .driverError?.code === '23505'
      ) {
        throw new ConflictException(`Email ${email} sudah terdaftar`);
      }
      throw error;
    }

    await this.auditService.logChange({
      entityType: 'User',
      entityId: saved.user_id,
      fieldName: 'created',
      fieldLama: null,
      fieldBaru: JSON.stringify({ email: saved.email, role: saved.role }),
      diubahOleh: dibuatOleh.userId,
    });

    // Jangan pernah mengembalikan password_hash ke client, walaupun nilainya
    // sudah berupa hash bcrypt.
    return {
      user_id: saved.user_id,
      nama: saved.nama,
      email: saved.email,
      role: saved.role,
      created_at: saved.created_at,
    };
  }
}
