import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    onLogout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }} className="sticky top-0 z-50 backdrop-blur-md">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMenuOpen(false)}>
            <span className="text-2xl" aria-hidden>🍽️</span>
            <span className="font-serif text-xl" style={{ color: "var(--color-accent)" }}>GourmetGuide</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>Restaurants</Link>
            {user && (
              <>
                <Link to="/create-restaurant" className={`nav-link ${isActive("/create-restaurant") ? "active" : ""}`}>+ Add</Link>
                <Link to="/users" className={`nav-link ${isActive("/users") ? "active" : ""}`}>Users</Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2.5 group">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: "rgba(212,168,83,0.2)", color: "var(--color-accent)", border: "1px solid rgba(212,168,83,0.3)" }}>
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
                    {user.name?.split(" ")[0]}
                  </span>
                </Link>
                <button onClick={handleLogout} className="btn-secondary text-xs px-4 py-2">Exit</button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">Register</Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: "var(--color-text-muted)" }}
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {menuOpen && (
        <div className="md:hidden animate-slide-down" style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
          <div className="container-main py-4 flex flex-col gap-1">
            <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Restaurants
            </Link>
            {user ? (
              <>
                <Link to="/create-restaurant" className={`nav-link ${isActive("/create-restaurant") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Restaurant
                </Link>
                <Link to="/users" className={`nav-link ${isActive("/users") ? "active" : ""}`} onClick={() => setMenuOpen(false)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Users
                </Link>
                <div className="divider my-2"></div>
                <Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "rgba(212,168,83,0.2)", color: "var(--color-accent)" }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  My Profile
                </Link>
                <button onClick={handleLogout} className="nav-link w-full text-left" style={{ color: "var(--color-danger)" }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sair
                </button>
              </>
            ) : (
              <>
                <div className="divider my-2"></div>
                <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn-primary mt-1" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;