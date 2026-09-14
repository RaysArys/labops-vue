import { StockOpnameService } from './stock-opname.service';
import { OpenPeriodeDto } from './dto/open-periode.dto';
import { InputHasilPemeriksaanDto } from './dto/input-hasil-pemeriksaan.dto';
import { DaftarkanAsetBaruDto } from './dto/daftarkan-aset-baru.dto';
import { TindakLanjutDto } from './dto/tindak-lanjut.dto';
import type { RequestUser } from '../common/decorators/current-user.decorator';
export declare class StockOpnameController {
    private readonly stockOpnameService;
    constructor(stockOpnameService: StockOpnameService);
    findAllPeriode(): Promise<import("./stock-opname-period.entity").StockOpnamePeriod[]>;
    findPeriode(id: string): Promise<import("./stock-opname-period.entity").StockOpnamePeriod>;
    openPeriode(dto: OpenPeriodeDto, user: RequestUser): Promise<import("./stock-opname-period.entity").StockOpnamePeriod>;
    closePeriode(id: string, user: RequestUser): Promise<import("./stock-opname-period.entity").StockOpnamePeriod>;
    searchAsset(query: string): Promise<import("../assets/asset.entity").Asset[]>;
    inputHasilPemeriksaan(periodeId: string, dto: InputHasilPemeriksaanDto, user: RequestUser): Promise<import("./stock-opname-record.entity").StockOpnameRecord>;
    daftarkanAsetBaru(periodeId: string, dto: DaftarkanAsetBaruDto, user: RequestUser): Promise<{
        asset: import("../assets/asset.entity").Asset;
        record: import("./stock-opname-record.entity").StockOpnameRecord;
    }>;
    findRecordsByPeriode(periodeId: string): Promise<import("./stock-opname-record.entity").StockOpnameRecord[]>;
    tindakLanjut(recordId: string, dto: TindakLanjutDto, user: RequestUser): Promise<import("./stock-opname-record.entity").StockOpnameRecord>;
}
