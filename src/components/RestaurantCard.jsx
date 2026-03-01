import { Link } from "react-router-dom";

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map((s) => (
      <svg key={s} className={`w-3.5 h-3.5 ${s <= rating ? "star-filled" : "star-empty"}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg>
    ))}
  </div>
);

const RestaurantCard = ({ restaurant }) => {
  const avgRating = restaurant.avgRating || restaurant.averageRating || 0;
  const reviewCount = restaurant.reviewCount || restaurant.totalReviews || 0;
  const cuisineLabel = restaurant.cuisine || restaurant.category || "";

  const images = Array.isArray(restaurant.images) ? restaurant.images : [];
  const imageUrl = images[0] || restaurant.imageUrl;


  return (
    <Link to={`/restaurant/${restaurant.id}`} className="card-hover flex flex-col h-full block group">
      <div className="relative overflow-hidden" style={{ height: "200px" }}>
        <img src={imageUrl} alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${restaurant.id}food/600/300`; }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,14,12,0.85) 0%, rgba(15,14,12,0.2) 60%, transparent 100%)" }} />

        {cuisineLabel && (
          <div className="absolute top-3 left-3">
            <span className="badge text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{ background: "rgba(15,14,12,0.8)", backdropFilter: "blur(4px)" }}>
              {cuisineLabel}
            </span>
          </div>
        )}

        {avgRating > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold"
            style={{ background: "rgba(15,14,12,0.75)", color: "var(--color-accent)", backdropFilter: "blur(4px)" }}>
            &#9733; {Number(avgRating).toFixed(1)}
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded text-[10px]"
            style={{ background: "rgba(15,14,12,0.7)", color: "rgba(240,235,227,0.6)", backdropFilter: "blur(4px)" }}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {images.length}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-serif text-lg mb-1 transition-colors duration-200 group-hover:text-accent" style={{ color: "var(--color-text)" }}>
          {restaurant.name}
        </h3>
        {restaurant.address && (
          <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: "var(--color-text-muted)" }}>
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{restaurant.address}</span>
          </div>
        )}
        {restaurant.description && (
          <p className="text-sm leading-relaxed line-clamp-2 mb-3" style={{ color: "var(--color-text-muted)" }}>
            {restaurant.description}
          </p>
        )}
        {reviewCount > 0 && (
          <div className="flex items-center gap-2 pt-3" style={{ borderTop: "1px solid var(--color-border)" }}>
            <StarRating rating={Math.round(avgRating)} />
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default RestaurantCard;