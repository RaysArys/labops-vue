# Daftar Deliverables

## Aplikasi

- Source frontend Vue 3/Vite/TypeScript
- Source backend NestJS/TypeORM
- Migration baseline PostgreSQL
- Seluruh modul Dashboard, Master Aset, Vendor, Pengguna, Stock Opname, Kalibrasi, dan Work Order
- Master parameter kalibrasi per kategori aset dan evaluasi hasil otomatis
- Laporan kerusakan siap cetak serta tracking pengiriman manual ke Wakil Dekan

## Infrastruktur development representative

- `docker-compose.yml`
- PostgreSQL dengan volume persisten dan provisioning dua database
- Keycloak realm export dengan client frontend/API, audience mapper, lima role, dan lima akun uji
- Mailpit sebagai service email development
- Dockerfile production build frontend dan backend
- Runtime environment frontend sehingga alamat dapat diganti tanpa mengubah source

## Autentikasi

- Authorization Code Flow + PKCE
- Refresh access token
- Logout SSO
- Validasi RS256, expiry, issuer, dan audience
- Role dari `realm_access` dan `resource_access`
- Switch `AUTH_STRATEGY=keycloak|local`

## Testing dan dokumentasi

- Unit test backend serta type-check/build frontend Vue
- Functional infrastructure smoke test
- Integration test Keycloak dan role API
- Test plan dan test report
- Panduan deployment LAN
- Manual Book DOCX dan PDF
- Panduan flow parameter dan laporan kerusakan terbaru

## Belum termasuk gate production

- QA formal/acceptance UPN
- HTTPS dan certificate management
- Secret manager
- Backup/restore terjadwal
- Monitoring/log aggregation
- SMTP production dan notifikasi aplikasi
- Security assessment/pentest
