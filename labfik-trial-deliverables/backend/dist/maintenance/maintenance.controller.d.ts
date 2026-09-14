import { MaintenanceService } from './maintenance.service';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { TransitionWorkOrderDto } from './dto/transition-work-order.dto';
import { SetPrioritasDto } from './dto/set-prioritas.dto';
import type { RequestUser } from '../common/decorators/current-user.decorator';
import { MarkWadekReportDto } from './dto/mark-wadek-report.dto';
export declare class MaintenanceController {
    private readonly maintenanceService;
    constructor(maintenanceService: MaintenanceService);
    findAll(user: RequestUser): Promise<import("./work-order.entity").WorkOrder[]>;
    findOne(id: string, user: RequestUser): Promise<import("./work-order.entity").WorkOrder>;
    buildDamageReport(id: string, user: RequestUser): Promise<{
        nomor_laporan: string;
        dibuat_pada: Date;
        asset: {
            asset_id: string;
            nama_aset: string;
            no_inventaris: string;
            kategori: import("../assets/enums/asset-status.enum").AssetKategori;
            merek: string;
            model: string;
            serial_number: string;
            lokasi: string;
        };
        work_order: import("./work-order.entity").WorkOrder;
    }>;
    create(dto: CreateWorkOrderDto, user: RequestUser): Promise<import("./work-order.entity").WorkOrder>;
    transitionStatus(id: string, dto: TransitionWorkOrderDto, user: RequestUser): Promise<import("./work-order.entity").WorkOrder>;
    setPrioritas(id: string, dto: SetPrioritasDto, user: RequestUser): Promise<import("./work-order.entity").WorkOrder>;
    markReportToWadek(id: string, dto: MarkWadekReportDto, user: RequestUser): Promise<import("./work-order.entity").WorkOrder>;
}
