import { Repository } from 'typeorm';
import { ItemConfigurationChange } from './item-configuration-change.entity';
export interface LogChangeParams {
    entityType: string;
    entityId: string;
    fieldName: string;
    fieldLama: unknown;
    fieldBaru: unknown;
    diubahOleh: string;
    alasan?: string;
}
export declare class AuditService {
    private readonly repo;
    constructor(repo: Repository<ItemConfigurationChange>);
    logChange(params: LogChangeParams): Promise<void>;
    logDiff(entityType: string, entityId: string, before: Record<string, unknown>, after: Record<string, unknown>, diubahOleh: string, alasan?: string): Promise<void>;
    findByEntity(entityType: string, entityId: string): Promise<ItemConfigurationChange[]>;
    findByUser(userId: string): Promise<ItemConfigurationChange[]>;
}
