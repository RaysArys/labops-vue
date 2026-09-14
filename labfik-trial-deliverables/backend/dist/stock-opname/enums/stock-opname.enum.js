"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KondisiFisik = exports.StatusTindakLanjut = exports.StatusTemuan = exports.PeriodeStatus = void 0;
var PeriodeStatus;
(function (PeriodeStatus) {
    PeriodeStatus["AKTIF"] = "aktif";
    PeriodeStatus["SELESAI"] = "selesai";
})(PeriodeStatus || (exports.PeriodeStatus = PeriodeStatus = {}));
var StatusTemuan;
(function (StatusTemuan) {
    StatusTemuan["SESUAI"] = "sesuai";
    StatusTemuan["TIDAK_SESUAI"] = "tidak_sesuai";
    StatusTemuan["TIDAK_DITEMUKAN"] = "tidak_ditemukan";
    StatusTemuan["KELEBIHAN_FISIK"] = "kelebihan_fisik";
})(StatusTemuan || (exports.StatusTemuan = StatusTemuan = {}));
var StatusTindakLanjut;
(function (StatusTindakLanjut) {
    StatusTindakLanjut["OPEN"] = "open";
    StatusTindakLanjut["IN_PROGRESS"] = "in_progress";
    StatusTindakLanjut["SELESAI"] = "selesai";
})(StatusTindakLanjut || (exports.StatusTindakLanjut = StatusTindakLanjut = {}));
var KondisiFisik;
(function (KondisiFisik) {
    KondisiFisik["BAIK"] = "baik";
    KondisiFisik["RUSAK"] = "rusak";
    KondisiFisik["DALAM_PERBAIKAN"] = "dalam_perbaikan";
    KondisiFisik["HILANG"] = "hilang";
    KondisiFisik["CADANGAN"] = "cadangan";
})(KondisiFisik || (exports.KondisiFisik = KondisiFisik = {}));
//# sourceMappingURL=stock-opname.enum.js.map