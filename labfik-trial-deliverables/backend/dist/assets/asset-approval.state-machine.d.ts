import { ApprovalStatus } from './enums/asset-status.enum';
export type AssetApprovalAction = 'ajukan' | 'setujui' | 'tolak' | 'revisi';
export declare function transitionAssetApproval(current: ApprovalStatus, action: AssetApprovalAction): ApprovalStatus;
