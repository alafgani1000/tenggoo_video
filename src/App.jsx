import { Fragment, useEffect, useMemo, useState } from "react";
import Hero from "./components/Hero";
import Gallery from "./components/Gallery";
import VideoModal from "./components/VideoModal";
import {
  isValidVideo,
  normalizeCollections,
  extractYouTubeVideoId,
  parseUrlState,
  writeUrlState,
} from "./utils/videoUtils";

const DATA_PATH = "./data/videos.json";

function App() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(-1);
  const [galleryTitle, setGalleryTitle] = useState("Koleksi Video YouTube");
  const [galleryDescription, setGalleryDescription] = useState("");

  useEffect(() => {
    const { collectionId, watchIndex } = parseUrlState();
    setSelectedCollectionId(collectionId);
    setSelectedVideoIndex(watchIndex);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(DATA_PATH);
        if (!response.ok) throw new Error("Gagal memuat data video");

        const payload = await response.json();
        const normalizedCollections = normalizeCollections(payload);

        if (!normalizedCollections.length) {
          throw new Error("Format data tidak valid atau tidak ada video");
        }

        setCollections(normalizedCollections);
        setGalleryTitle(payload.galleryTitle || "Koleksi Video YouTube");
        setGalleryDescription(
          payload.galleryDescription || "Jelajahi koleksi video kami",
        );

        const { collectionId } = parseUrlState();
        if (
          collectionId &&
          !normalizedCollections.find((c) => c.id === collectionId)
        ) {
          setSelectedCollectionId(normalizedCollections[0]?.id || "");
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const selectedCollection = useMemo(
    () => collections.find((c) => c.id === selectedCollectionId),
    [collections, selectedCollectionId],
  );

  const selectedVideo = useMemo(
    () =>
      selectedCollection && selectedVideoIndex >= 0
        ? selectedCollection.videos[selectedVideoIndex]
        : null,
    [selectedCollection, selectedVideoIndex],
  );

  const handleCollectionClick = (collectionId) => {
    setSelectedCollectionId(collectionId);
    setSelectedVideoIndex(-1);
    writeUrlState(collectionId, -1);
  };

  const handleVideoClick = (videoIndex) => {
    setSelectedVideoIndex(videoIndex);
    writeUrlState(selectedCollectionId, videoIndex);
  };

  const handleCloseModal = () => {
    setSelectedVideoIndex(-1);
    writeUrlState(selectedCollectionId, -1);
  };

  const handlePrev = () => {
    if (selectedCollection && selectedVideoIndex > 0) {
      const newIndex = selectedVideoIndex - 1;
      setSelectedVideoIndex(newIndex);
      writeUrlState(selectedCollectionId, newIndex);
    }
  };

  const handleNext = () => {
    if (
      selectedCollection &&
      selectedVideoIndex < selectedCollection.videos.length - 1
    ) {
      const newIndex = selectedVideoIndex + 1;
      setSelectedVideoIndex(newIndex);
      writeUrlState(selectedCollectionId, newIndex);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-muted text-lg">Memuat data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <Fragment>
      <Hero title={galleryTitle} description={galleryDescription} />
      <Gallery
        collections={collections}
        selectedCollectionId={selectedCollectionId}
        selectedVideoIndex={selectedVideoIndex}
        onCollectionClick={handleCollectionClick}
        onVideoClick={handleVideoClick}
      />
      {selectedVideo && selectedCollection && (
        <VideoModal
          video={selectedVideo}
          collection={selectedCollection}
          videoIndex={selectedVideoIndex}
          totalVideos={selectedCollection.videos.length}
          onClose={handleCloseModal}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </Fragment>
  );
}

export default App;
