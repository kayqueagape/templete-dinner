import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api.js";

const Profile = ({ user }) => {
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await api.auth.getProfile();
        setProfile(data);
      } catch {
        setError("Error loading profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="spinner w-10 h-10 mb-4"></div>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Loading profile...</p>
      </div>
    );
  }

  const displayName = profile?.name || user?.name || "User";
  const displayEmail = profile?.email || user?.email || "";
  const initial = displayName.charAt(0).toUpperCase();
  const memberSince = profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" }) : "Member";

  return (
    <div className="container-narrow py-10">
      <div className="animate-slide-up">
        <h1 className="font-serif text-3xl mb-8" style={{ color: "var(--color-text)" }}>My Profile</h1>

        {error && <div className="alert-error mb-6">{error}</div>}

        <div className="card p-8 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shrink-0"
            style={{ background: "rgba(212,168,83,0.15)", color: "var(--color-accent)", border: "2px solid rgba(212,168,83,0.3)" }}>
            {initial}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="font-serif text-2xl mb-1" style={{ color: "var(--color-text)" }}>{displayName}</h2>
            <p className="text-sm mb-2" style={{ color: "var(--color-text-muted)" }}>{displayEmail}</p>
            <span className="badge text-xs">{memberSince}</span>
          </div>
        </div>
        
        <div className="card p-6 mb-6">
          <h3 className="font-serif text-lg mb-4" style={{ color: "var(--color-text)" }}>Account information</h3>
          <div className="space-y-3">
            {[
              { label: "Name", value: displayName },
              { label: "E-mail", value: displayEmail },
              { label: "Account ID", value: profile?.id || profile?._id || "—" },
              { label: "Member since", value: memberSince },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1 py-3" style={{ borderBottom: "1px solid var(--color-border)" }}>
                <span className="text-xs font-semibold uppercase tracking-wider w-36 shrink-0" style={{ color: "var(--color-text-muted)" }}>{label}</span>
                <span className="text-sm" style={{ color: "var(--color-text)" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-serif text-lg mb-4" style={{ color: "var(--color-text)" }}>Quick actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/create-restaurant" className="btn-secondary py-3 justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add restaurant
            </Link>
            <Link to="/users" className="btn-secondary py-3 justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              View users
            </Link>
            <Link to="/" className="btn-secondary py-3 justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore restaurants
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;