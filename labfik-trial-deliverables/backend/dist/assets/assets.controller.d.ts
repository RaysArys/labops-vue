import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { TransitionApprovalDto } from './dto/transition-approval.dto';
import type { RequestUser } from '../common/decorators/current-user.decorator';
export declare class AssetsController {
    private readonly assetsService;
    constructor(assetsService: AssetsService);
    findAll(): Promise<import("./asset.entity").Asset[]>;
    findOne(id: string): Promise<import("./asset.entity").Asset>;
    create(dto: CreateAssetDto, user: RequestUser): Promise<import("./asset.entity").Asset>;
    update(id: string, dto: UpdateAssetDto, user: RequestUser): Promise<import("./asset.entity").Asset>;
    transitionApproval(id: string, dto: TransitionApprovalDto, user: RequestUser): Promise<import("./asset.entity").Asset>;
}
