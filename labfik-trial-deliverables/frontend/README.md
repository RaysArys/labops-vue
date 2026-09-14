# LabOps FIK Frontend — Vue 3

Frontend Vue 3 + Vite + TypeScript untuk LabOps FIK. Mendukung autentikasi lokal dan Keycloak SSO melalui konfigurasi runtime.

## Development

```bash
npm install
npm run dev
```

Salin `.env.example` menjadi `.env` bila dijalankan tanpa Docker.

## Production build

```bash
npm run build
```

Hasil build berada di `dist/`.

Untuk mengganti visual halaman login, timpa file `public/lab-photo.jpg`. Ubah URL gambar pada aturan `.login-visual` di `src/styles/theme.css` bila memakai format lain.
