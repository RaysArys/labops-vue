import { MigrationInterface, QueryRunner } from 'typeorm';

// Baseline skema lengkap yang sebelumnya dibuat oleh synchronize=true.
// Dashboard tidak memiliki entity/tabel sendiri karena seluruh datanya adalah
// agregasi read-only dari tabel domain di bawah ini.
export class InitialSchema1786868981000 implements MigrationInterface {
  name = 'InitialSchema1786868981000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('teknisi', 'laboran', 'kepala_lab', 'tata_usaha', 'wakil_dekan')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."assets_kategori_enum" AS ENUM('alat_ukur', 'jaringan', 'server_pc', 'iot_embedded', 'kelistrikan_ups', 'audio_visual', 'sparepart_bhp')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."assets_kondisi_enum" AS ENUM('baik', 'rusak', 'dalam_perbaikan', 'hilang', 'cadangan')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."assets_status_aset_enum" AS ENUM('aktif', 'maintenance', 'dipinjam', 'dihapuskan')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."assets_status_approval_enum" AS ENUM('draft', 'pending_approval', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."work_orders_asal_temuan_enum" AS ENUM('manual', 'stock_opname', 'kalibrasi')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."work_orders_status_tiket_enum" AS ENUM('open', 'in_progress', 'resolved', 'closed', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."work_orders_prioritas_enum" AS ENUM('rendah', 'sedang', 'tinggi', 'critical')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."stock_opname_periods_status_enum" AS ENUM('aktif', 'selesai')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."stock_opname_records_kondisi_fisik_enum" AS ENUM('baik', 'rusak', 'dalam_perbaikan', 'hilang', 'cadangan')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."stock_opname_records_status_temuan_enum" AS ENUM('sesuai', 'tidak_sesuai', 'tidak_ditemukan', 'kelebihan_fisik')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."stock_opname_records_status_tindak_lanjut_enum" AS ENUM('open', 'in_progress', 'selesai')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."calibration_schedules_status_kalibrasi_enum" AS ENUM('dijadwalkan', 'akan_jatuh_tempo', 'overdue', 'menunggu_perbaikan')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."calibration_logs_hasil_enum" AS ENUM('lulus', 'lulus_bersyarat', 'tidak_lulus')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."calibration_logs_status_approval_enum" AS ENUM('pending_approval', 'approved', 'rejected_dokumen', 'rejected_teknis')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."vendors_status_akreditasi_enum" AS ENUM('aktif', 'akan_expired', 'expired')`,
    );

    await queryRunner.query(`
      CREATE TABLE "users" (
        "user_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "nama" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password_hash" character varying,
        "role" "public"."users_role_enum" NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
        CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "assets" (
        "asset_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "nama_aset" character varying NOT NULL,
        "kategori" "public"."assets_kategori_enum" NOT NULL,
        "subkategori" character varying,
        "merek" character varying,
        "model" character varying,
        "serial_number" character varying,
        "no_inventaris" character varying,
        "tahun_perolehan" integer,
        "qty_sistem" double precision NOT NULL DEFAULT '1',
        "satuan" character varying,
        "kondisi" "public"."assets_kondisi_enum" NOT NULL DEFAULT 'baik',
        "status_aset" "public"."assets_status_aset_enum" NOT NULL DEFAULT 'aktif',
        "criticality" character varying,
        "gedung" character varying,
        "lantai" character varying,
        "ruangan" character varying,
        "rak" character varying,
        "pic_pengguna" character varying,
        "unit_pemilik" character varying,
        "supplier" character varying,
        "contract_sla" character varying,
        "foto" bytea,
        "catatan" text,
        "atribut_kategori" jsonb NOT NULL DEFAULT '{}',
        "status_approval" "public"."assets_status_approval_enum" NOT NULL DEFAULT 'draft',
        "diajukan_oleh" character varying,
        "disetujui_oleh" character varying,
        "waktu_approval" TIMESTAMP,
        "organizational_unit_id" character varying NOT NULL DEFAULT 'FIK',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_ba1dca7766f77b6c475091f860c" PRIMARY KEY ("asset_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "item_configuration_changes" (
        "icc_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "entity_type" character varying NOT NULL,
        "entity_id" character varying NOT NULL,
        "field_name" character varying NOT NULL,
        "field_lama" text,
        "field_baru" text,
        "diubah_oleh" character varying NOT NULL,
        "alasan" character varying,
        "waktu_perubahan" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_48f0455c90afd281c45de494c2b" PRIMARY KEY ("icc_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "work_orders" (
        "wo_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "asset_id" character varying NOT NULL,
        "asal_temuan" "public"."work_orders_asal_temuan_enum" NOT NULL DEFAULT 'manual',
        "referensi_asal_id" character varying,
        "deskripsi_kerusakan" text NOT NULL,
        "status_tiket" "public"."work_orders_status_tiket_enum" NOT NULL DEFAULT 'open',
        "prioritas" "public"."work_orders_prioritas_enum" NOT NULL DEFAULT 'sedang',
        "biaya" double precision,
        "downtime_jam" double precision,
        "catatan_perbaikan" text,
        "dilaporkan_oleh" character varying NOT NULL,
        "dikerjakan_oleh" character varying,
        "diprioritaskan_oleh" character varying,
        "waktu_selesai" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_a21eab5faaa1de947934d34d94f" PRIMARY KEY ("wo_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "stock_opname_periods" (
        "periode_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tanggal_mulai" date NOT NULL,
        "tanggal_selesai" date,
        "status" "public"."stock_opname_periods_status_enum" NOT NULL DEFAULT 'aktif',
        "cakupan_lokasi" character varying,
        "dibuat_oleh" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_828a7a014b34fcfdf807e687e47" PRIMARY KEY ("periode_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "stock_opname_records" (
        "record_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "periode_id" character varying NOT NULL,
        "asset_id" character varying NOT NULL,
        "kondisi_fisik" "public"."stock_opname_records_kondisi_fisik_enum" NOT NULL,
        "lokasi_aktual" character varying,
        "qty_fisik" double precision NOT NULL,
        "status_temuan" "public"."stock_opname_records_status_temuan_enum" NOT NULL,
        "pic_tindak_lanjut" character varying,
        "target_selesai" date,
        "status_tindak_lanjut" "public"."stock_opname_records_status_tindak_lanjut_enum",
        "work_order_id" character varying,
        "dicatat_oleh" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_78e0134a098e3e9691a2d10d66f" PRIMARY KEY ("record_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "calibration_schedules" (
        "schedule_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "asset_id" character varying NOT NULL,
        "interval_bulan" integer NOT NULL,
        "tanggal_kalibrasi_terakhir" date,
        "tanggal_jatuh_tempo" date,
        "status_kalibrasi" "public"."calibration_schedules_status_kalibrasi_enum" NOT NULL DEFAULT 'dijadwalkan',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_3d6b41f6403549dcb755e544e9a" PRIMARY KEY ("schedule_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "calibration_logs" (
        "log_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "schedule_id" character varying NOT NULL,
        "asset_id" character varying NOT NULL,
        "vendor_id" character varying,
        "tanggal_pelaksanaan" date NOT NULL,
        "hasil" "public"."calibration_logs_hasil_enum" NOT NULL,
        "deviasi" text,
        "biaya" double precision,
        "sertifikat" bytea,
        "status_approval" "public"."calibration_logs_status_approval_enum" NOT NULL DEFAULT 'pending_approval',
        "dicatat_oleh" character varying NOT NULL,
        "disetujui_oleh" character varying,
        "waktu_approval" TIMESTAMP,
        "alasan_penolakan" text,
        "work_order_id" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_d8f9f1fc8a18a2444495750981d" PRIMARY KEY ("log_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "vendors" (
        "vendor_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "nama_vendor" character varying NOT NULL,
        "kontak" character varying,
        "no_akreditasi" character varying,
        "tanggal_expired_akreditasi" date,
        "status_akreditasi" "public"."vendors_status_akreditasi_enum" NOT NULL DEFAULT 'aktif',
        "dikelola_oleh" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_0a594d3003be38ea23c2fce9a3c" PRIMARY KEY ("vendor_id")
      )
    `);

    // Entity saat ini memakai scalar varchar untuk logical relation, bukan
    // @ManyToOne/@JoinColumn. Karena PK target bertipe uuid, FK tidak boleh
    // dipaksakan tanpa migration perubahan tipe dan update entity terpisah.
    await queryRunner.query(
      `CREATE INDEX "IDX_assets_no_inventaris" ON "assets" ("no_inventaris")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_assets_lokasi_kategori" ON "assets" ("gedung", "lantai", "ruangan", "kategori")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_audit_entity" ON "item_configuration_changes" ("entity_type", "entity_id", "waktu_perubahan")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_work_orders_asset_status" ON "work_orders" ("asset_id", "status_tiket")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_opname_records_periode" ON "stock_opname_records" ("periode_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_opname_records_asset_tindak_lanjut" ON "stock_opname_records" ("asset_id", "status_tindak_lanjut")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_calibration_schedules_asset_due" ON "calibration_schedules" ("asset_id", "tanggal_jatuh_tempo", "status_kalibrasi")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_calibration_logs_schedule" ON "calibration_logs" ("schedule_id", "tanggal_pelaksanaan")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_calibration_logs_asset_vendor" ON "calibration_logs" ("asset_id", "vendor_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_vendors_expired" ON "vendors" ("tanggal_expired_akreditasi")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "vendors"');
    await queryRunner.query('DROP TABLE "calibration_logs"');
    await queryRunner.query('DROP TABLE "calibration_schedules"');
    await queryRunner.query('DROP TABLE "stock_opname_records"');
    await queryRunner.query('DROP TABLE "stock_opname_periods"');
    await queryRunner.query('DROP TABLE "work_orders"');
    await queryRunner.query('DROP TABLE "item_configuration_changes"');
    await queryRunner.query('DROP TABLE "assets"');
    await queryRunner.query('DROP TABLE "users"');

    await queryRunner.query('DROP TYPE "public"."vendors_status_akreditasi_enum"');
    await queryRunner.query('DROP TYPE "public"."calibration_logs_status_approval_enum"');
    await queryRunner.query('DROP TYPE "public"."calibration_logs_hasil_enum"');
    await queryRunner.query('DROP TYPE "public"."calibration_schedules_status_kalibrasi_enum"');
    await queryRunner.query('DROP TYPE "public"."stock_opname_records_status_tindak_lanjut_enum"');
    await queryRunner.query('DROP TYPE "public"."stock_opname_records_status_temuan_enum"');
    await queryRunner.query('DROP TYPE "public"."stock_opname_records_kondisi_fisik_enum"');
    await queryRunner.query('DROP TYPE "public"."stock_opname_periods_status_enum"');
    await queryRunner.query('DROP TYPE "public"."work_orders_prioritas_enum"');
    await queryRunner.query('DROP TYPE "public"."work_orders_status_tiket_enum"');
    await queryRunner.query('DROP TYPE "public"."work_orders_asal_temuan_enum"');
    await queryRunner.query('DROP TYPE "public"."assets_status_approval_enum"');
    await queryRunner.query('DROP TYPE "public"."assets_status_aset_enum"');
    await queryRunner.query('DROP TYPE "public"."assets_kondisi_enum"');
    await queryRunner.query('DROP TYPE "public"."assets_kategori_enum"');
    await queryRunner.query('DROP TYPE "public"."users_role_enum"');
    // Extension uuid-ossp tidak di-drop karena dapat dipakai skema/aplikasi lain.
  }
}
