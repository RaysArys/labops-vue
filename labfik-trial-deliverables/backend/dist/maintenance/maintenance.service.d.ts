import { Repository } from 'typeorm';
import { WorkOrder } from './work-order.entity';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { WorkOrderAsalTemuan } from './enums/work-order-status.enum';
import { WorkOrderAction } from './work-order.state-machine';
import { AuditService } from '../audit/audit.service';
import { RequestUser } from '../common/decorators/current-user.decorator';
import { AssetsService } from '../assets/assets.service';
export declare class MaintenanceService {
    private readonly repo;
    private readonly auditService;
    private readonly assetsService;
    constructor(repo: Repository<WorkOrder>, auditService: AuditService, assetsService: AssetsService);
    findAll(user?: RequestUser): Promise<WorkOrder[]>;
    findOne(woId: string, user?: RequestUser): Promise<WorkOrder>;
    create(dto: CreateWorkOrderDto, user: RequestUser): Promise<WorkOrder>;
    createFromEscalation(params: {
        assetId: string;
        deskripsi: string;
        asalTemuan: WorkOrderAsalTemuan;
        referensiAsalId: string;
        dilaporkanOleh: string;
    }): Promise<WorkOrder>;
    transitionStatus(woId: string, action: WorkOrderAction, user: RequestUser, extra: {
        catatan_perbaikan?: string;
        biaya?: number;
        downtime_jam?: number;
    }): Promise<WorkOrder>;
    setPrioritas(woId: string, prioritas: string, user: RequestUser): Promise<WorkOrder>;
    buildDamageReport(woId: string, user: RequestUser): Promise<{
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
        work_order: WorkOrder;
    }>;
    markReportToWadek(woId: string, dikirim: boolean, user: RequestUser): Promise<WorkOrder>;
}
