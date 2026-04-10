import CollectionGrid from "./CollectionGrid";
import VideoGrid from "./VideoGrid";

function Gallery({
  collections,
  selectedCollectionId,
  selectedVideoIndex,
  onCollectionClick,
  onVideoClick,
}) {
  const selectedCollection = collections.find(
    (c) => c.id === selectedCollectionId,
  );

  const hasCollection =
    selectedCollection && selectedCollection.videos.length > 0;

  return (
    <main className="max-w-4xl mx-auto px-4.5 pb-9">
      {!selectedCollectionId ? (
        <CollectionGrid
          collections={collections}
          onCollectionClick={onCollectionClick}
        />
      ) : hasCollection ? (
        <>
          <nav className="flex flex-wrap gap-2.5 items-center justify-between mb-3.5">
            <p className="m-0 text-sm font-semibold text-text-main">
              Kembali ke{" "}
              <button
                onClick={() => onCollectionClick("")}
                className="text-primary hover:text-primary-strong underline cursor-pointer bg-none border-none p-0"
              >
                semua koleksi
              </button>
            </p>
          </nav>
          <h2 className="text-2xl sm:text-3xl font-baloo font-bold text-text-main mb-2">
            {selectedCollection.title}
          </h2>
          {selectedCollection.description && (
            <p className="text-text-muted mb-6">
              {selectedCollection.description}
            </p>
          )}
          <VideoGrid
            videos={selectedCollection.videos}
            selectedVideoIndex={selectedVideoIndex}
            onVideoClick={onVideoClick}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-text-muted">Tidak ada video dalam koleksi ini</p>
          <button
            onClick={() => onCollectionClick("")}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-strong transition"
          >
            Kembali
          </button>
        </div>
      )}
    </main>
  );
}

export default Gallery;
