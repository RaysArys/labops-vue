# Test Report — LabFIK Trial

Tanggal verifikasi paket: 9 September 2026

## Ringkasan

| Area | Hasil | Bukti |
|---|---|---|
| Backend unit test | PASS | 6 suite, 13 test lulus |
| Frontend Vue type-check | PASS | `vue-tsc --noEmit` selesai tanpa error |
| Backend production build | PASS | `nest build` selesai tanpa error |
| Frontend production build | PASS | optimized build selesai tanpa error |
| Keycloak realm export | PASS | JSON valid; realm, 2 client, 5 role, 5 user tersedia |
| Docker Compose static validation | PASS | YAML valid; PostgreSQL, Keycloak, backend, frontend, Mailpit tersedia |
| Shell test syntax | PASS | Seluruh script lolos `sh -n` |
| Functional runtime Docker | READY, BELUM DIEKSEKUSI | Host pembuatan paket tidak memiliki Docker daemon |
| Integration Keycloak–API | READY, BELUM DIEKSEKUSI | Script tersedia dan dijalankan setelah Compose aktif |

## Pengujian yang lulus

- Approval aset: jalur draft ke approved dan penolakan transisi ilegal
- Work Order: jalur open ke closed dan penolakan reopen dari closed
- Kalibrasi: revisi dokumen dan finalitas status approved
- Parameter kalibrasi: batas maksimum, rentang min–max, dan penolakan nilai bukan angka
- Backend role mapper: realm role, client role, dan unknown role
- Frontend Vue mempertahankan pemetaan role dari `realm_access` dan `resource_access`

## Cara melengkapi bukti runtime

Jalankan pada host yang memiliki Docker:

```bash
cp .env.example .env
docker compose up -d --build
./tests/run-all.sh | tee docs/TEST_RUNTIME_OUTPUT.txt
```

Setelah semua baris menampilkan `LULUS`, lampirkan `TEST_RUNTIME_OUTPUT.txt` bersama report ini. Pengujian manual browser tetap diperlukan untuk membuktikan redirect login, refresh sesi, logout SSO, dan tampilan menu kelima role.

## Kesimpulan

Source, build, unit test, konfigurasi Keycloak, master parameter pengukuran, pelaporan kerusakan ke Wakil Dekan, dan orkestrasi infrastructure sudah siap sebagai paket trial. Status ini bukan persetujuan production; runtime Docker pada LAN UPN dan QA formal tetap menjadi gate berikutnya.
