import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api.js";

const Register = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("The password must be at least 6 characters long..");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.auth.register({ name, email, password });
      onLogin(res.token, res.user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Error creating account. Please check the details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = [" ", "Fraca", "Boa", "Forte"];
  const strengthColor = [" ", "#e05252", "#d4a853", "#5eb87e"];

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-10">
          <span className="text-4xl block mb-4">✦</span>
          <h1 className="font-serif text-3xl md:text-4xl mb-2" style={{ color: "var(--color-text)" }}>Create account</h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Join GourmetGuide today</p>
        </div>

        <div className="card p-6 md:p-8">
          {error && (
            <div className="alert-error mb-5 text-sm">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>
                full name
              </label>
              <input
                id="name"
                type="text"
                placeholder="your name"
                required
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="email-register" className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>
                E-mail
              </label>
              <input
                id="email-register"
                type="email"
                placeholder="your@email.com"
                required
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password-register" className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>
                password
              </label>
              <div className="relative">
                <input
                  id="password-register"
                  type={showPwd ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                  className="input-field pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {showPwd ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: strength >= s ? strengthColor[strength] : "var(--color-border)" }}></div>
                    ))}
                  </div>
                  <span className="text-xs" style={{ color: strengthColor[strength] }}>{strengthLabel[strength]}</span>
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary w-full py-3 mt-2" disabled={loading}>
              {loading ? (
                <><div className="spinner w-4 h-4"></div> Creating an account...</>
              ) : "Criar Conta"}
            </button>
          </form>

          <div className="divider my-6"></div>

          <p className="text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-semibold transition-colors" style={{ color: "var(--color-accent)" }}>
              login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;