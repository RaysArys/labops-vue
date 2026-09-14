import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

// Operasi administrasi user dipisahkan dari AuthModule. AuthModule hanya
// menangani login/token, sedangkan endpoint ini mengelola data User.
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoint ini HANYA relevan untuk AUTH_STRATEGY=local. Pada mode
  // keycloak, akun wajib dibuat melalui Admin Console/API Keycloak agar
  // sumber identitas dan credential tidak bercabang.
  @Post()
  @Roles(Role.TATA_USAHA)
  create(
    @Body() dto: CreateUserDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.usersService.createByTataUsaha(dto, user);
  }
}
