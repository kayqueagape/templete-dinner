import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../services/api.js";

const CUISINES = ["Italian","Japanese","French","Brazilian","American","Mexican","Arabic","Vegan","Portuguese","Chinese","Indian","Greek","Spanish","Peruvian","Other"];
const PRICE_RANGES = ["$","$$","$$$","$$$$"];
const MAX_IMAGES = 10;

const FormField = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>{label}</label>
    {children}
  </div>
);

const EditRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name:"", cuisine:"", address:"", city:"", state:"", zipCode:"",
    country:"Brazil", latitude:"", longitude:"",
    description:"", phone:"", website:"", priceRange:"",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [toDelete, setToDelete] = useState(new Set());
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.restaurants.getById(id);
        setForm({
          name: data.name || "",
          cuisine: data.cuisine || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          zipCode: data.zipCode || "",
          country: data.country || "Brazil",
          latitude: data.latitude ?? "",
          longitude: data.longitude ?? "",
          description: data.description || "",
          phone: data.phone || "",
          website: data.website || "",
          priceRange: data.priceRange || "",
        });
        // Prefer the images array, fallback to imageUrl
        const imgs = Array.isArray(data.images) && data.images.length > 0
          ? data.images
          : data.imageUrl ? [data.imageUrl] : [];
        setExistingImages(imgs);
      } catch {
        setError("Error loading restaurant data.");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const toggleDelete = (i) => {
    setToDelete((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const handleAddFiles = (e) => {
    const files = Array.from(e.target.files);
    const remaining = existingImages.filter((_, i) => !toDelete.has(i)).length;
    const totalAfter = remaining + newFiles.length + files.length;
    if (totalAfter > MAX_IMAGES) {
      setError(`Max ${MAX_IMAGES} images. You can add ${MAX_IMAGES - remaining - newFiles.length} more.`);
      return;
    }
    const oversized = files.filter((f) => f.size > 5 * 1024 * 1024);
    if (oversized.length) { setError("Each image must be under 5MB."); return; }
    setNewFiles((p) => [...p, ...files]);
    setNewPreviews((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
    setError("");
    e.target.value = "";
  };

  const removeNewFile = (i) => {
    URL.revokeObjectURL(newPreviews[i]);
    setNewFiles((p) => p.filter((_, idx) => idx !== i));
    setNewPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setForm((p) => ({ ...p, latitude: pos.coords.latitude.toFixed(8), longitude: pos.coords.longitude.toFixed(8) })); setLocating(false); },
      () => setLocating(false)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim() || !form.city.trim()) { setError("Name, Address and City are required."); return; }
    if (!form.latitude || !form.longitude) { setError("GPS coordinates are required."); return; }
    setSaving(true); setError("");

    try {
      setProgress("Saving changes...");
      await api.restaurants.update(id, {
        name: form.name.trim(), cuisine: form.cuisine || null,
        address: form.address.trim(), city: form.city.trim(),
        state: form.state.trim() || null, zipCode: form.zipCode.trim() || null,
        country: form.country.trim() || "Brazil",
        latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude),
        description: form.description.trim() || null, phone: form.phone.trim() || null,
        website: form.website.trim() || null, priceRange: form.priceRange || null,
      });

      const deleteIndices = [...toDelete].sort((a, b) => b - a);
      if (deleteIndices.length > 0) {
        setProgress(`Removing ${deleteIndices.length} image${deleteIndices.length > 1 ? "s" : ""}...`);
        for (const idx of deleteIndices) {
          await api.restaurants.deleteImage(id, idx).catch(() => {});
        }
      }

      if (newFiles.length > 0) {
        setProgress(`Uploading ${newFiles.length} new image${newFiles.length > 1 ? "s" : ""} to R2...`);
        await api.restaurants.uploadImages(id, newFiles);
      }

      setSuccess(true);
      setTimeout(() => navigate(`/restaurant/${id}`), 1200);
    } catch (err) {
      setError(err.message || "Error saving. Please try again.");
    } finally {
      setSaving(false); setProgress("");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="spinner w-10 h-10 mb-4"></div>
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Loading...</p>
    </div>
  );

  const keptExisting = existingImages.filter((_, i) => !toDelete.has(i));
  const slots = MAX_IMAGES - keptExisting.length - newFiles.length;

  return (
    <div className="container-narrow py-10">
      <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "var(--color-text-muted)" }}>
        <Link to="/" className="hover:text-accent transition-colors">Restaurants</Link>
        <span>/</span>
        <Link to={`/restaurant/${id}`} className="hover:text-accent transition-colors">{form.name || "Restaurant"}</Link>
        <span>/</span>
        <span>Edit</span>
      </div>

      <div className="animate-slide-up">
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl mb-2" style={{ color: "var(--color-text)" }}>Edit restaurant</h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Update information and images.</p>
        </div>

        <div className="card p-6 md:p-8">
          {error && (
            <div className="alert-error mb-6">
              <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}
          {success && (
            <div className="alert-success mb-6">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Saved successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--color-accent)" }}>Basic information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Name *"><input type="text" className="input-field" value={form.name} onChange={set("name")} required disabled={saving} /></FormField>
                <FormField label="Kitchen">
                  <select className="input-field" value={form.cuisine} onChange={set("cuisine")} disabled={saving}>
                    <option value="">Select...</option>
                    {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>
                <FormField label="Price range">
                  <select className="input-field" value={form.priceRange} onChange={set("priceRange")} disabled={saving}>
                    <option value="">Select...</option>
                    {PRICE_RANGES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </FormField>
                <FormField label="Phone"><input type="tel" className="input-field" value={form.phone} onChange={set("phone")} disabled={saving} /></FormField>
              </div>
              <div className="mt-4">
                <FormField label="Description"><textarea className="input-field resize-none h-24" value={form.description} onChange={set("description")} disabled={saving} /></FormField>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                    Photos ({keptExisting.length + newFiles.length}/{MAX_IMAGES})
                  </label>
                  {slots > 0 && (
                    <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer px-3 py-1.5 rounded-lg transition-colors"
                      style={{ color: "var(--color-accent)", border: "1px solid rgba(212,168,83,0.3)", background: "rgba(212,168,83,0.06)" }}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Add photos
                      <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleAddFiles} disabled={saving} />
                    </label>
                  )}
                </div>

                {existingImages.length === 0 && newFiles.length === 0 ? (
                  <label className="flex flex-col items-center justify-center w-full rounded-lg cursor-pointer"
                    style={{ height: "140px", border: "2px dashed var(--color-border)", background: "var(--color-surface-2)" }}>
                    <svg className="w-8 h-8 mb-2" style={{ color: "var(--color-text-muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>Click to add photos</p>
                    <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Up to {MAX_IMAGES} images · 5MB each</p>
                    <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleAddFiles} disabled={saving} />
                  </label>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {existingImages.map((url, i) => {
                      const marked = toDelete.has(i);
                      return (
                        <div key={`existing-${i}`} className="relative group rounded-lg overflow-hidden"
                          style={{
                            aspectRatio: "4/3",
                            border: marked ? "2px solid var(--color-danger)" : i === 0 ? "2px solid var(--color-accent)" : "2px solid var(--color-border)",
                            opacity: marked ? 0.4 : 1,
                            transition: "opacity 0.2s, border-color 0.2s",
                          }}>
                          <img src={url} alt="" className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.parentElement.style.opacity = "0.2"; }} />
                          {i === 0 && !marked && (
                            <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold"
                              style={{ background: "var(--color-accent)", color: "#0f0e0c" }}>COVER</div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ background: "rgba(15,14,12,0.5)" }}>
                            <button type="button" onClick={() => toggleDelete(i)} disabled={saving}
                              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                              style={{ background: marked ? "var(--color-success)" : "var(--color-danger)", color: "#fff" }}>
                              {marked ? "↩" : "✕"}
                            </button>
                          </div>
                          {marked && (
                            <div className="absolute bottom-0 left-0 right-0 py-0.5 text-center text-[9px] font-bold"
                              style={{ background: "rgba(224,82,82,0.85)", color: "#fff" }}>WILL DELETE</div>
                          )}
                        </div>
                      );
                    })}

                    {newPreviews.map((src, i) => (
                      <div key={`new-${i}`} className="relative group rounded-lg overflow-hidden"
                        style={{ aspectRatio: "4/3", border: "2px solid var(--color-accent)", boxShadow: "0 0 0 1px rgba(212,168,83,0.2)" }}>
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold"
                          style={{ background: "rgba(212,168,83,0.9)", color: "#0f0e0c" }}>NEW</div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: "rgba(15,14,12,0.5)" }}>
                          <button type="button" onClick={() => removeNewFile(i)} disabled={saving}
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ background: "var(--color-danger)", color: "#fff" }}>✕</button>
                        </div>
                      </div>
                    ))}

                    {slots > 0 && (
                      <label className="flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors"
                        style={{ aspectRatio: "4/3", border: "2px dashed var(--color-border)", background: "var(--color-surface-2)" }}>
                        <svg className="w-5 h-5 mb-1" style={{ color: "var(--color-text-muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{slots} left</span>
                        <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleAddFiles} disabled={saving} />
                      </label>
                    )}
                  </div>
                )}

                {toDelete.size > 0 && (
                  <p className="text-xs mt-2" style={{ color: "var(--color-danger)" }}>
                    {toDelete.size} image{toDelete.size > 1 ? "s" : ""} marked for deletion. Hover to undo.
                  </p>
                )}
                {newFiles.length > 0 && (
                  <p className="text-xs mt-1" style={{ color: "var(--color-accent)" }}>
                    {newFiles.length} new image{newFiles.length > 1 ? "s" : ""} will be uploaded to R2 on save.
                  </p>
                )}
              </div>

              <div className="mt-4">
                <FormField label="Website"><input type="url" className="input-field" placeholder="https://..." value={form.website} onChange={set("website")} disabled={saving} /></FormField>
              </div>
            </div>

            <div className="divider"></div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--color-accent)" }}>Location</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Address *"><input type="text" className="input-field" value={form.address} onChange={set("address")} required disabled={saving} /></FormField>
                <FormField label="City *"><input type="text" className="input-field" value={form.city} onChange={set("city")} required disabled={saving} /></FormField>
                <FormField label="State"><input type="text" className="input-field" value={form.state} onChange={set("state")} disabled={saving} /></FormField>
                <FormField label="ZIP Code"><input type="text" className="input-field" value={form.zipCode} onChange={set("zipCode")} disabled={saving} /></FormField>
                <FormField label="Country"><input type="text" className="input-field" value={form.country} onChange={set("country")} disabled={saving} /></FormField>
              </div>
              <div className="mt-4 p-4 rounded-lg" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>GPS coordinates *</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>Use the button to update or edit manually.</p>
                  </div>
                  <button type="button" onClick={handleGetLocation} disabled={locating || saving} className="btn-secondary text-xs px-4 py-2 shrink-0">
                    {locating ? <><div className="spinner w-3 h-3"></div> Locating...</> : (
                      <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> My location</>
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Latitude *"><input type="number" step="any" className="input-field" value={form.latitude} onChange={set("latitude")} required disabled={saving} /></FormField>
                  <FormField label="Longitude *"><input type="number" step="any" className="input-field" value={form.longitude} onChange={set("longitude")} required disabled={saving} /></FormField>
                </div>
              </div>
            </div>

            <div className="divider"></div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button type="submit" className="btn-primary flex-1 py-3" disabled={saving || success}>
                {saving ? <><div className="spinner w-4 h-4"></div> {progress || "Saving..."}</> : (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Save changes</>
                )}
              </button>
              <Link to={`/restaurant/${id}`} className="btn-secondary flex-1 py-3 text-center">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRestaurant;