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
  const [user] = useState(null);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow">
            <Route
              path="/create-restaurant"
              element={
                <ProtectedRoute user={user}>
                  <CreateRestaurant user={user} />
                </ProtectedRoute>
              }
            />
        </main>

      </div>
    </Router>
  );
};

export default App;