import { useState, useEffect } from "react";
import { api } from "../services/api.js";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await api.users.getAll();
        setUsers(Array.isArray(data) ? data : []);
        // eslint-disable-next-line
      } catch (err) {
        setError("Error loading users. Please verify that you are authenticated.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleViewUser = async (userId) => {
    setDetailLoading(true);
    try {
      const data = await api.users.getById(userId);
      setSelectedUser(data);
    } catch {
      setSelectedUser(users.find((u) => u.id === userId));
    } finally {
      setDetailLoading(false);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-main py-10">
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl mb-1" style={{ color: "var(--color-text)" }}>Users</h1>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {loading ? "loading..." : `${filtered.length} User${filtered.length !== 1 ? "s" : " "} found${filtered.length !== 1 ? "s" : " "}`}
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--color-text-muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search for user..."
              className="input-field pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {error && <div className="alert-warning mb-6">{error} Displaying demo data.</div>}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="spinner w-10 h-10 mb-4"></div>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Loading users...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {filtered.length === 0 ? (
                <div className="card p-12 text-center">
                  <p className="text-4xl mb-3">👤</p>
                  <p className="font-serif text-lg" style={{ color: "var(--color-text)" }}>No users found</p>
                </div>
              ) : (
                <div className="card overflow-hidden">
                  {filtered.map((user, i) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors duration-150"
                      style={{
                        borderBottom: i < filtered.length - 1 ? "1px solid var(--color-border)" : "none",
                        background: selectedUser?.id === user.id ? "rgba(212,168,83,0.05)" : "transparent",
                      }}
                      onClick={() => handleViewUser(user.id)}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                        style={{ background: "rgba(212,168,83,0.12)", color: "var(--color-accent)", border: "1px solid rgba(212,168,83,0.2)" }}>
                        {user.name?.charAt(0).toUpperCase() || "?"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text)" }}>{user.name}</p>
                        <p className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>{user.email}</p>
                      </div>

                      <div className="hidden sm:block text-xs shrink-0" style={{ color: "var(--color-text-muted)" }}>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("pt-BR") : "—"}
                      </div>

                      <svg className="w-4 h-4 shrink-0" style={{ color: "var(--color-text-muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-20">
                {detailLoading ? (
                  <div className="flex flex-col items-center py-8">
                    <div className="spinner w-8 h-8 mb-3"></div>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>loading...</p>
                  </div>
                ) : selectedUser ? (
                  <div className="animate-fade-in">
                    <div className="text-center mb-5">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3"
                        style={{ background: "rgba(212,168,83,0.15)", color: "var(--color-accent)", border: "2px solid rgba(212,168,83,0.3)" }}>
                        {selectedUser.name?.charAt(0).toUpperCase()}
                      </div>
                      <h3 className="font-serif text-lg" style={{ color: "var(--color-text)" }}>{selectedUser.name}</h3>
                      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{selectedUser.email}</p>
                    </div>

                    <div className="space-y-3 text-sm">
                      {[
                        { label: "ID", value: selectedUser.id || selectedUser._id },
                        { label: "Member since", value: selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" }) : "—" },
                        { label: "Reviews", value: selectedUser._count?.reviews ?? selectedUser.reviewCount ?? "—" },
                        { label: "Restaurants", value: selectedUser._count?.restaurants ?? selectedUser.restaurantCount ?? "—" },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between gap-2 py-2" style={{ borderBottom: "1px solid var(--color-border)" }}>
                          <span className="text-xs uppercase tracking-wider font-medium" style={{ color: "var(--color-text-muted)" }}>{label}</span>
                          <span className="text-xs font-semibold text-right" style={{ color: "var(--color-text)" }}>{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-4xl mb-3">👤</p>
                    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Click on a user to view details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;