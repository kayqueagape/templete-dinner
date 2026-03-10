import { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import RestaurantDetails from "./pages/RestaurantDetails.jsx";
import CreateRestaurant from "./pages/CreateRestaurant.jsx";
import EditRestaurant from "./pages/EditRestaurant.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Users from "./pages/Users.jsx";
import { api } from "./services/api.js";

const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await api.auth.getProfile();
          setUser(userData);
        } catch {
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-10 h-10 mx-auto mb-4"></div>
          <p className="text-muted text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails user={user} />} />
            <Route
              path="/restaurant/:id/edit"
              element={
                <ProtectedRoute user={user}>
                  <EditRestaurant user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-restaurant"
              element={
                <ProtectedRoute user={user}>
                  <CreateRestaurant user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute user={user}>
                  <Profile user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute user={user}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/" replace /> : <Register onLogin={handleLogin} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }} className="py-8 mt-16">
          <div className="container-main">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden>🍽️</span>
                <span className="font-serif text-lg" style={{ color: "var(--color-accent)" }}>GourmetGuide</span>
              </div>
              <p className="text-muted text-sm">© 2025 GourmetGuide · All rights reserved</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;