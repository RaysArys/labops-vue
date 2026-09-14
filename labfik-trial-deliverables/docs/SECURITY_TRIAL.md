# Catatan Keamanan Environment Trial

- Password di realm export, `.env.example`, dan akun uji bersifat disposable. Ganti sebelum paket dipakai bersama di LAN.
- Jangan commit file `.env` aktual.
- `directAccessGrantsEnabled` pada client frontend hanya dipakai oleh integration test berbasis CLI. Nonaktifkan saat berpindah ke production.
- Keycloak memakai `start-dev` dan HTTP untuk trial LAN. Production wajib memakai mode production dan HTTPS.
- Jangan mengekspos PostgreSQL port 5432 ke jaringan yang tidak dipercaya.
- Hapus akun trial dan bootstrap admin ketika memakai realm UPN.
- Jangan menaruh client secret, password database, token, atau private key di frontend.
- Backend hanya menerima access token bertanda tangan RS256 dengan issuer dan audience yang sesuai.
