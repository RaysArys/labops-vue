import { Repository } from 'typeorm';
import { Asset } from './asset.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AssetApprovalAction } from './asset-approval.state-machine';
import { AuditService } from '../audit/audit.service';
import { RequestUser } from '../common/decorators/current-user.decorator';
export declare class AssetsService {
    private readonly repo;
    private readonly auditService;
    constructor(repo: Repository<Asset>, auditService: AuditService);
    findAll(): Promise<Asset[]>;
    findOne(assetId: string): Promise<Asset>;
    create(dto: CreateAssetDto, user: RequestUser): Promise<Asset>;
    update(assetId: string, dto: UpdateAssetDto, user: RequestUser): Promise<Asset>;
    transitionApproval(assetId: string, action: AssetApprovalAction, user: RequestUser, alasan?: string): Promise<Asset>;
}
