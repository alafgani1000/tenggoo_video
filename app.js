const DATA_PATH = "./data/videos.json";
const OEMBED_ENDPOINT = "https://www.tiktok.com/oembed";

const titleEl = document.getElementById("galleryTitle");
const galleryDescriptionEl = document.getElementById("galleryDescription");
const breadcrumbEl = document.getElementById("breadcrumb");
const statusEl = document.getElementById("status");

const collectionsSectionEl = document.getElementById("collectionsSection");
const collectionGridEl = document.getElementById("collectionGrid");
const videosSectionEl = document.getElementById("videosSection");
const collectionTitleEl = document.getElementById("collectionTitle");
const collectionMetaEl = document.getElementById("collectionMeta");
const btnBackEl = document.getElementById("btnBack");
const videoGridEl = document.getElementById("videoGrid");

const collectionTemplateEl = document.getElementById("collectionCardTemplate");
const videoTemplateEl = document.getElementById("videoCardTemplate");

let collectionsState = [];

btnBackEl.addEventListener("click", () => {
  videosSectionEl.hidden = true;
  collectionsSectionEl.hidden = false;
  collectionTitleEl.textContent = "";
  collectionMetaEl.textContent = "";
  videoGridEl.innerHTML = "";
  breadcrumbEl.textContent = "Beranda / Koleksi";
  statusEl.textContent = "Pilih cover koleksi untuk melihat video.";
});

void init();

async function init() {
  try {
    const payload = await loadJson(DATA_PATH);
    const collections = normalizeCollections(payload);
    collectionsState = collections;

    titleEl.textContent = payload.galleryTitle || "Galeri Video TikTok";
    galleryDescriptionEl.textContent =
      payload.galleryDescription ||
      "Pilih cover koleksi untuk melihat kumpulan video TikTok.";

    if (!collections.length) {
      statusEl.textContent = "Belum ada koleksi pada data JSON.";
      return;
    }

    renderCollections(collections);
    statusEl.textContent = `${collections.length} koleksi tersedia`;
  } catch (error) {
    console.error(error);
    statusEl.textContent =
      "Gagal memuat data. Pastikan file JSON ada dan formatnya valid.";
  }
}

async function loadJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Gagal fetch JSON (${response.status})`);
  }
  return response.json();
}

function normalizeCollections(payload) {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  if (Array.isArray(payload.collections)) {
    return payload.collections
      .map((collection, idx) => normalizeCollection(collection, idx))
      .filter(Boolean);
  }

  if (Array.isArray(payload.videos)) {
    const legacyVideos = payload.videos.filter(isValidVideo);
    if (!legacyVideos.length) return [];

    return [
      {
        id: "all-videos",
        title: "Semua Video",
        description: "Koleksi dari format JSON lama.",
        cover: "",
        videos: legacyVideos,
      },
    ];
  }

  return [];
}

function normalizeCollection(collection, idx) {
  if (!collection || typeof collection !== "object") {
    return null;
  }

  const videos = Array.isArray(collection.videos)
    ? collection.videos.filter(isValidVideo)
    : [];

  if (!videos.length) return null;

  return {
    id: collection.id || `collection-${idx + 1}`,
    title: collection.title || `Koleksi ${idx + 1}`,
    description: collection.description || "",
    cover: typeof collection.cover === "string" ? collection.cover.trim() : "",
    videos,
  };
}

function isValidVideo(video) {
  if (!video || typeof video !== "object") return false;
  if (typeof video.tiktokUrl !== "string" || !video.tiktokUrl.trim()) return false;
  return true;
}

function renderCollections(collections) {
  const fragment = document.createDocumentFragment();

  collections.forEach((collection) => {
    const card = collectionTemplateEl.content.firstElementChild.cloneNode(true);
    const coverBtn = card.querySelector(".collection-cover");
    const coverImg = card.querySelector(".collection-cover__img");
    const coverPlaceholder = card.querySelector(".collection-cover__placeholder");
    const titleEl = card.querySelector(".card__title");
    const descEl = card.querySelector(".card__desc");
    const metaEl = card.querySelector(".card__meta");

    titleEl.textContent = collection.title;
    descEl.textContent = collection.description || "Tidak ada deskripsi koleksi.";
    metaEl.textContent = `${collection.videos.length} video`;

    if (collection.cover) {
      coverImg.src = collection.cover;
      coverImg.alt = `Cover koleksi ${collection.title}`;
      coverImg.setAttribute("data-active", "true");
      coverPlaceholder.hidden = true;
      coverImg.onerror = () => {
        coverImg.removeAttribute("data-active");
        coverPlaceholder.hidden = false;
      };
    }

    coverBtn.addEventListener("click", () => openCollection(collection.id));
    fragment.appendChild(card);
  });

  collectionGridEl.innerHTML = "";
  collectionGridEl.appendChild(fragment);
}

function openCollection(collectionId) {
  const selected = collectionsState.find((item) => item.id === collectionId);
  if (!selected) return;

  collectionsSectionEl.hidden = true;
  videosSectionEl.hidden = false;
  collectionTitleEl.textContent = selected.title;
  collectionMetaEl.textContent = `${selected.videos.length} video dalam koleksi ini`;
  breadcrumbEl.textContent = `Beranda / Koleksi / ${selected.title}`;
  renderVideos(selected.videos);

  statusEl.textContent = `${selected.videos.length} video ditampilkan`;
  videosSectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderVideos(videos) {
  const fragment = document.createDocumentFragment();

  videos.forEach((video) => {
    const card = videoTemplateEl.content.firstElementChild.cloneNode(true);

    const thumb = card.querySelector(".card__thumb");
    const thumbPlaceholder = card.querySelector(".card__thumb-placeholder");
    const title = card.querySelector(".card__title");
    const desc = card.querySelector(".card__desc");
    const tags = card.querySelector(".tag-list");
    const btnEmbed = card.querySelector(".btn--primary");
    const btnOpen = card.querySelector(".btn--ghost");
    const embedArea = card.querySelector(".embed-area");
    const embedStatus = card.querySelector(".embed-status");
    const embedSlot = card.querySelector(".embed-slot");

    title.textContent = video.title || "Tanpa Judul";
    desc.textContent = video.description || "Tanpa deskripsi.";
    btnOpen.href = video.tiktokUrl;

    const thumbnail = typeof video.thumbnail === "string" ? video.thumbnail.trim() : "";
    if (thumbnail) {
      thumb.src = thumbnail;
      thumb.alt = `Thumbnail video ${video.title || "TikTok"}`;
      thumb.setAttribute("data-active", "true");
      thumbPlaceholder.hidden = true;
      thumb.onerror = () => {
        thumb.removeAttribute("data-active");
        thumbPlaceholder.hidden = false;
      };
    }

    (video.tags || []).forEach((tag) => {
      const li = document.createElement("li");
      li.textContent = String(tag);
      tags.appendChild(li);
    });

    btnEmbed.addEventListener("click", async () => {
      if (!embedArea.hidden) {
        embedArea.hidden = true;
        btnEmbed.textContent = "Tonton di halaman ini";
        return;
      }

      embedArea.hidden = false;
      btnEmbed.textContent = "Sembunyikan embed";

      if (embedSlot.innerHTML.trim()) {
        return;
      }

      embedStatus.textContent = "Memuat embed dari TikTok oEmbed API...";

      try {
        const html = await fetchOEmbedHtml(video.tiktokUrl);
        embedSlot.innerHTML = html;
        loadTikTokEmbedScript();
        embedStatus.textContent = "Embed berhasil dimuat.";
      } catch (error) {
        console.error(error);
        embedStatus.textContent =
          "Gagal memuat embed. Gunakan tombol 'Buka di TikTok'.";
      }
    });

    fragment.appendChild(card);
  });

  videoGridEl.innerHTML = "";
  videoGridEl.appendChild(fragment);
}

async function fetchOEmbedHtml(url) {
  const requestUrl = `${OEMBED_ENDPOINT}?url=${encodeURIComponent(url)}`;
  const response = await fetch(requestUrl);

  if (!response.ok) {
    throw new Error(`oEmbed error (${response.status})`);
  }

  const data = await response.json();
  if (!data || typeof data.html !== "string" || !data.html.trim()) {
    throw new Error("Respons oEmbed tidak berisi HTML embed.");
  }

  return data.html;
}

function loadTikTokEmbedScript() {
  const existing = document.querySelector('script[data-tiktok-embed="true"]');
  if (existing) {
    if (window.tiktokEmbedLoad) {
      window.tiktokEmbedLoad();
    }
    return;
  }

  const script = document.createElement("script");
  script.src = "https://www.tiktok.com/embed.js";
  script.async = true;
  script.setAttribute("data-tiktok-embed", "true");
  document.body.appendChild(script);
}
