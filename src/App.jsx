import { useState, useEffect } from "react";
import { authService } from "./appwrite/auth";
import { account } from "./appwrite/config";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState("login");

  useEffect(() => {
    const path   = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    const secret = params.get("secret");
    if (path === "/auth/callback" && userId && secret) {
      account.createSession(userId, secret)
        .then(() => authService.getUser())
        .then((u) => {
          setUser(u);
          setPage("dashboard");
          window.history.replaceState({}, "", "/"); 
        })
        .catch((err) => {
          console.error("OAuth session error:", err);
          setPage("login");
        })
        .finally(() => setLoading(false));
      return;
    }

    // ── OAuth failure ───────────────────────────────────────
    if (path === "/auth/failure") {
      setPage("login");
      setLoading(false);
      return;
    }

    // ── Normal load: check existing session ─────────────────
    authService.getUser()
      .then((u) => { setUser(u); setPage("dashboard"); })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogin  = (u) => { setUser(u); setPage("dashboard"); };
  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setPage("login");
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-600 text-sm">Loading…</p>
      </div>
    </div>
  );

  if (page === "dashboard" && user)
    return <DashboardPage user={user} onLogout={handleLogout} />;
  if (page === "register")
    return <RegisterPage onLogin={handleLogin} onSwitch={() => setPage("login")} />;
  return <LoginPage onLogin={handleLogin} onSwitch={() => setPage("register")} />;
}
