import { useEffect } from 'react';
import { extractYouTubeVideoId } from '../utils/videoUtils';

function VideoModal({
  video,
  collection,
  videoIndex,
  totalVideos,
  onClose,
  onPrev,
  onNext,
}) {
  const videoId = extractYouTubeVideoId(video.youtubeUrl);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.classList.add('modal-open');

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-open');
    };
  }, [onClose, onPrev, onNext]);

  if (!videoId) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md text-center">
          <p className="text-text-main mb-4">URL YouTube tidak valid</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-strong transition"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }

  const canGoPrev = videoIndex > 0;
  const canGoNext = videoIndex < totalVideos - 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-lg overflow-auto max-w-4xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-line p-4 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-text-muted mb-1">
              Video {videoIndex + 1} dari {totalVideos}
            </p>
            <h2 className="font-baloo font-bold text-xl text-text-main">
              {video.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-text-muted hover:text-text-main transition"
            aria-label="Tutup"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* YouTube Embed */}
          <div className="aspect-video mb-6 rounded-lg overflow-hidden bg-black">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ border: 'none' }}
            />
          </div>

          {/* Video Info */}
          {video.description && (
            <div className="mb-6">
              <h3 className="font-semibold text-text-main mb-2">Deskripsi</h3>
              <p className="text-text-muted leading-relaxed">{video.description}</p>
            </div>
          )}

          {/* Tags */}
          {video.tags && video.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-text-main mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-chip-bg text-chip-text text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Collection Info */}
          <div className="mb-6 p-4 bg-bg-soft-alt rounded-lg border border-line">
            <p className="text-sm text-text-muted mb-1">Dari Koleksi</p>
            <p className="font-semibold text-text-main">{collection.title}</p>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={onPrev}
              disabled={!canGoPrev}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                canGoPrev
                  ? 'bg-primary text-white hover:bg-primary-strong'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              ← Sebelumnya
            </button>
            <button
              onClick={onNext}
              disabled={!canGoNext}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                canGoNext
                  ? 'bg-primary text-white hover:bg-primary-strong'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Berikutnya →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoModal;
