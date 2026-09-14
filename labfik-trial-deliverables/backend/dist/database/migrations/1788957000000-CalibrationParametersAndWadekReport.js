"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalibrationParametersAndWadekReport1788957000000 = void 0;
class CalibrationParametersAndWadekReport1788957000000 {
    name = 'CalibrationParametersAndWadekReport1788957000000';
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE "calibration_parameters" (
        "parameter_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "kategori_aset" character varying NOT NULL,
        "kode" character varying(60) NOT NULL,
        "nama_parameter" character varying(160) NOT NULL,
        "satuan" character varying(40) NOT NULL,
        "batas_min" double precision,
        "batas_max" double precision,
        "aktif" boolean NOT NULL DEFAULT true,
        "dibuat_oleh" character varying NOT NULL,
        "diubah_oleh" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_calibration_parameters" PRIMARY KEY ("parameter_id"),
        CONSTRAINT "UQ_calibration_parameters_category_code" UNIQUE ("kategori_aset", "kode"),
        CONSTRAINT "CHK_calibration_parameters_bound" CHECK (
          ("batas_min" IS NOT NULL OR "batas_max" IS NOT NULL)
          AND ("batas_min" IS NULL OR "batas_max" IS NULL OR "batas_min" <= "batas_max")
        )
      )
    `);
        await queryRunner.query(`CREATE INDEX "IDX_calibration_parameters_category_active" ON "calibration_parameters" ("kategori_aset", "aktif")`);
        await queryRunner.query(`
      INSERT INTO "calibration_parameters"
        ("kategori_aset", "kode", "nama_parameter", "satuan", "batas_max", "dibuat_oleh", "diubah_oleh")
      VALUES
        ('server_pc', 'memory_idle', 'Memory idle / standby', '%', 20, 'system', 'system')
      ON CONFLICT ("kategori_aset", "kode") DO NOTHING
    `);
        await queryRunner.query(`ALTER TABLE "calibration_logs" ADD "pengukuran" jsonb NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "work_orders" ADD "laporan_ke_wadek" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "work_orders" ADD "waktu_laporan_ke_wadek" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "work_orders" ADD "dilaporkan_ke_wadek_oleh" character varying`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "work_orders" DROP COLUMN "dilaporkan_ke_wadek_oleh"`);
        await queryRunner.query(`ALTER TABLE "work_orders" DROP COLUMN "waktu_laporan_ke_wadek"`);
        await queryRunner.query(`ALTER TABLE "work_orders" DROP COLUMN "laporan_ke_wadek"`);
        await queryRunner.query(`ALTER TABLE "calibration_logs" DROP COLUMN "pengukuran"`);
        await queryRunner.query('DROP TABLE "calibration_parameters"');
    }
}
exports.CalibrationParametersAndWadekReport1788957000000 = CalibrationParametersAndWadekReport1788957000000;
//# sourceMappingURL=1788957000000-CalibrationParametersAndWadekReport.js.map