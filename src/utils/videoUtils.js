export function isValidVideo(video) {
  if (!video || typeof video !== "object") return false;
  if (typeof video.youtubeUrl !== "string" || !video.youtubeUrl.trim()) return false;
  return true;
}

export function normalizeCollection(collection, idx) {
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

export function normalizeCollections(payload) {
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

export function extractYouTubeVideoId(url) {
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

export function parseUrlState() {
  const params = new URLSearchParams(window.location.search);
  const collectionId = params.get("collection") || "";
  const watchValue = params.get("watch");
  const watchIndex = watchValue !== null ? Number(watchValue) : -1;

  return {
    collectionId,
    watchIndex: Number.isInteger(watchIndex) && watchIndex >= 0 ? watchIndex : -1,
  };
}

export function writeUrlState(collectionId, watchIndex) {
  const params = new URLSearchParams();

  if (collectionId) {
    params.set("collection", collectionId);
  }

  if (watchIndex >= 0) {
    params.set("watch", String(watchIndex));
  }

  const newUrl =
    watchIndex >= 0 && collectionId
      ? `?${params.toString()}`
      : collectionId
      ? `?collection=${encodeURIComponent(collectionId)}`
      : window.location.pathname;

  window.history.replaceState(null, "", newUrl);
}
