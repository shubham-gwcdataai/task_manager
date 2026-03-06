import { useState } from "react";
export default function Navbar({ user, onLogout, taskStats }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await onLogout();
    setLoggingOut(false);
  };

  // Derive initials for avatar
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "?";

  const displayName = user?.name || user?.email || "User";

  return (
    <header className="sticky top-0 z-30 bg-[#0e0e10]/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-2xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* ── Logo ──────────────────────────────────────────── */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-amber-400 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <span
            className="font-bold text-white tracking-tight text-lg"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            TaskFlow
          </span>

          {/* Task stats badge — shows when tasks exist */}
          {taskStats && taskStats.total > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-full px-2.5 py-0.5 ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              {taskStats.done}/{taskStats.total}
            </span>
          )}
        </div>

        {/* ── Right side ────────────────────────────────────── */}
        <div className="flex items-center gap-3">

          {/* Desktop: name + sign out */}
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-zinc-500 text-sm truncate max-w-[160px]">
              Hi, <span className="text-zinc-300">{displayName}</span>
            </span>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-1.5 text-zinc-500 hover:text-white disabled:opacity-50 text-sm px-3 py-1.5 border border-zinc-700 hover:border-zinc-500 rounded-lg transition-all"
            >
              {loggingOut ? (
                <span className="w-3.5 h-3.5 border border-zinc-500 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              )}
              {loggingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>

          {/* Mobile: avatar dropdown */}
          <div className="relative sm:hidden">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-8 h-8 rounded-full bg-amber-400 text-black text-xs font-bold flex items-center justify-center"
            >
              {initials}
            </button>

            {menuOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                {/* Dropdown */}
                <div className="absolute right-0 top-10 z-20 w-52 bg-[#18181b] border border-zinc-700 rounded-xl shadow-xl py-1 overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-zinc-800">
                    <p className="text-white text-sm font-medium truncate">{displayName}</p>
                    <p className="text-zinc-500 text-xs truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { setMenuOpen(false); handleLogout(); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center gap-2 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
