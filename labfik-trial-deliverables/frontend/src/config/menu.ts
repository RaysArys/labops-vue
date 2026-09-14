import type { Role } from "../types";
export interface MenuItem {
  label: string;
  path: string;
  icon: string;
}
export const menuByRole: Record<Role, MenuItem[]> = {
  teknisi: [
    { label: "Dashboard", path: "/dashboard", icon: "▦" },
    { label: "Work order", path: "/work-orders", icon: "⌁" },
  ],
  laboran: [
    { label: "Dashboard", path: "/dashboard", icon: "▦" },
    { label: "Stock opname", path: "/stock-opname", icon: "☷" },
    { label: "Kalibrasi", path: "/calibration", icon: "⌖" },
  ],
  kepala_lab: [
    { label: "Dashboard", path: "/dashboard", icon: "▦" },
    { label: "Kalibrasi", path: "/calibration", icon: "⌖" },
    { label: "Stock opname", path: "/stock-opname", icon: "☷" },
    { label: "Work order", path: "/work-orders", icon: "⌁" },
  ],
  tata_usaha: [
    { label: "Dashboard", path: "/dashboard", icon: "▦" },
    { label: "Master aset", path: "/assets", icon: "□" },
    { label: "Vendor", path: "/vendors", icon: "◇" },
    { label: "Pengguna", path: "/users", icon: "♙" },
  ],
  wakil_dekan: [
    { label: "Dashboard", path: "/dashboard", icon: "▦" },
    { label: "Persetujuan aset", path: "/assets", icon: "□" },
    { label: "Laporan kerusakan", path: "/work-orders", icon: "⌁" },
  ],
};
export const roleLabel: Record<Role, string> = {
  teknisi: "Teknisi",
  laboran: "Laboran",
  kepala_lab: "Kepala Lab",
  tata_usaha: "Tata Usaha",
  wakil_dekan: "Wakil Dekan",
};
