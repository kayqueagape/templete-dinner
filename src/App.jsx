import { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import CreateRestaurant from "./pages/CreateRestaurant.jsx";
import EditRestaurant from "./pages/EditRestaurant.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  const [user] = useState(null);

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

      </div>
    </Router>
  );
};

export default App;