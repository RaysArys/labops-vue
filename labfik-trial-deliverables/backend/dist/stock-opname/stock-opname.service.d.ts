import { Repository } from 'typeorm';
import { StockOpnamePeriod } from './stock-opname-period.entity';
import { StockOpnameRecord } from './stock-opname-record.entity';
import { OpenPeriodeDto } from './dto/open-periode.dto';
import { InputHasilPemeriksaanDto } from './dto/input-hasil-pemeriksaan.dto';
import { DaftarkanAsetBaruDto } from './dto/daftarkan-aset-baru.dto';
import { TindakLanjutDto } from './dto/tindak-lanjut.dto';
import { AssetsService } from '../assets/assets.service';
import { Asset } from '../assets/asset.entity';
import { MaintenanceService } from '../maintenance/maintenance.service';
import { AuditService } from '../audit/audit.service';
import { RequestUser } from '../common/decorators/current-user.decorator';
export declare class StockOpnameService {
    private readonly periodeRepo;
    private readonly recordRepo;
    private readonly assetRepo;
    private readonly assetsService;
    private readonly maintenanceService;
    private readonly auditService;
    constructor(periodeRepo: Repository<StockOpnamePeriod>, recordRepo: Repository<StockOpnameRecord>, assetRepo: Repository<Asset>, assetsService: AssetsService, maintenanceService: MaintenanceService, auditService: AuditService);
    openPeriode(dto: OpenPeriodeDto, user: RequestUser): Promise<StockOpnamePeriod>;
    findPeriode(periodeId: string): Promise<StockOpnamePeriod>;
    findAllPeriode(): Promise<StockOpnamePeriod[]>;
    closePeriode(periodeId: string, user: RequestUser): Promise<StockOpnamePeriod>;
    private assertPeriodeAktif;
    searchAsset(query: string): Promise<Asset[]>;
    inputHasilPemeriksaan(periodeId: string, dto: InputHasilPemeriksaanDto, user: RequestUser): Promise<StockOpnameRecord>;
    private bandingkanData;
    daftarkanAsetBaru(periodeId: string, dto: DaftarkanAsetBaruDto, user: RequestUser): Promise<{
        asset: Asset;
        record: StockOpnameRecord;
    }>;
    findRecordsByPeriode(periodeId: string): Promise<StockOpnameRecord[]>;
    tindakLanjut(recordId: string, dto: TindakLanjutDto, user: RequestUser): Promise<StockOpnameRecord>;
}
