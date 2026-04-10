# 🚀 Quick Start Guide - Vite + React + Tailwind

## Langkah Pertama

### 1️⃣ Start Development Server

```bash
npm run dev
```

Buka browser di: **http://localhost:5173**

### 2️⃣ Edit & Develop

- Component React ada di `src/components/`
- Styles Tailwind CSS di `src/` (otomatis)
- Main app logic di `src/App.jsx`

### 3️⃣ Build untuk Production

```bash
npm run build
```

Output ada di folder `dist/` siap di-deploy

---

## 📋 File-file Penting

| File                 | Fungsi                           |
| -------------------- | -------------------------------- |
| `src/App.jsx`        | Root component, main logic       |
| `src/main.jsx`       | Entry point React                |
| `src/index.css`      | Tailwind imports & global styles |
| `src/components/`    | Reusable React components        |
| `data/videos.json`   | Data koleksi video               |
| `tailwind.config.js` | Tailwind customization           |
| `vite.config.js`     | Vite configuration               |
| `package.json`       | Dependencies & scripts           |

---

## 🎨 Styling dengan Tailwind

Tailwind CSS sudah terintegrasi. Gunakan class utility langsung di JSX:

```jsx
<div className="bg-primary text-white rounded-lg p-4 shadow-md hover:shadow-lg">
  Konten
</div>
```

Custom colors sudah didefinisikan di `tailwind.config.js`:

- `bg-primary` → #2f80ed
- `text-main` → #1f2a44
- `text-muted` → #5f6d85
- dll...

---

## 🔄 Component Structure

```
App (main)
├── Hero (hero section)
├── Gallery (main view switcher)
│   ├── CollectionGrid (tampil koleksi)
│   └── VideoGrid (tampil video dalam koleksi)
└── VideoModal (detail video)
```

---

## 📊 Data JSON Format

File `data/videos.json`:

```json
{
  "galleryTitle": "Judul",
  "collections": [
    {
      "id": "unique-id",
      "title": "Nama Koleksi",
      "cover": "https://...",
      "videos": [
        {
          "id": "vid-1",
          "title": "Judul Video",
          "youtubeUrl": "https://youtube.com/watch?v=...",
          "description": "Deskripsi",
          "tags": ["tag1"]
        }
      ]
    }
  ]
}
```

---

## 🆘 Helpful Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Check dependencies size
npm ls

# Update dependencies
npm update

# Check outdated packages
npm outdated
```

---

## 📌 Tips

✅ Vite reloads SUPER FAST - gunakan browser DevTools untuk debug
✅ Tailwind CSS dirilis saat build, file production lebih kecil
✅ React components di-render otomatis saat ada perubahan file
✅ Gunakan Chrome DevTools untuk inspect component & styles

---

## 🎯 Next Steps

1. **Customize Koleksi** - Edit `data/videos.json`
2. **Tambah Component** - Buat file baru di `src/components/`
3. **Deploy** - Upload folder `dist/` ke hosting
4. **Learn More** - Baca README.md untuk info detail

Good luck! 🚀
