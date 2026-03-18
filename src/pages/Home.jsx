import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api.js";
import RestaurantCard from "../components/RestaurantCard.jsx";

const CATEGORIES = ["All", "Italian", "Japanese", "French", "Brazilian", "American", "Mexican", "Arabic", "Vegan"];

const Home = ({ user }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.restaurants.getAll();
        setRestaurants(Array.isArray(data) ? data : []);
        // eslint-disable-next-line
      } catch (err) {
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filtered = restaurants.filter((r) => {
    const cuisineOrCategory = r.cuisine || r.category || " ";
    const matchSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cuisineOrCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === "All" || cuisineOrCategory === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div>
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0">
          <img
            src=""
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(15,14,12,0.93) 0%, rgba(15,14,12,0.78) 50%, rgba(26,18,9,0.92) 100%)" }}></div>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 25% 50%, #d4a853 0%, transparent 50%), radial-gradient(circle at 75% 50%, #d4a853 0%, transparent 50%)" }}></div>
        </div>
        <div className="container-main relative text-center animate-fade-in">
          <p className="text-xs uppercase tracking-widest mb-4 font-medium" style={{ color: "var(--color-accent)" }}>
            Food Guide
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight" style={{ color: "var(--color-text)" }}>
            Find out where<br />
            <em style={{ color: "var(--color-accent)" }}>eat well</em>
          </h1>
          <p className="text-base md:text-lg max-w-lg mx-auto mb-10" style={{ color: "var(--color-text-muted)" }}>
            Find the best restaurants, read real reviews, and share your dining experiences..
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user ? (
              <Link to="/create-restaurant" className="btn-primary px-7 py-3">
                + Add Restaurant
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary px-7 py-3">Get started now</Link>
                <Link to="/login" className="btn-secondary px-7 py-3">Log in</Link>
              </>
            )}
          </div>
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto">
            {[
              { val: restaurants.length || "4+", label: "Restaurantes" },
              { val: "★ 4.5", label: "rating score" },
              { val: "100%", label: "Free" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold font-serif" style={{ color: "var(--color-accent)" }}>{s.val}</p>
                <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="container-main py-12">
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--color-text-muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search for restaurant, category, or address..."
                className="input-field pl-11"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="input-field md:w-48"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150"
                style={selectedCategory === cat
                  ? { background: "var(--color-accent)", color: "#0f0e0c" }
                  : { background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        {error && (
          <div className="alert-warning mb-6 animate-fade-in">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error} Displaying demo data.</span>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {loading ? "Loading..." : `${filtered.length} ${filtered.length === 1 ? "restaurant" : "restaurants"}`}
          </p>
          {user && (
            <Link to="/create-restaurant" className="btn-secondary text-xs px-4 py-2">
              + New restaurant
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="spinner w-10 h-10 mb-4"></div>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Loading restaurants...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <p className="font-serif text-xl mb-2" style={{ color: "var(--color-text)" }}>No results</p>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Try searching with other terms or categories</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((restaurant, i) => (
              <div key={restaurant.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <RestaurantCard restaurant={restaurant} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;