# Desa Kula AI Studio — V2

V2 mengubah Content Planner lokal menjadi **AI Script Generator**.

## Arsitektur

```text
GitHub Pages
    ↓
Desa Kula AI Studio (frontend)
    ↓ HTTPS
Cloudflare Worker (backend)
    ↓
OpenAI Responses API
    ↓
Naskah 10–30 menit + storyboard + paket YouTube
```

GitHub Pages hanya menyimpan frontend. **API key tidak boleh ditaruh di `app.js`** karena repository dapat bersifat publik.

## File

- `index.html` — tampilan aplikasi
- `style.css` — desain
- `app.js` — frontend
- `worker.js` — backend Cloudflare Worker
- `README.md` — panduan

## Tahap 1 — Deploy backend

1. Buat akun/login di Cloudflare.
2. Buka Workers & Pages → Create application → Worker.
3. Buat Worker baru.
4. Ganti kode Worker dengan isi `worker.js`.
5. Tambahkan secret/environment variable:
   - Name: `OPENAI_API_KEY`
   - Value: API key OpenAI Anda.
6. Deploy.
7. Catat URL Worker, misalnya:
   `https://desa-kula-ai.nama-anda.workers.dev`

Endpoint aplikasi adalah:
`https://desa-kula-ai.nama-anda.workers.dev/generate`

## Tahap 2 — Hubungkan frontend

Buka `app.js`.

Cari:

```js
const API_URL = "PASTE_BACKEND_URL_HERE";
```

Ganti menjadi:

```js
const API_URL = "https://URL-WORKER-ANDA.workers.dev/generate";
```

Simpan lalu upload/replace `app.js` di repository GitHub.

## Catatan keamanan

- Jangan menaruh `OPENAI_API_KEY` di `index.html`, `app.js`, atau file frontend lainnya.
- Jangan commit file `.env` yang berisi API key.
- Untuk produksi, tambahkan autentikasi/rate limit agar endpoint tidak bisa dipakai orang lain tanpa batas.
- Sebelum mempublikasikan konten tentang regulasi, anggaran, pejabat, atau kondisi terkini, verifikasi fakta dan sumber.

## Tahap V3

- AI research dengan sumber
- revisi naskah
- prompt visual otomatis
- voice-over
- subtitle
- thumbnail
- video composer
- Shorts otomatis
