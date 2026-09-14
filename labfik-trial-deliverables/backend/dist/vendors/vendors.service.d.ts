import { Repository } from 'typeorm';
import { Vendor } from './vendor.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { AuditService } from '../audit/audit.service';
import { RequestUser } from '../common/decorators/current-user.decorator';
export declare class VendorsService {
    private readonly repo;
    private readonly auditService;
    constructor(repo: Repository<Vendor>, auditService: AuditService);
    findAll(): Promise<Vendor[]>;
    findOne(vendorId: string): Promise<Vendor>;
    private assertTataUsaha;
    create(dto: CreateVendorDto, user: RequestUser): Promise<Vendor>;
    update(vendorId: string, dto: UpdateVendorDto, user: RequestUser): Promise<Vendor>;
    refreshStatusAkreditasi(vendorId: string, hariAmbangBatas?: number): Promise<Vendor>;
}
