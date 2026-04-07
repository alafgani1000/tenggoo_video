# TikTok Embed Gallery (GitHub Pages)

Aplikasi statis untuk menampilkan koleksi cover, lalu daftar video TikTok per koleksi. Embed video dilakukan per item menggunakan TikTok embed player langsung.

## Struktur

- `index.html` : layout utama
- `styles.css` : styling responsif
- `app.js` : load JSON, render cover koleksi, render video, dan render TikTok embed player langsung
- `data/videos.json` : sumber data galeri

## Format JSON (disarankan)

```json
{
  "schemaVersion": 2,
  "galleryTitle": "Koleksi Video TikTok Favorit",
  "galleryDescription": "Klik cover koleksi untuk membuka kumpulan video.",
  "collections": [
    {
      "id": "coffee",
      "title": "Koleksi Kopi",
      "description": "Tips dan resep minuman kopi.",
      "cover": "https://example.com/cover.jpg",
      "videos": [
        {
          "id": "vid1",
          "title": "Judul Video",
          "tiktokUrl": "https://www.tiktok.com/@user/video/123...",
          "thumbnail": "https://...",
          "description": "Deskripsi",
          "tags": ["tag1", "tag2"]
        }
      ]
    }
  ]
}
```

## Kompatibilitas format lama

Jika JSON masih memakai format lama (`videos` langsung di root), aplikasi akan otomatis membuat 1 koleksi bernama `Semua Video`.

## Jalankan lokal

Gunakan local server (karena `fetch` JSON tidak berjalan jika langsung buka file HTML):

```bash
npx serve .
```

## Deploy GitHub Pages

1. Push repo ke GitHub.
2. Buka `Settings` -> `Pages`.
3. Pada `Build and deployment`, pilih `Source: Deploy from a branch`.
4. Pilih branch (mis. `main`) dan folder `/ (root)`.
5. Simpan, lalu akses URL Pages.

## Catatan

- URL TikTok pada contoh adalah dummy; ganti dengan URL video yang valid.
- Jika embed gagal (video privat/URL invalid), tombol "Buka di TikTok" tetap bisa dipakai.
