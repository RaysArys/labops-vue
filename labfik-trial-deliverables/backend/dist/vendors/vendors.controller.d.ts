import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import type { RequestUser } from '../common/decorators/current-user.decorator';
export declare class VendorsController {
    private readonly vendorsService;
    constructor(vendorsService: VendorsService);
    findAll(): Promise<import("./vendor.entity").Vendor[]>;
    findOne(id: string): Promise<import("./vendor.entity").Vendor>;
    create(dto: CreateVendorDto, user: RequestUser): Promise<import("./vendor.entity").Vendor>;
    update(id: string, dto: UpdateVendorDto, user: RequestUser): Promise<import("./vendor.entity").Vendor>;
    refreshStatus(id: string): Promise<import("./vendor.entity").Vendor>;
}
