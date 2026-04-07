const DATA_PATH = "./data/videos.json";
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
const watchModalEl = document.getElementById("watchModal");
const watchBackdropEl = document.getElementById("watchBackdrop");
const watchTitleEl = document.getElementById("watchTitle");
const watchHintEl = document.getElementById("watchHint");
const watchEmbedStatusEl = document.getElementById("watchEmbedStatus");
const watchEmbedSlotEl = document.getElementById("watchEmbedSlot");
const btnPrevVideoEl = document.getElementById("btnPrevVideo");
const btnNextVideoEl = document.getElementById("btnNextVideo");
const btnCloseModalEl = document.getElementById("btnCloseModal");

const collectionTemplateEl = document.getElementById("collectionCardTemplate");
const videoTemplateEl = document.getElementById("videoCardTemplate");

let collectionsState = [];
let currentVideosState = [];
let currentWatchIndex = -1;
let lastTriggerButton = null;

function canToggleMainSections() {
  if (collectionsSectionEl && videosSectionEl) return true;
  console.error(
    "Elemen section utama tidak ditemukan. Pastikan id `collectionsSection` dan `videosSection` ada di HTML."
  );
  return false;
}

btnBackEl.addEventListener("click", () => {
  if (!canToggleMainSections()) return;
  videosSectionEl.hidden = true;
  collectionsSectionEl.hidden = false;
  collectionTitleEl.textContent = "";
  collectionMetaEl.textContent = "";
  videoGridEl.innerHTML = "";
  closeWatchModal();
  currentVideosState = [];
  currentWatchIndex = -1;
  breadcrumbEl.textContent = "Beranda / Koleksi";
  statusEl.textContent = "Pilih cover koleksi untuk melihat video.";
});

btnPrevVideoEl.addEventListener("click", () => {
  if (currentWatchIndex <= 0) return;
  void openWatchByIndex(currentWatchIndex - 1);
});

btnNextVideoEl.addEventListener("click", () => {
  if (currentWatchIndex >= currentVideosState.length - 1) return;
  void openWatchByIndex(currentWatchIndex + 1);
});

btnCloseModalEl.addEventListener("click", () => {
  closeWatchModal();
});

watchBackdropEl.addEventListener("click", () => {
  closeWatchModal();
});

document.addEventListener("keydown", (event) => {
  if (watchModalEl.hidden) return;

  if (event.key === "Escape") {
    closeWatchModal();
    return;
  }

  if (event.key === "ArrowLeft" && currentWatchIndex > 0) {
    event.preventDefault();
    void openWatchByIndex(currentWatchIndex - 1);
    return;
  }

  if (event.key === "ArrowRight" && currentWatchIndex < currentVideosState.length - 1) {
    event.preventDefault();
    void openWatchByIndex(currentWatchIndex + 1);
  }
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
  if (!canToggleMainSections()) return;

  collectionsSectionEl.hidden = true;
  videosSectionEl.hidden = false;
  collectionTitleEl.textContent = selected.title;
  collectionMetaEl.textContent = `${selected.videos.length} video dalam koleksi ini`;
  breadcrumbEl.textContent = `Beranda / Koleksi / ${selected.title}`;
  closeWatchModal();
  currentWatchIndex = -1;
  renderVideos(selected.videos);
  currentVideosState = selected.videos;

  statusEl.textContent = `${selected.videos.length} video ditampilkan`;
  videosSectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderVideos(videos) {
  const fragment = document.createDocumentFragment();

  videos.forEach((video, index) => {
    const card = videoTemplateEl.content.firstElementChild.cloneNode(true);

    const thumb = card.querySelector(".card__thumb");
    const thumbPlaceholder = card.querySelector(".card__thumb-placeholder");
    const title = card.querySelector(".card__title");
    const desc = card.querySelector(".card__desc");
    const tags = card.querySelector(".tag-list");
    const btnEmbed = card.querySelector(".btn--primary");
    const btnOpen = card.querySelector(".btn--ghost");

    title.textContent = video.title || "Tanpa Judul";
    desc.textContent = video.description || "Tanpa deskripsi.";
    btnOpen.href = video.tiktokUrl;
    card.setAttribute("data-video-index", String(index));

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
      currentVideosState = videos;
      lastTriggerButton = btnEmbed;
      await openWatchByIndex(index);
    });

    fragment.appendChild(card);
  });

  videoGridEl.innerHTML = "";
  videoGridEl.appendChild(fragment);
}

async function openWatchByIndex(index) {
  const video = currentVideosState[index];
  if (!video) return;

  currentWatchIndex = index;
  watchModalEl.hidden = false;
  document.body.classList.add("modal-open");
  watchTitleEl.textContent = video.title || "Tanpa Judul";
  watchHintEl.textContent = `Video ${index + 1} dari ${currentVideosState.length}`;
  watchEmbedStatusEl.textContent = "Memuat player TikTok...";
  watchEmbedSlotEl.innerHTML = "";
  statusEl.textContent = `Sedang menonton: ${watchTitleEl.textContent}`;

  updateWatchNavButtons();
  updateActiveVideoCard(index);
  btnCloseModalEl.focus({ preventScroll: true });

  try {
    watchEmbedSlotEl.innerHTML = buildTikTokEmbedHtml(video.tiktokUrl);
    watchEmbedStatusEl.textContent = "Video siap ditonton.";
  } catch (error) {
    console.error(error);
    watchEmbedStatusEl.textContent = `Gagal memuat embed: ${error.message}`;
  }
}

function closeWatchModal() {
  watchModalEl.hidden = true;
  watchEmbedSlotEl.innerHTML = "";
  watchEmbedStatusEl.textContent = "Memuat video...";
  document.body.classList.remove("modal-open");
  if (lastTriggerButton && typeof lastTriggerButton.focus === "function") {
    lastTriggerButton.focus({ preventScroll: true });
  }
}

function updateWatchNavButtons() {
  btnPrevVideoEl.disabled = currentWatchIndex <= 0;
  btnNextVideoEl.disabled = currentWatchIndex >= currentVideosState.length - 1;
}

function updateActiveVideoCard(activeIndex) {
  const cards = videoGridEl.querySelectorAll(".card");
  cards.forEach((card) => {
    const cardIndex = Number(card.getAttribute("data-video-index"));
    const isActive = cardIndex === activeIndex;
    card.classList.toggle("card--active", isActive);
  });
}

function buildTikTokEmbedHtml(url) {
  if (typeof url !== "string" || !url.trim()) {
    throw new Error("URL TikTok tidak valid.");
  }

  const safeUrl = url.trim();
  const videoId = extractTikTokVideoId(safeUrl);
  if (!videoId) {
    throw new Error("Format URL TikTok tidak valid. Gunakan URL .../video/{id}.");
  }

  return `<iframe
    src="https://www.tiktok.com/embed/v2/${videoId}?lang=en-US"
    title="TikTok Video ${videoId}"
    class="tiktok-iframe"
    loading="lazy"
    allowfullscreen
    referrerpolicy="strict-origin-when-cross-origin"
  ></iframe>`;
}

function extractTikTokVideoId(url) {
  const match = url.match(/\/video\/(\d+)/i);
  if (!match) return "";
  return match[1];
}
