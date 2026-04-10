# Galeri Video YouTube React + Tailwind + Vite

Aplikasi galeri video YouTube yang responsif, dibangun dengan React 18, Tailwind CSS, dan Vite.

## 🚀 Teknologi

- **React 18** - Library UI
- **Vite** - Build tool dan dev server (sangat cepat)
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS & Autoprefixer** - CSS processing

## 📁 Struktur Project

```
tenggoo_learn_app/
├── src/
│   ├── components/          # React components
│   │   ├── Hero.jsx        # Hero section
│   │   ├── Gallery.jsx     # Main gallery view
│   │   ├── CollectionGrid.jsx  # Collection grid
│   │   ├── VideoGrid.jsx   # Video grid
│   │   └── VideoModal.jsx  # Video detail modal
│   ├── utils/
│   │   └── videoUtils.js   # Utilitas video
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point
│   └── index.css           # Tailwind styles
├── data/
│   └── videos.json         # Data video
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.js          # Vite config
├── tailwind.config.js      # Tailwind config
├── postcss.config.js       # PostCSS config
└── .gitignore
```

## 🛠️ Setup & Development

### Prerequisites

- Node.js 16+ dan npm/pnpm/yarn

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output akan ada di folder `dist/`

### Preview Production Build

```bash
npm run preview
```

## 📝 Data Format

File `data/videos.json` harus mengikuti format:

```json
{
  "schemaVersion": 2,
  "galleryTitle": "Judul Galeri",
  "galleryDescription": "Deskripsi galeri",
  "collections": [
    {
      "id": "collection-1",
      "title": "Nama Koleksi",
      "description": "Deskripsi koleksi",
      "cover": "https://...",
      "videos": [
        {
          "id": "video-1",
          "title": "Judul Video",
          "youtubeUrl": "https://youtube.com/watch?v=...",
          "thumbnail": "https://...",
          "description": "Deskripsi video",
          "tags": ["tag1", "tag2"]
        }
      ]
    }
  ]
}
```

## ✨ Features

- ✅ Grid koleksi video yang responsif
- ✅ Modal player video YouTube embedded
- ✅ URL state management (shareable links)
- ✅ Keyboard navigation (arrow keys, ESC)
- ✅ Validasi data yang robust
- ✅ Tailwind CSS styling
- ✅ Fast dev server dengan Vite

## 🎨 Customization

### Colors

Edit `tailwind.config.js` untuk mengubah palet warna:

```js
colors: {
  'primary': '#2f80ed',
  'text-main': '#1f2a44',
  // ... lebih banyak
}
```

### Fonts

Font menggunakan Baloo 2 dan Nunito dari Google Fonts. Edit di `src/index.css`

## 🚢 Deployment

### Static Hosting (Vercel, Netlify, GitHub Pages)

1. Build project: `npm run build`
2. Deploy folder `dist/` ke hosting platform

### CNAME (GitHub Pages)

Jika menggunakan GitHub Pages, buat file `CNAME` di folder `public/`:

```
yourdomain.com
```

## 📦 Build Size

Vite menghasilkan bundle yang optimal:

- Development bundle: ~500KB (dengan source maps)
- Production bundle: ~100KB+ gzipped (dengan tree-shaking)

## 🔧 Troubleshooting

### Port sudah digunakan

Ubah port di `vite.config.js`:

```js
server: {
  port: 3000; // Ganti port
}
```

### Tailwind styles tidak muncul

```bash
# Clear cache dan rebuild
rm -rf node_modules .vite dist
npm install
npm run dev
```

## 📄 License

MIT

---

**Happy coding! 🎉**
