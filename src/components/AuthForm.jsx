import { useState } from "react";
import { authService } from "../appwrite/auth";

function Logo() {
  return (
    <div className="text-center mb-10">
      <div className="inline-flex items-center gap-2 mb-4">
        <div className="w-9 h-9 bg-amber-400 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <span className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
          TaskFlow
        </span>
      </div>
      <p className="text-zinc-500 text-sm">Your tasks, beautifully managed</p>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="block text-sm text-zinc-400 mb-1.5">{label}</label>
      <input
        type={type} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
      />
    </div>
  );
}

// Google "G" SVG icon
function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

/**
 * AuthForm — handles Login, Register, and Google OAuth.
 *
 * Props:
 *   mode     : "login" | "register"
 *   onLogin  : (user) => void
 *   onSwitch : () => void
 */
export default function AuthForm({ mode = "login", onLogin, onSwitch }) {
  const isLogin = mode === "login";

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPass]     = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGL]  = useState(false);

  const reset = () => { setName(""); setEmail(""); setPass(""); setError(""); };

  // ── Email / Password submit ────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isLogin && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      if (!isLogin) await authService.register(email, password, name);
      await authService.login(email, password);
      const user = await authService.getUser();
      reset();
      onLogin(user);
    } catch (err) {
      setError(err.message || (isLogin ? "Login failed." : "Registration failed."));
    } finally {
      setLoading(false);
    }
  };

  // ── Google OAuth ───────────────────────────────────────────
  // This redirects the browser to Google — no async needed.
  // After Google auth, Appwrite redirects back to /auth/callback
  // where App.jsx picks up the session via getUser().
  const handleGoogle = () => {
    setGL(true);
    authService.loginWithGoogle(); // browser navigates away
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Logo />

        <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-white mb-6">
            {isLogin ? "Welcome back" : "Get started"}
          </h1>

          {/* ── Google OAuth button ──────────────────────── */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 border border-zinc-700 hover:border-zinc-500 text-white font-medium rounded-lg py-2.5 text-sm transition-all mb-4"
          >
            {googleLoading
              ? <span className="w-4 h-4 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
              : <GoogleIcon />
            }
            {googleLoading ? "Redirecting…" : `Continue with Google`}
          </button>

          {/* ── Divider ──────────────────────────────────── */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-600 text-xs">or continue with email</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* ── Error banner ─────────────────────────────── */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-950/50 border border-red-800/50 rounded-lg text-red-400 text-sm flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* ── Email/Password form ───────────────────────── */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Field label="Full Name" type="text" value={name}
                onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
            )}
            <Field label="Email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            <Field label="Password" type="password" value={password}
              onChange={(e) => setPass(e.target.value)}
              placeholder={isLogin ? "••••••••" : "Min. 8 characters"} required />

            <button
              type="submit" disabled={loading || googleLoading}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-semibold rounded-lg py-2.5 text-sm transition-colors mt-2 flex items-center justify-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
              {loading
                ? isLogin ? "Signing in…" : "Creating account…"
                : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* ── Switch link ───────────────────────────────── */}
          <p className="text-center text-zinc-500 text-sm mt-6">
            {isLogin ? "No account? " : "Already have an account? "}
            <button onClick={() => { reset(); onSwitch(); }}
              className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>

        {/* Mode dots */}
        <div className="flex justify-center gap-1.5 mt-6">
          <span className={`h-1.5 rounded-full transition-all ${isLogin ? "bg-amber-400 w-4" : "bg-zinc-700 w-1.5"}`} />
          <span className={`h-1.5 rounded-full transition-all ${!isLogin ? "bg-amber-400 w-4" : "bg-zinc-700 w-1.5"}`} />
        </div>
      </div>
    </div>
  );
}
