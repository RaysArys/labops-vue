import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(ItemConfigurationChange)
    private readonly repo: Repository<ItemConfigurationChange>,
  ) {}

  // Dipanggil dari service module lain setiap ada perubahan field.
  // Contoh pemakaian di AssetsService:
  //   await this.auditService.logChange({
  //     entityType: 'Asset', entityId: asset.asset_id,
  //     fieldName: 'kondisi', fieldLama: 'Baik', fieldBaru: 'Rusak',
  //     diubahOleh: user.userId,
  //   });
  async logChange(params: LogChangeParams): Promise<void> {
    const entry = this.repo.create({
      entity_type: params.entityType,
      entity_id: params.entityId,
      field_name: params.fieldName,
      field_lama: params.fieldLama != null ? String(params.fieldLama) : null,
      field_baru: params.fieldBaru != null ? String(params.fieldBaru) : null,
      diubah_oleh: params.diubahOleh,
      alasan: params.alasan,
    });
    await this.repo.save(entry);
  }

  // Bandingkan object lama vs baru, catat tiap field yang berbeda.
  // Berguna dipanggil sekali saat update entity dengan banyak field sekaligus.
  async logDiff(
    entityType: string,
    entityId: string,
    before: Record<string, unknown>,
    after: Record<string, unknown>,
    diubahOleh: string,
    alasan?: string,
  ): Promise<void> {
    const changedFields = Object.keys(after).filter(
      (key) => before[key] !== after[key],
    );
    for (const field of changedFields) {
      await this.logChange({
        entityType,
        entityId,
        fieldName: field,
        fieldLama: before[field],
        fieldBaru: after[field],
        diubahOleh,
        alasan,
      });
    }
  }

  async findByEntity(
    entityType: string,
    entityId: string,
  ): Promise<ItemConfigurationChange[]> {
    return this.repo.find({
      where: { entity_type: entityType, entity_id: entityId },
      order: { waktu_perubahan: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<ItemConfigurationChange[]> {
    return this.repo.find({
      where: { diubah_oleh: userId },
      order: { waktu_perubahan: 'DESC' },
    });
  }
}
