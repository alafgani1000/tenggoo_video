function CollectionGrid({ collections, onCollectionClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((collection) => (
        <button
          key={collection.id}
          onClick={() => onCollectionClick(collection.id)}
          className="group text-left bg-white rounded-lg overflow-hidden border border-line hover:border-primary shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          {collection.cover && (
            <div className="relative overflow-hidden bg-gray-100 aspect-video">
              <img
                src={collection.cover}
                alt={collection.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
            </div>
          )}
          <div className="p-4">
            <h3 className="font-baloo font-bold text-lg text-text-main mb-1">
              {collection.title}
            </h3>
            {collection.description && (
              <p className="text-text-muted text-sm line-clamp-2">
                {collection.description}
              </p>
            )}
            <div className="mt-3 text-primary text-sm font-semibold">
              {collection.videos.length} video
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default CollectionGrid;
