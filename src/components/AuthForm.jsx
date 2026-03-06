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

// ── Provider Icons ───────────────────────────────────────────
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

function FacebookIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0A66C2">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#F25022" d="M1 1h10v10H1z"/>
      <path fill="#00A4EF" d="M13 1h10v10H13z"/>
      <path fill="#7FBA00" d="M1 13h10v10H1z"/>
      <path fill="#FFB900" d="M13 13h10v10H13z"/>
    </svg>
  );
}

// ── OAuth Button ─────────────────────────────────────────────
function OAuthButton({ icon, label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className="relative flex items-center justify-center w-10 h-10 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 border border-zinc-700 hover:border-zinc-500 rounded-xl transition-all group"
    >
      {icon}
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {label}
      </span>
    </button>
  );
}

export default function AuthForm({ mode = "login", onLogin, onSwitch }) {
  const isLogin = mode === "login";

  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOL] = useState(""); // stores which provider is loading

  const reset = () => { setName(""); setEmail(""); setPass(""); setError(""); };

  // ── Email / Password ────────────────────────────────────────
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

  // ── OAuth handler (generic) ─────────────────────────────────
  const handleOAuth = (provider, fn) => {
    setOL(provider);
    fn(); // redirects browser — page navigates away
  };

  const anyLoading = loading || oauthLoading !== "";

  // ── OAuth providers config ──────────────────────────────────
  const providers = [
    { key: "google",    label: "Google",    icon: <GoogleIcon />,    fn: authService.loginWithGoogle    },
    { key: "github",    label: "GitHub",    icon: <GithubIcon />,    fn: authService.loginWithGithub    },
    // { key: "facebook",  label: "Facebook",  icon: <FacebookIcon />,  fn: authService.loginWithFacebook  },
    // { key: "linkedin",  label: "LinkedIn",  icon: <LinkedInIcon />,  fn: authService.loginWithLinkedin  },
    // { key: "microsoft", label: "Microsoft", icon: <MicrosoftIcon />, fn: authService.loginWithMicrosoft },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Logo />

        <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-white mb-6">
            {isLogin ? "Welcome back" : "Get started"}
          </h1>

          {/* ── OAuth Icons row ────────────────────────────── */}
          <div className="flex items-center justify-center gap-3 mb-6 pb-2 ">
            {providers.map(({ key, label, icon, fn }) => (
              <OAuthButton
                key={key}
                icon={oauthLoading === key
                  ? <span className="w-4 h-4 border-2 border-zinc-500 border-t-white rounded-full animate-spin cursor:pointer" />
                  : icon
                }
                label={label}
                disabled={anyLoading}
                onClick={() => handleOAuth(key, fn)}
              />
            ))}
          </div>

          {/* ── Divider ──────────────────────────────────── */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-600 text-xs">or use email</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* ── Error ────────────────────────────────────── */}
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
              type="submit" disabled={anyLoading}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-semibold rounded-lg py-2.5 text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
              {loading
                ? isLogin ? "Signing in…" : "Creating account…"
                : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* ── Switch ───────────────────────────────────── */}
          <p className="text-center text-zinc-500 text-sm mt-6">
            {isLogin ? "No account? " : "Already have an account? "}
            <button onClick={() => { reset(); onSwitch(); }}
              className="text-amber-400 hover:text-amber-300 font-medium cursor:pointer transition-colors">
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
