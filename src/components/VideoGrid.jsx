import { extractYouTubeVideoId } from '../utils/videoUtils';

function VideoGrid({ videos, selectedVideoIndex, onVideoClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video, index) => {
        const videoId = extractYouTubeVideoId(video.youtubeUrl);
        const thumbnail = video.thumbnail || 
          `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

        return (
          <button
            key={video.id || index}
            onClick={() => onVideoClick(index)}
            className={`group text-left rounded-lg overflow-hidden border transition-all cursor-pointer ${
              selectedVideoIndex === index
                ? 'border-primary shadow-md ring-2 ring-primary ring-opacity-50'
                : 'border-line hover:border-primary shadow-sm hover:shadow-md'
            }`}
          >
            <div className="relative overflow-hidden bg-gray-100 aspect-video">
              <img
                src={thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
            <div className="p-4 bg-white">
              <h3 className="font-baloo font-bold text-text-main mb-1 line-clamp-2">
                {video.title}
              </h3>
              {video.description && (
                <p className="text-text-muted text-sm line-clamp-2 mb-2">
                  {video.description}
                </p>
              )}
              {video.tags && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {video.tags.slice(0, 2).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-chip-bg text-chip-text text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default VideoGrid;
