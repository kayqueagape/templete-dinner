import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../services/api.js";

const StarPicker = ({ value, onChange, disabled }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map((s) => (
      <button key={s} type="button" onClick={() => !disabled && onChange(s)}
        className="transition-transform hover:scale-110"
        style={{ color: s <= value ? "var(--color-accent)" : "var(--color-border)", fontSize: "1.5rem" }}>
        &#9733;
      </button>
    ))}
  </div>
);

const StarDisplay = ({ rating }) => (
  <span style={{ fontSize: "14px", letterSpacing: "-1px" }}>
    {[1,2,3,4,5].map((s) => (
      <span key={s} style={{ color: s <= rating ? "var(--color-accent)" : "var(--color-border)" }}>&#9733;</span>
    ))}
  </span>
);

const ImageGallery = ({ images, name }) => {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    if (!lightbox) return;
    const h = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [lightbox, prev, next]);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="relative overflow-hidden cursor-zoom-in" style={{ height: "480px", background: "#000" }}
        onClick={() => setLightbox(true)}>
        <img src={images[active]} alt={name}
          className="w-full h-full object-cover transition-opacity duration-300"
          onError={(e) => { e.currentTarget.style.display = "none"; }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(15,14,12,0.95) 0%, rgba(15,14,12,0.1) 45%, transparent 100%)" }} />
        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: "rgba(15,14,12,0.7)", color: "var(--color-text-muted)", backdropFilter: "blur(4px)" }}>
          {active + 1} / {images.length}
        </div>
        <div className="absolute bottom-4 right-4 pointer-events-none opacity-50">
          <svg className="w-5 h-5" style={{ color: "var(--color-text)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </div>
        {images.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(15,14,12,0.7)", color: "var(--color-text)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(15,14,12,0.7)", color: "var(--color-text)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 px-4 py-3 overflow-x-auto" style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
          {images.map((url, i) => (
            <button key={i} onClick={() => setActive(i)}
              className="shrink-0 rounded-lg overflow-hidden transition-all duration-200"
              style={{ width: 72, height: 52, border: active === i ? "2px solid var(--color-accent)" : "2px solid transparent", opacity: active === i ? 1 : 0.5 }}>
              <img src={url} alt="" className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }} />
            </button>
          ))}
        </div>
      )}
      {lightbox && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.96)" }}
          onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}
          <img src={images[active]} alt={name}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()} />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            {active + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
};

const RestaurantDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [res, rev] = await Promise.all([api.restaurants.getById(id), api.reviews.getByRestaurant(id)]);
        setRestaurant(res);
        setReviews(Array.isArray(rev) ? rev : []);
      } catch { setError("Unable to load restaurant data."); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user || !id || !reviewComment.trim()) return;
    setSubmitting(true); setReviewError("");
    try {
      const nr = await api.reviews.create({ restaurantId: id, rating: reviewRating, comment: reviewComment.trim() });
      setReviews([nr, ...reviews]); setReviewComment(""); setReviewRating(5);
    } catch (err) { setReviewError(err.message || "Error sending review."); }
    finally { setSubmitting(false); }
  };

  const handleSaveEdit = async (reviewId) => {
    setEditSubmitting(true);
    try {
      const u = await api.reviews.update(reviewId, { rating: editRating, comment: editComment });
      setReviews(reviews.map((r) => r.id === reviewId ? { ...r, ...u, rating: editRating, comment: editComment } : r));
      setEditingReview(null);
    } catch { alert("Error updating review."); }
    finally { setEditSubmitting(false); }
  };

  const handleDeleteReview = async (rid) => {
    if (!confirm("Delete this review?")) return;
    try { await api.reviews.delete(rid); setReviews(reviews.filter((r) => r.id !== rid)); }
    catch { alert("Error deleting review."); }
  };

  const handleDeleteRestaurant = async () => {
    setDeleting(true);
    try { await api.restaurants.delete(id); navigate("/"); }
    catch { alert("Error deleting."); setDeleting(false); setShowDeleteModal(false); }
  };

  const isOwner = user && restaurant && (restaurant.userId === user.id || restaurant.ownerId === user.id);
  const isReviewOwner = (r) => user && (r.userId === user.id || r.user?.id === user.id);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="spinner w-10 h-10 mb-4"></div>
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Loading...</p>
    </div>
  );
  if (error && !restaurant) return (
    <div className="container-narrow py-24 text-center">
      <p className="text-lg mb-4" style={{ color: "var(--color-danger)" }}>{error}</p>
      <Link to="/" className="btn-secondary">Back</Link>
    </div>
  );

  const galleryImages = (() => {
    const arr = Array.isArray(restaurant.images) ? restaurant.images : [];
    if (arr.length > 0) return arr;
    if (restaurant.imageUrl) return [restaurant.imageUrl];
    return [`https://picsum.photos/seed/${id}food/1400/500`];
  })();

  return (
    <div className="animate-fade-in">
      <ImageGallery images={galleryImages} name={restaurant.name} />

      <div className="container-main pt-6 pb-2">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {(restaurant.cuisine || restaurant.category) && <span className="badge">{restaurant.cuisine || restaurant.category}</span>}
              {restaurant.priceRange && <span className="badge">{restaurant.priceRange}</span>}
              {galleryImages.length > 0 && restaurant.imageUrl && (
                <span className="text-[10px] px-2 py-0.5 rounded font-mono"
                  style={{ background: "rgba(212,168,83,0.1)", color: "var(--color-accent)", border: "1px solid rgba(212,168,83,0.2)" }}>
                  {galleryImages.length} foto{galleryImages.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl md:text-5xl mb-2" style={{ color: "var(--color-text)" }}>{restaurant.name}</h1>
            {restaurant.address && (
              <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {restaurant.address}{restaurant.city ? `, ${restaurant.city}` : ""}
              </div>
            )}
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-bold" style={{ color: "var(--color-accent)" }}>{avg.toFixed(1)}</span>
                <StarDisplay rating={Math.round(avg)} />
                <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>({reviews.length} reviews)</span>
              </div>
            )}
          </div>
          {isOwner && (
            <div className="flex gap-2 shrink-0">
              <Link to={`/restaurant/${id}/edit`} className="btn-secondary text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Edit
              </Link>
              <button onClick={() => setShowDeleteModal(true)} className="btn-danger text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container-main py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {restaurant.description && (
              <div className="card p-6 mb-8">
                <h2 className="font-serif text-xl mb-3" style={{ color: "var(--color-text)" }}>About</h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{restaurant.description}</p>
              </div>
            )}
            {(restaurant.phone || restaurant.website) && (
              <div className="flex flex-wrap gap-3 mb-8">
                {restaurant.phone && (
                  <a href={`tel:${restaurant.phone}`} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                    style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    {restaurant.phone}
                  </a>
                )}
                {restaurant.website && (
                  <a href={restaurant.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                    style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    Website
                  </a>
                )}
              </div>
            )}
            <h2 className="font-serif text-2xl mb-5" style={{ color: "var(--color-text)" }}>
              Reviews <span style={{ color: "var(--color-accent)" }}>({reviews.length})</span>
            </h2>
            {reviews.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-4xl mb-3">✦</p>
                <p className="font-serif text-lg mb-1" style={{ color: "var(--color-text)" }}>No reviews yet</p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Be the first!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, i) => (
                  <div key={review.id || i} className="card p-5 animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                    {editingReview === review.id ? (
                      <div>
                        <div className="mb-3"><StarPicker value={editRating} onChange={setEditRating} disabled={editSubmitting} /></div>
                        <textarea className="input-field h-24 resize-none mb-3" value={editComment}
                          onChange={(e) => setEditComment(e.target.value)} disabled={editSubmitting} />
                        <div className="flex gap-2">
                          <button onClick={() => handleSaveEdit(review.id)} className="btn-primary text-xs px-4 py-2"
                            disabled={editSubmitting || !editComment.trim()}>{editSubmitting ? "Saving..." : "Save"}</button>
                          <button onClick={() => setEditingReview(null)} className="btn-secondary text-xs px-4 py-2">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                              style={{ background: "rgba(212,168,83,0.15)", color: "var(--color-accent)", border: "1px solid rgba(212,168,83,0.2)" }}>
                              {review.user?.name?.charAt(0).toUpperCase() || "A"}
                            </div>
                            <div>
                              <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{review.user?.name || "Anonymous"}</p>
                              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                                {review.createdAt ? new Date(review.createdAt).toLocaleDateString("pt-BR") : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StarDisplay rating={review.rating} />
                            {isReviewOwner(review) && (
                              <div className="flex gap-1 ml-2">
                                <button onClick={() => { setEditingReview(review.id); setEditComment(review.comment); setEditRating(review.rating); }}
                                  className="btn-ghost p-1.5 rounded">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </button>
                                <button onClick={() => handleDeleteReview(review.id)} className="btn-ghost p-1.5 rounded" style={{ color: "var(--color-danger)" }}>
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{review.comment}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h3 className="font-serif text-xl mb-5" style={{ color: "var(--color-text)" }}>Leave your review</h3>
              {user ? (
                <form onSubmit={handleAddReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>Rating</label>
                    <StarPicker value={reviewRating} onChange={setReviewRating} disabled={submitting} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>Comment</label>
                    <textarea className="input-field resize-none h-28" placeholder="What did you think?"
                      value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} required disabled={submitting} />
                  </div>
                  {reviewError && <div className="alert-error text-xs">{reviewError}</div>}
                  <button type="submit" className="btn-primary w-full" disabled={submitting || !reviewComment.trim()}>
                    {submitting ? <><div className="spinner w-4 h-4"></div> Sending...</> : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-4xl mb-3">&#128274;</p>
                  <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>Login to rate</p>
                  <Link to="/login" className="btn-primary w-full">Login</Link>
                </div>
              )}
              {reviews.length > 0 && (
                <div className="mt-6 pt-5" style={{ borderTop: "1px solid var(--color-border)" }}>
                  <p className="text-xs font-medium mb-3" style={{ color: "var(--color-text-muted)" }}>Rating distribution</p>
                  {[5,4,3,2,1].map((star) => {
                    const count = reviews.filter((r) => r.rating === star).length;
                    return (
                      <div key={star} className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs w-4" style={{ color: "var(--color-text-muted)" }}>{star}</span>
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${(count / reviews.length) * 100}%`, background: "var(--color-accent)" }}></div>
                        </div>
                        <span className="text-xs w-4" style={{ color: "var(--color-text-muted)" }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="card p-8 max-w-sm w-full animate-scale-in">
            <h3 className="font-serif text-xl mb-2" style={{ color: "var(--color-text)" }}>Delete restaurant?</h3>
            <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
              Cannot be undone. <strong style={{ color: "var(--color-text)" }}>{restaurant.name}</strong> and all images will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button onClick={handleDeleteRestaurant} className="btn-danger flex-1" disabled={deleting}>
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;