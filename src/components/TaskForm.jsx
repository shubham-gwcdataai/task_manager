import { useState, useRef, useEffect } from "react";
export default function TaskForm({ onAdd, loading }) {
  const [open, setOpen]     = useState(false);
  const [title, setTitle]   = useState("");
  const [desc, setDesc]     = useState("");
  const [error, setError]   = useState("");
  const titleRef            = useRef(null);

  // Auto-focus title input when form opens
  useEffect(() => {
    if (open) titleRef.current?.focus();
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") handleCancel(); };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleCancel = () => {
    setOpen(false);
    setTitle("");
    setDesc("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!title.trim()) { setError("Task title is required."); return; }
    setError("");
    await onAdd(title.trim(), desc.trim());
    setTitle("");
    setDesc("");
    setOpen(false);
  };

  // Submit on Enter (but allow Shift+Enter for newline in textarea)
  const handleTitleKey = (e) => {
    if (e.key === "Enter") { e.preventDefault(); handleSubmit(); }
  };

  const charLimit = 255;
  const remaining = charLimit - title.length;

  return (
    <div className="mb-6">
      {!open ? (
        /* ── Collapsed trigger ─────────────────────────────── */
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-zinc-500 hover:text-amber-400 text-sm transition-colors group w-full py-2"
        >
          <span className="w-5 h-5 rounded-full border border-zinc-700 group-hover:border-amber-400 group-hover:bg-amber-400/10 flex items-center justify-center text-base leading-none transition-all">
            +
          </span>
          <span>Add a task</span>
        </button>
      ) : (
        /* ── Expanded form ─────────────────────────────────── */
        <div className="bg-[#18181b] border border-zinc-700 focus-within:border-zinc-500 rounded-xl p-4 transition-colors">

          {/* Title input */}
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value.slice(0, charLimit)); setError(""); }}
            onKeyDown={handleTitleKey}
            placeholder="What needs to be done?"
            maxLength={charLimit}
            className="w-full bg-transparent text-white text-sm placeholder-zinc-600 focus:outline-none mb-1"
          />

          {/* Character counter (shows when >200 chars used) */}
          {title.length > 200 && (
            <p className={`text-xs mb-1 text-right ${remaining < 20 ? "text-red-400" : "text-zinc-600"}`}>
              {remaining} left
            </p>
          )}

          {/* Divider */}
          <div className="border-t border-zinc-800 my-2" />

          {/* Description input */}
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Add a description… (optional)"
            rows={2}
            className="w-full bg-transparent text-zinc-400 text-xs placeholder-zinc-700 focus:outline-none resize-none mb-3 leading-relaxed"
          />

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400 mb-3 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={loading || !title.trim()}
                className="bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-black text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {loading && (
                  <span className="w-3 h-3 border border-black/30 border-t-black rounded-full animate-spin" />
                )}
                {loading ? "Adding…" : "Add Task"}
              </button>
              <button
                onClick={handleCancel}
                className="text-zinc-500 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-transparent hover:border-zinc-700 transition-all"
              >
                Cancel
              </button>
            </div>
            <span className="text-zinc-700 text-xs hidden sm:block">↵ to add · esc to close</span>
          </div>
        </div>
      )}
    </div>
  );
}
