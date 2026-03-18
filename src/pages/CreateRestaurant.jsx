import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api.js";

const CUISINES = ["Italian","Japanese","French","Brazilian","American","Mexican","Arabic","Vegan","Portuguese","Chinese","Indian","Greek","Spanish","Peruvian","Other"];
const PRICE_RANGES = ["$","$$","$$$","$$$$"];
const MAX_IMAGES = 10;

const FormField = ({ label, children, hint }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>{label}</label>
    {children}
    {hint && <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>{hint}</p>}
  </div>
);

const CreateRestaurant = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name:"", cuisine:"", address:"", city:"", state:"", zipCode:"",
    country:"Brazil", latitude:"", longitude:"",
    description:"", phone:"", website:"", priceRange:"",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    const total = imageFiles.length + files.length;
    if (total > MAX_IMAGES) { setError(`Max ${MAX_IMAGES} images. You selected ${total}.`); return; }
    const oversized = files.filter((f) => f.size > 5 * 1024 * 1024);
    if (oversized.length) { setError("Each image must be under 5MB."); return; }
    setImageFiles((p) => [...p, ...files]);
    setPreviews((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
    setError("");
    e.target.value = "";
  };

  const removeImage = (i) => {
    URL.revokeObjectURL(previews[i]);
    setImageFiles((p) => p.filter((_, idx) => idx !== i));
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) { setError("Geolocation not supported."); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setForm((p) => ({ ...p, latitude: pos.coords.latitude.toFixed(8), longitude: pos.coords.longitude.toFixed(8) })); setLocating(false); },
      () => { setError("Unable to get location."); setLocating(false); }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim() || !form.city.trim()) { setError("Name, Address and City are required."); return; }
    if (!form.latitude || !form.longitude) { setError("GPS coordinates are required."); return; }
    setLoading(true); setError("");
    try {
      setProgress("Creating restaurant...");
      const restaurant = await api.restaurants.create({
        name: form.name.trim(), cuisine: form.cuisine || null,
        address: form.address.trim(), city: form.city.trim(),
        state: form.state.trim() || null, zipCode: form.zipCode.trim() || null,
        country: form.country.trim() || "Brazil",
        latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude),
        description: form.description.trim() || null, phone: form.phone.trim() || null,
        website: form.website.trim() || null, priceRange: form.priceRange || null,
      });
      if (imageFiles.length > 0) {
        setProgress(`Uploading ${imageFiles.length} image${imageFiles.length > 1 ? "s" : ""} to R2...`);
        await api.restaurants.uploadImages(restaurant.id, imageFiles);
      }
      navigate(`/restaurant/${restaurant.id}`);
    } catch (err) {
      setError(err.message || "Error creating restaurant.");
    } finally {
      setLoading(false); setProgress("");
    }
  };

  const slots = MAX_IMAGES - imageFiles.length;

  return (
    <div className="container-narrow py-10">
      <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "var(--color-text-muted)" }}>
        <Link to="/" className="hover:text-accent transition-colors">Restaurants</Link>
        <span>/</span><span>New restaurant</span>
      </div>
      <div className="animate-slide-up">
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl mb-2" style={{ color: "var(--color-text)" }}>Add restaurant</h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Share an amazing restaurant with the community.</p>
        </div>
        <div className="card p-6 md:p-8">
          {error && (
            <div className="alert-error mb-6">
              <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--color-accent)" }}>Basic information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Name *"><input type="text" className="input-field" placeholder="Ex: Le Gourmet" value={form.name} onChange={set("name")} required disabled={loading} /></FormField>
                <FormField label="Kitchen">
                  <select className="input-field" value={form.cuisine} onChange={set("cuisine")} disabled={loading}>
                    <option value="">Select...</option>
                    {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>
                <FormField label="Price range">
                  <select className="input-field" value={form.priceRange} onChange={set("priceRange")} disabled={loading}>
                    <option value="">Select...</option>
                    {PRICE_RANGES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </FormField>
                <FormField label="Phone"><input type="tel" className="input-field" placeholder="(21) 99999-9999" value={form.phone} onChange={set("phone")} disabled={loading} /></FormField>
              </div>
              <div className="mt-4">
                <FormField label="Description"><textarea className="input-field resize-none h-24" placeholder="Describe the environment, specialties..." value={form.description} onChange={set("description")} disabled={loading} /></FormField>
              </div>

              {/* ── Multi-image upload ── */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                    Photos ({imageFiles.length}/{MAX_IMAGES})
                  </label>
                  {slots > 0 && (
                    <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer px-3 py-1.5 rounded-lg transition-colors"
                      style={{ color: "var(--color-accent)", border: "1px solid rgba(212,168,83,0.3)", background: "rgba(212,168,83,0.06)" }}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Add photos
                      <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleImages} disabled={loading} />
                    </label>
                  )}
                </div>

                {previews.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {previews.map((src, i) => (
                      <div key={i} className="relative group rounded-lg overflow-hidden" style={{ aspectRatio: "4/3", border: i === 0 ? "2px solid var(--color-accent)" : "2px solid var(--color-border)" }}>
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        {i === 0 && (
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold"
                            style={{ background: "var(--color-accent)", color: "#0f0e0c" }}>COVER</div>
                        )}
                        <button type="button" onClick={() => removeImage(i)} disabled={loading}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: "rgba(224,82,82,0.9)", color: "#fff" }}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                    {slots > 0 && (
                      <label className="flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors" style={{ aspectRatio: "4/3", border: "2px dashed var(--color-border)", background: "var(--color-surface-2)" }}>
                        <svg className="w-5 h-5 mb-1" style={{ color: "var(--color-text-muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{slots} left</span>
                        <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleImages} disabled={loading} />
                      </label>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full rounded-lg cursor-pointer"
                    style={{ height: "140px", border: "2px dashed var(--color-border)", background: "var(--color-surface-2)" }}>
                    <svg className="w-8 h-8 mb-2" style={{ color: "var(--color-text-muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>Click to add photos</p>
                    <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Up to {MAX_IMAGES} images · 5MB each · Stored in R2</p>
                    <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleImages} disabled={loading} />
                  </label>
                )}
                {previews.length > 1 && (
                  <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
                    The first photo will be the cover. Drag to reorder after creating.
                  </p>
                )}
              </div>

              <div className="mt-4">
                <FormField label="Website"><input type="url" className="input-field" placeholder="https://..." value={form.website} onChange={set("website")} disabled={loading} /></FormField>
              </div>
            </div>

            <div className="divider"></div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--color-accent)" }}>Location</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Address *"><input type="text" className="input-field" placeholder="Street, number" value={form.address} onChange={set("address")} required disabled={loading} /></FormField>
                <FormField label="City *"><input type="text" className="input-field" placeholder="Ex: Rio de Janeiro" value={form.city} onChange={set("city")} required disabled={loading} /></FormField>
                <FormField label="State"><input type="text" className="input-field" placeholder="Ex: RJ" value={form.state} onChange={set("state")} disabled={loading} /></FormField>
                <FormField label="Zip code"><input type="text" className="input-field" placeholder="00000-000" value={form.zipCode} onChange={set("zipCode")} disabled={loading} /></FormField>
                <FormField label="Country"><input type="text" className="input-field" value={form.country} onChange={set("country")} disabled={loading} /></FormField>
              </div>
              <div className="mt-4 p-4 rounded-lg" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>GPS coordinates *</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>Required. Use the button or enter manually.</p>
                  </div>
                  <button type="button" onClick={handleGetLocation} disabled={locating || loading} className="btn-secondary text-xs px-4 py-2 shrink-0">
                    {locating ? <><div className="spinner w-3 h-3"></div> Locating...</> : (
                      <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> Use my location</>
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Latitude *"><input type="number" step="any" className="input-field" placeholder="-22.9068" value={form.latitude} onChange={set("latitude")} required disabled={loading} /></FormField>
                  <FormField label="Longitude *"><input type="number" step="any" className="input-field" placeholder="-43.1729" value={form.longitude} onChange={set("longitude")} required disabled={loading} /></FormField>
                </div>
              </div>
            </div>

            <div className="divider"></div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button type="submit" className="btn-primary flex-1 py-3" disabled={loading}>
                {loading ? <><div className="spinner w-4 h-4"></div> {progress || "Creating..."}</> : (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Create Restaurant</>
                )}
              </button>
              <Link to="/" className="btn-secondary flex-1 py-3 text-center">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRestaurant;