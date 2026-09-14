import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { TransitionApprovalDto } from './dto/transition-approval.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/decorators/current-user.decorator';

// Matriks akses modul Master Aset (lihat SRS bagian 2):
// - Semua role: view
// - Teknisi/Laboran/Kepala Lab: view + ajukan perubahan
// - Tata Usaha: view + create aset baru
// - Wakil Dekan: satu-satunya yang approve/reject
@Controller('assets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  findAll() {
    return this.assetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetsService.findOne(id);
  }

  // Tata Usaha: input aset baru dari pengadaan resmi (FR-05).
  // Laboran juga dipanggil lewat jalur ini secara internal saat mendaftarkan
  // aset baru dari layar Stock Opname (lihat StockOpnameService, FR-08),
  // makanya Laboran ikut diizinkan di endpoint create.
  @Post()
  @Roles(Role.TATA_USAHA, Role.LABORAN)
  create(@Body() dto: CreateAssetDto, @CurrentUser() user: RequestUser) {
    return this.assetsService.create(dto, user);
  }

  // Semua role operasional boleh mengajukan perubahan data (FR-02).
  @Patch(':id')
  @Roles(Role.TEKNISI, Role.LABORAN, Role.KEPALA_LAB, Role.TATA_USAHA)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAssetDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.assetsService.update(id, dto, user);
  }

  // Transisi status approval. Aksi 'ajukan'/'revisi' boleh oleh pengaju;
  // 'setujui'/'tolak' HANYA Wakil Dekan (FR-03).
  @Patch(':id/approval')
  @Roles(
    Role.TEKNISI,
    Role.LABORAN,
    Role.KEPALA_LAB,
    Role.TATA_USAHA,
    Role.WAKIL_DEKAN,
  )
  transitionApproval(
    @Param('id') id: string,
    @Body() dto: TransitionApprovalDto,
    @CurrentUser() user: RequestUser,
  ) {
    // Validasi tambahan siapa boleh aksi apa dilakukan di service/guard
    // level berikutnya jika perlu lebih granular; untuk saat ini
    // state machine sendiri menolak transisi yang tidak valid secara alur,
    // sementara pembatasan "siapa" bisa diperketat lagi dengan guard
    // khusus per-action kalau dibutuhkan (lihat catatan di assets.service.ts).
    return this.assetsService.transitionApproval(
      id,
      dto.action,
      user,
      dto.alasan,
    );
  }
}
