# LabFIK UPNVJ — Paket Trial Full Stack

Paket ini merepresentasikan environment production untuk keperluan testing/trial di LAN Lab FIK. Seluruh alamat service dapat diganti melalui `.env` ketika infrastruktur UPNVJ tersedia.

## Isi paket

- Vue 3 frontend (Vite + TypeScript) dengan login Keycloak Authorization Code + PKCE
- NestJS backend sebagai OAuth2 resource server
- PostgreSQL untuk data aplikasi dan data Keycloak
- Keycloak realm `labfik`, dua client, lima role, dan lima akun uji
- Mailpit sebagai representasi server email development
- Migration database, unit test, functional smoke test, integration role test
- Panduan deployment LAN dan test report
- Fallback autentikasi lokal melalui switch environment
- Master parameter pengukuran per kategori dengan batas minimum/maksimum
- Evaluasi otomatis hasil kalibrasi dan snapshot standar pada riwayat
- Laporan kerusakan siap cetak serta penandaan pengiriman manual ke Wakil Dekan

## Menjalankan paket trial

Prasyarat: Docker Engine/Desktop dengan Docker Compose v2.

```bash
cp .env.example .env
docker compose up -d --build
```

Tunggu Keycloak dan backend selesai start, kemudian buka:

| Service | Alamat default |
|---|---|
| Aplikasi | http://localhost:3001 |
| Backend API | http://localhost:3000 |
| Keycloak | http://localhost:8080 |
| Keycloak Admin | http://localhost:8080/admin |
| Mailpit | http://localhost:8025 |

Login aplikasi memakai salah satu akun pada [docs/AKUN_UJI.md](docs/AKUN_UJI.md). Admin Console memakai user/password admin dari `.env`.

## Menjalankan pengujian

Setelah service Docker aktif:

```bash
./tests/run-all.sh
```

Script menjalankan unit test backend, type-check dan production build frontend, smoke test lima service, login lima akun Keycloak, serta pemeriksaan hak akses API. Hasil verifikasi yang sudah dilakukan saat paket dibuat ada di [docs/TEST_REPORT.md](docs/TEST_REPORT.md).

## Mode autentikasi

Default paket adalah:

```env
AUTH_STRATEGY=keycloak
```

Untuk fallback lokal khusus development:

```env
AUTH_STRATEGY=local
ALLOW_TRIAL_SEED=true
```

Lalu buat ulang container backend dan frontend:

```bash
docker compose up -d --build --force-recreate backend frontend
```

Login lokal memakai email akun pada `docs/AKUN_UJI.md` dan password trial yang sama. Jangan aktifkan `ALLOW_TRIAL_SEED` pada environment production.

## Struktur utama

```text
backend/                 NestJS API, migration, unit test
frontend/                Vue 3 UI, Vite, Pinia, dan Keycloak adapter
infrastructure/keycloak  Realm export dan helper LAN
infrastructure/postgres  Initial database provisioning
tests/                   Functional dan integration test
docs/                    Deployment, akun uji, test plan/report
docker-compose.yml       Orkestrasi seluruh service
```

## Catatan batas scope

Environment ini untuk trial PKL, bukan production. HTTPS, secret manager, backup/restore terjadwal, monitoring, SMTP riil, hardening Keycloak, pentest, dan QA acceptance formal tetap harus dilakukan sebelum go-live.
