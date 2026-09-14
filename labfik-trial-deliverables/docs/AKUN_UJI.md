# Akun Uji LabFIK

Semua akun berikut hanya untuk environment trial.

| Role | Username Keycloak | Email login lokal | Password | Menu utama |
|---|---|---|---|---|
| Tata Usaha | `tu.trial` | `tu.trial@labfik.local` | `Trial123!` | Master Aset, Vendor, Pengguna |
| Wakil Dekan | `wadek.trial` | `wadek.trial@labfik.local` | `Trial123!` | Persetujuan Aset, Laporan Kerusakan |
| Laboran | `laboran.trial` | `laboran.trial@labfik.local` | `Trial123!` | Stock Opname, Kalibrasi |
| Kepala Lab | `kalab.trial` | `kalab.trial@labfik.local` | `Trial123!` | Kalibrasi, Master Parameter, Opname, Work Order |
| Teknisi | `teknisi.trial` | `teknisi.trial@labfik.local` | `Trial123!` | Work Order |

Keycloak menerima username atau email. Mode lokal menerima email.

Sebelum paket dipakai bersama di LAN, ubah password seluruh akun dan password admin/database pada `.env`. Akun trial harus dihapus saat beralih ke server UPNVJ.
