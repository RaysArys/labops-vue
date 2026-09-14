import type { Role } from "../../types";
import type { RoleOption } from "./RoleSelector.vue";

export const roleOptions: RoleOption[] = [
  {
    value: "tata_usaha",
    label: "Tata Usaha",
    icon: "▤",
    desc: "Aset, vendor, pengguna",
  },
  {
    value: "wakil_dekan",
    label: "Wakil Dekan",
    icon: "✓",
    desc: "Persetujuan aset",
  },
  {
    value: "laboran",
    label: "Laboran",
    icon: "⌖",
    desc: "Opname dan kalibrasi",
  },
  {
    value: "kepala_lab",
    label: "Kepala Lab",
    icon: "◎",
    desc: "Review dan pengawasan",
  },
  {
    value: "teknisi",
    label: "Teknisi",
    icon: "⌁",
    desc: "Pengerjaan work order",
  },
];

export const defaultRole: Role = "laboran";
