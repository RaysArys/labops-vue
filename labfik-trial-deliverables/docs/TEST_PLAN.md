# Test Plan

## Unit testing

- State machine approval aset
- State machine Work Order
- State machine approval kalibrasi
- Evaluasi batas minimum, maksimum, dan rentang parameter kalibrasi

## Frontend validation

- Type-check seluruh komponen Vue dengan `vue-tsc`
- Production build dengan Vite
- Pemetaan role Keycloak dari `realm_access`
- Pemetaan role Keycloak dari `resource_access`
- Penolakan role di luar lima role sistem

## Functional testing

- Frontend, backend, Keycloak realm, dan Mailpit dapat dijangkau
- Production build frontend dan backend berhasil
- Login/redirect Keycloak memakai Authorization Code + PKCE
- Refresh access token berlangsung sebelum kedaluwarsa
- Logout mengakhiri sesi Keycloak dan kembali ke aplikasi

## Integration testing

- Lima akun dapat memperoleh token dari realm trial
- Backend menerima issuer, signature, dan audience yang valid
- Dashboard dapat diakses oleh kelima role
- Endpoint mutasi yang bukan kewenangan role mengembalikan HTTP 403
- Wakil Dekan hanya menerima Work Order yang sudah ditandai sebagai laporan terkirim
- Laboran tidak dapat mengubah master parameter kalibrasi

## Acceptance role

| Role | Akses utama yang harus terlihat |
|---|---|
| Tata Usaha | Master Aset, Vendor, Pengguna |
| Wakil Dekan | Persetujuan Aset, Laporan Kerusakan |
| Laboran | Stock Opname, Kalibrasi |
| Kepala Lab | Kalibrasi, Master Parameter, Stock Opname, Work Order, Kirim Laporan |
| Teknisi | Work Order |

Pengujian runtime dijalankan dengan `./tests/run-all.sh` setelah Docker Compose aktif.
