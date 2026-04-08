# YouTube Embed Gallery (GitHub Pages)

Aplikasi statis untuk menampilkan koleksi cover, lalu daftar video YouTube per koleksi. Embed video dilakukan per item menggunakan YouTube embed player langsung.

## Struktur

- `index.html` : layout utama
- `styles.css` : styling responsif
- `app.js` : logic React JS untuk load JSON, render cover koleksi, render video, dan render YouTube embed player
- `data/videos.json` : sumber data galeri

## Format JSON (disarankan)

```json
{
  "schemaVersion": 2,
  "galleryTitle": "Koleksi Video YouTube Favorit",
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
          "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
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

- URL YouTube pada contoh adalah dummy; ganti dengan URL video yang valid.
- Jika embed gagal (video privat/URL invalid), tombol "Buka di YouTube" tetap bisa dipakai.
