"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateMeasurement = evaluateMeasurement;
const common_1 = require("@nestjs/common");
function evaluateMeasurement(parameter, nilaiAktual) {
    if (!Number.isFinite(nilaiAktual)) {
        throw new common_1.BadRequestException(`Nilai ${parameter.nama_parameter} harus berupa angka`);
    }
    const memenuhiMin = parameter.batas_min === null || nilaiAktual >= parameter.batas_min;
    const memenuhiMax = parameter.batas_max === null || nilaiAktual <= parameter.batas_max;
    return {
        parameter_id: parameter.parameter_id,
        kode: parameter.kode,
        nama_parameter: parameter.nama_parameter,
        satuan: parameter.satuan,
        batas_min: parameter.batas_min,
        batas_max: parameter.batas_max,
        nilai_aktual: nilaiAktual,
        status: memenuhiMin && memenuhiMax ? 'normal' : 'tidak_normal',
    };
}
//# sourceMappingURL=calibration-evaluation.js.map