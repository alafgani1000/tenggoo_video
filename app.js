const { Fragment, useEffect, useMemo, useState } = React;

const DATA_PATH = "./data/videos.json";

function isValidVideo(video) {
  if (!video || typeof video !== "object") return false;
  if (typeof video.youtubeUrl !== "string" || !video.youtubeUrl.trim()) return false;
  return true;
}

function normalizeCollection(collection, idx) {
  if (!collection || typeof collection !== "object") return null;

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

function normalizeCollections(payload) {
  if (!payload || typeof payload !== "object") return [];

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

function extractYouTubeVideoId(url) {
  const safeUrl = typeof url === "string" ? url.trim() : "";
  if (!safeUrl) return "";

  try {
    const parsed = new URL(safeUrl);
    const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0] || "";
      return /^[\w-]{11}$/.test(id) ? id : "";
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v") || "";
        return /^[\w-]{11}$/.test(id) ? id : "";
      }

      const parts = parsed.pathname.split("/").filter(Boolean);
      const candidate =
        parts[0] === "embed" || parts[0] === "shorts" ? parts[1] || "" : "";

      return /^[\w-]{11}$/.test(candidate) ? candidate : "";
    }
  } catch (error) {
    return "";
  }

  return "";
}

function parseUrlState() {
  const params = new URLSearchParams(window.location.search);
  const collectionId = params.get("collection") || "";
  const watchValue = params.get("watch");
  const watchIndex = watchValue !== null ? Number(watchValue) : -1;

  return {
    collectionId,
    watchIndex: Number.isInteger(watchIndex) && watchIndex >= 0 ? watchIndex : -1,
  };
}

function writeUrlState(collectionId, watchIndex) {
  const url = new URL(window.location.href);

  if (collectionId) {
    url.searchParams.set("collection", collectionId);
  } else {
    url.searchParams.delete("collection");
  }

  if (Number.isInteger(watchIndex) && watchIndex >= 0) {
    url.searchParams.set("watch", String(watchIndex));
  } else {
    url.searchParams.delete("watch");
  }

  window.history.replaceState(null, "", url);
}

function CollectionCard({ collection, onOpen }) {
  const [coverError, setCoverError] = useState(false);
  const showCover = Boolean(collection.cover) && !coverError;

  return (
    <article className="card card--collection">
      <button className="collection-cover" type="button" onClick={() => onOpen(collection.id)}>
        {showCover ? (
          <img
            className="collection-cover__img"
            src={collection.cover}
            alt={`Cover koleksi ${collection.title}`}
            loading="lazy"
            data-active="true"
            onError={() => setCoverError(true)}
          />
        ) : null}
        <span className="collection-cover__placeholder" hidden={showCover}>Tanpa cover</span>
        <span className="collection-cover__overlay">Lihat Video</span>
      </button>
      <div className="card__body">
        <h3 className="card__title">{collection.title}</h3>
        <p className="card__desc">{collection.description || "Tidak ada deskripsi koleksi."}</p>
        <p className="card__meta">{collection.videos.length} video</p>
      </div>
    </article>
  );
}

function VideoCard({ video, index, isActive, onWatch }) {
  const [thumbError, setThumbError] = useState(false);
  const thumbnail = typeof video.thumbnail === "string" ? video.thumbnail.trim() : "";
  const showThumb = Boolean(thumbnail) && !thumbError;

  return (
    <article className={`card ${isActive ? "card--active" : ""}`.trim()}>
      <div className="card__thumb-wrap">
        {showThumb ? (
          <img
            className="card__thumb"
            src={thumbnail}
            alt={`Thumbnail video ${video.title || "YouTube"}`}
            loading="lazy"
            data-active="true"
            onError={() => setThumbError(true)}
          />
        ) : null}
        <span className="card__thumb-placeholder" hidden={showThumb}>Tanpa thumbnail</span>
      </div>

      <div className="card__body">
        <h3 className="card__title">{video.title || "Tanpa Judul"}</h3>
        <p className="card__desc">{video.description || "Tanpa deskripsi."}</p>
        <ul className="tag-list" aria-label="Tag video">
          {(video.tags || []).map((tag, idx) => (
            <li key={`${video.id || video.youtubeUrl || index}-${idx}`}>{String(tag)}</li>
          ))}
        </ul>

        <div className="card__actions">
          <button className="btn btn--primary" type="button" onClick={() => onWatch(index)}>
            Tonton di sini
          </button>
          <a className="btn btn--ghost" href={video.youtubeUrl} target="_blank" rel="noopener noreferrer">
            Buka di YouTube
          </a>
        </div>
      </div>
    </article>
  );
}

function App() {
  const [galleryTitle, setGalleryTitle] = useState("Memuat koleksi...");
  const [galleryDescription, setGalleryDescription] = useState(
    "Pilih cover koleksi untuk melihat kumpulan video YouTube."
  );
  const [collections, setCollections] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [watchIndex, setWatchIndex] = useState(-1);
  const [loadError, setLoadError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const selectedCollection = useMemo(
    () => collections.find((item) => item.id === selectedCollectionId) || null,
    [collections, selectedCollectionId]
  );

  const currentVideos = selectedCollection ? selectedCollection.videos : [];
  const currentVideo = watchIndex >= 0 ? currentVideos[watchIndex] : null;

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const response = await fetch(DATA_PATH, { cache: "no-store" });
        if (!response.ok) throw new Error(`Gagal fetch JSON (${response.status})`);

        const payload = await response.json();
        const nextCollections = normalizeCollections(payload);

        if (cancelled) return;

        setGalleryTitle(payload.galleryTitle || "Galeri Video YouTube");
        setGalleryDescription(
          payload.galleryDescription || "Pilih cover koleksi untuk melihat kumpulan video YouTube."
        );
        setCollections(nextCollections);

        const fromUrl = parseUrlState();
        const found = nextCollections.find((item) => item.id === fromUrl.collectionId);
        if (found) {
          setSelectedCollectionId(found.id);
          if (fromUrl.watchIndex >= 0 && fromUrl.watchIndex < found.videos.length) {
            setWatchIndex(fromUrl.watchIndex);
          }
        }

        setIsLoaded(true);
      } catch (error) {
        if (cancelled) return;
        console.error(error);
        setLoadError("Gagal memuat data. Pastikan file JSON ada dan formatnya valid.");
        setIsLoaded(true);
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    writeUrlState(selectedCollectionId, watchIndex);
  }, [isLoaded, selectedCollectionId, watchIndex]);

  useEffect(() => {
    function handlePopState() {
      const state = parseUrlState();
      const found = collections.find((item) => item.id === state.collectionId);
      if (!found) {
        setSelectedCollectionId("");
        setWatchIndex(-1);
        return;
      }

      setSelectedCollectionId(found.id);
      if (state.watchIndex >= 0 && state.watchIndex < found.videos.length) {
        setWatchIndex(state.watchIndex);
      } else {
        setWatchIndex(-1);
      }
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [collections]);

  useEffect(() => {
    if (!currentVideo) {
      document.body.classList.remove("modal-open");
      return;
    }

    document.body.classList.add("modal-open");

    function onKeyDown(event) {
      if (event.key === "Escape") {
        setWatchIndex(-1);
        return;
      }

      if (event.key === "ArrowLeft") {
        setWatchIndex((prev) => (prev > 0 ? prev - 1 : prev));
        return;
      }

      if (event.key === "ArrowRight") {
        setWatchIndex((prev) => (prev < currentVideos.length - 1 ? prev + 1 : prev));
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [currentVideo, currentVideos.length]);

  const breadcrumb = selectedCollection
    ? `Beranda / Koleksi / ${selectedCollection.title}`
    : "Beranda / Koleksi";

  let status = "Memuat data video...";
  if (loadError) {
    status = loadError;
  } else if (currentVideo) {
    status = `Sedang menonton: ${currentVideo.title || "Tanpa Judul"}`;
  } else if (selectedCollection) {
    status = `${selectedCollection.videos.length} video ditampilkan`;
  } else if (isLoaded) {
    status = collections.length
      ? `${collections.length} koleksi tersedia`
      : "Belum ada koleksi pada data JSON.";
  }

  function openCollection(collectionId) {
    setSelectedCollectionId(collectionId);
    setWatchIndex(-1);
  }

  function backToCollections() {
    setSelectedCollectionId("");
    setWatchIndex(-1);
  }

  function openWatchByIndex(index) {
    if (index < 0 || index >= currentVideos.length) return;
    setWatchIndex(index);
  }

  const videoId = currentVideo ? extractYouTubeVideoId(currentVideo.youtubeUrl) : "";

  return (
    <Fragment>
      <header className="hero">
        <div className="hero__content">
          <p className="hero__eyebrow">YouTube Embed Gallery</p>
          <h1>{galleryTitle}</h1>
          <p>{galleryDescription}</p>
        </div>
      </header>

      <main className="container" id="app" aria-live="polite">
        <section className="topbar">
          <p className="breadcrumb">{breadcrumb}</p>
          <section className="status" role="status">{status}</section>
        </section>

        {!selectedCollection ? (
          <section>
            <h2 className="section-title">Koleksi</h2>
            <section className="collection-grid" aria-label="Daftar koleksi">
              {collections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} onOpen={openCollection} />
              ))}
            </section>
          </section>
        ) : (
          <section>
            <div className="videos-header">
              <button className="btn btn--ghost" type="button" onClick={backToCollections}>
                Kembali ke Koleksi
              </button>
              <div>
                <h2 className="section-title">{selectedCollection.title}</h2>
                <p className="collection-meta">
                  {selectedCollection.videos.length} video dalam koleksi ini
                </p>
              </div>
            </div>
            <section className="video-grid" aria-label="Daftar video">
              {currentVideos.map((video, index) => (
                <VideoCard
                  key={`${video.id || video.youtubeUrl || "video"}-${index}`}
                  video={video}
                  index={index}
                  isActive={watchIndex === index}
                  onWatch={openWatchByIndex}
                />
              ))}
            </section>
          </section>
        )}
      </main>

      {currentVideo ? (
        <section className="watch-modal">
          <div className="watch-modal__backdrop" onClick={() => setWatchIndex(-1)}></div>
          <div
            className="watch-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="watchTitle"
          >
            <div className="watch-modal__header">
              <div>
                <p className="watch-modal__eyebrow">Sedang Ditonton</p>
                <h3 id="watchTitle" className="watch-modal__title">
                  {currentVideo.title || "Tanpa Judul"}
                </h3>
                <p className="watch-modal__hint">
                  Video {watchIndex + 1} dari {currentVideos.length}
                </p>
              </div>
              <button
                className="btn btn--ghost watch-modal__close"
                type="button"
                aria-label="Tutup modal"
                onClick={() => setWatchIndex(-1)}
              >
                Tutup X
              </button>
            </div>
            <p className="watch-modal__shortcut">
              Shortcut: tombol Esc untuk tutup, panah kiri dan panah kanan untuk pindah video.
            </p>
            <div className="watch-modal__status">
              {videoId ? "Video siap ditonton." : "Gagal memuat embed: URL YouTube tidak valid."}
            </div>
            <div className="watch-modal__embed">
              {videoId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`}
                  title={`YouTube Video ${videoId}`}
                  className="youtube-iframe"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
              ) : null}
            </div>
            <div className="watch-modal__footer">
              <button
                className="btn btn--ghost"
                type="button"
                disabled={watchIndex <= 0}
                onClick={() => setWatchIndex((prev) => (prev > 0 ? prev - 1 : prev))}
              >
                Sebelumnya
              </button>
              <button
                className="btn btn--ghost"
                type="button"
                disabled={watchIndex >= currentVideos.length - 1}
                onClick={() =>
                  setWatchIndex((prev) =>
                    prev < currentVideos.length - 1 ? prev + 1 : prev
                  )
                }
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
