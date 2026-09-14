"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalStatus = exports.AssetStatus = exports.AssetKondisi = exports.AssetKategori = void 0;
var AssetKategori;
(function (AssetKategori) {
    AssetKategori["ALAT_UKUR"] = "alat_ukur";
    AssetKategori["JARINGAN"] = "jaringan";
    AssetKategori["SERVER_PC"] = "server_pc";
    AssetKategori["IOT_EMBEDDED"] = "iot_embedded";
    AssetKategori["KELISTRIKAN_UPS"] = "kelistrikan_ups";
    AssetKategori["AUDIO_VISUAL"] = "audio_visual";
    AssetKategori["SPAREPART_BHP"] = "sparepart_bhp";
})(AssetKategori || (exports.AssetKategori = AssetKategori = {}));
var AssetKondisi;
(function (AssetKondisi) {
    AssetKondisi["BAIK"] = "baik";
    AssetKondisi["RUSAK"] = "rusak";
    AssetKondisi["DALAM_PERBAIKAN"] = "dalam_perbaikan";
    AssetKondisi["HILANG"] = "hilang";
    AssetKondisi["CADANGAN"] = "cadangan";
})(AssetKondisi || (exports.AssetKondisi = AssetKondisi = {}));
var AssetStatus;
(function (AssetStatus) {
    AssetStatus["AKTIF"] = "aktif";
    AssetStatus["MAINTENANCE"] = "maintenance";
    AssetStatus["DIPINJAM"] = "dipinjam";
    AssetStatus["DIHAPUSKAN"] = "dihapuskan";
})(AssetStatus || (exports.AssetStatus = AssetStatus = {}));
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["DRAFT"] = "draft";
    ApprovalStatus["PENDING_APPROVAL"] = "pending_approval";
    ApprovalStatus["APPROVED"] = "approved";
    ApprovalStatus["REJECTED"] = "rejected";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
//# sourceMappingURL=asset-status.enum.js.map