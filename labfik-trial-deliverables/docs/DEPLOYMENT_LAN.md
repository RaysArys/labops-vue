# Panduan Deployment LAN Lab FIK

## 1. Siapkan host

Gunakan satu PC/server LAN dengan Docker Engine/Desktop dan Docker Compose v2. Pastikan client lab dapat menjangkau port 3001, 3000, 8080, dan bila diperlukan 8025. Port PostgreSQL 5432 sebaiknya tidak dibuka ke luar host setelah testing selesai.

## 2. Tentukan alamat LAN

Misal IP server adalah `192.168.10.20`. Salin `.env.example` menjadi `.env`, lalu ubah:

```env
PUBLIC_APP_URL=http://192.168.10.20:3001
PUBLIC_API_URL=http://192.168.10.20:3000
PUBLIC_KEYCLOAK_URL=http://192.168.10.20:8080
CORS_ORIGINS=http://192.168.10.20:3001
```

`PUBLIC_KEYCLOAK_URL` penting karena harus sama persis dengan claim `iss` token yang divalidasi backend.

## 3. Start service

```bash
docker compose up -d --build
docker compose ps
```

Pada instalasi pertama PostgreSQL membuat database aplikasi dan Keycloak, Keycloak mengimpor realm, lalu backend menjalankan migration otomatis.

## 4. Izinkan redirect URI LAN

Realm export default hanya mengizinkan localhost. Setelah Keycloak hidup, jalankan:

```bash
./infrastructure/keycloak/configure-lan-client.sh http://192.168.10.20:3001
```

Helper tersebut memperbarui redirect URI, web origin, dan post-logout URI client `labfik-frontend`. Jika nama container berbeda, isi `KEYCLOAK_CONTAINER` sebelum menjalankan script.

## 5. Uji dari client LAN

Pada komputer lain di LAN, buka `http://192.168.10.20:3001`, login dengan kelima akun uji, dan pastikan menu mengikuti role. Kemudian dari host server jalankan:

```bash
./tests/run-all.sh
```

## 6. Backup dan reset trial

Backup database:

```bash
docker compose exec postgres pg_dump -U labfik_admin labfik_inventory > labfik_inventory.sql
```

Menghentikan tanpa menghapus data:

```bash
docker compose down
```

Perintah `docker compose down -v` menghapus seluruh database trial. Gunakan hanya jika benar-benar ingin reset total.

## 7. Switch ke service UPNVJ

Ketika environment UPN tersedia:

1. Ganti `DB_HOST`, credential database, dan nama database pada environment backend.
2. Ganti `PUBLIC_KEYCLOAK_URL`, realm, frontend client ID, dan API audience/client ID.
3. Daftarkan URL aplikasi LAN pada valid redirect URI, web origin, dan post-logout URI Keycloak UPN.
4. Pastikan token UPN memuat salah satu dari lima role di `realm_access.roles` atau `resource_access.<client-api>.roles`.
5. Pastikan audience access token memuat client ID API.
6. Nonaktifkan akun trial, direct access grant, password default, dan mode `start-dev`.
7. Aktifkan HTTPS, secret manager, backup, monitoring, SMTP riil, serta jalankan QA lengkap.

Mailpit saat ini hanya merepresentasikan server email development; aplikasi belum mengirim notifikasi email. Alamat SMTP dapat diganti setelah fitur notifikasi tersedia.
