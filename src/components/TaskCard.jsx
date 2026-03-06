import { useState } from "react";

// Edit pencil icon
function EditIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

// Trash icon
function TrashIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

/**
 * TaskCard — displays a single task with toggle, inline edit, and delete.
 *
 * Props:
 *   task      : { $id, title, description, completed }
 *   onToggle  : (id, completed) => void
 *   onDelete  : (id) => void
 *   onEdit    : (id, { title, description }) => void
 */
export default function TaskCard({ task, onToggle, onDelete, onEdit }) {
  const [editing, setEditing]   = useState(false);
  const [title, setTitle]       = useState(task.taskName);
  const [desc, setDesc]         = useState(task.description || "");
  const [saving, setSaving]     = useState(false);
  const [confirming, setConfirm] = useState(false); // delete confirmation

  // ── Save edited task ──────────────────────────────────────────
  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    await onEdit(task.$id, { title: title.trim(), description: desc.trim() });
    setSaving(false);
    setEditing(false);
  };

  // ── Cancel edit — restore original values ────────────────────
  const handleCancelEdit = () => {
    setTitle(task.taskName);
    setDesc(task.description || "");
    setEditing(false);
  };

  // ── Keyboard shortcuts in edit mode ─────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSave(); }
    if (e.key === "Escape") handleCancelEdit();
  };

  return (
    <div
      className={`group flex items-start gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 ${
        task.completed
          ? "border-zinc-800/40 bg-transparent opacity-50"
          : "border-zinc-800 bg-[#18181b] hover:border-zinc-700"
      }`}
    >
      {/* ── Circular checkbox ───────────────────────────────── */}
      <button
        onClick={() => onToggle(task.$id, !task.completed)}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
          task.completed
            ? "bg-amber-400 border-amber-400"
            : "border-zinc-600 hover:border-amber-400"
        }`}
      >
        {task.completed && (
          <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* ── Content area ────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {editing ? (
          /* Edit mode */
          <div>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Task title"
              className="w-full bg-zinc-900 border border-zinc-600 focus:border-amber-400 text-white text-sm rounded-lg px-3 py-1.5 mb-2 focus:outline-none transition-colors"
            />
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Description (optional)"
              rows={2}
              className="w-full bg-zinc-900 border border-zinc-600 focus:border-amber-400 text-zinc-300 text-xs rounded-lg px-3 py-1.5 mb-3 focus:outline-none resize-none transition-colors"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={saving || !title.trim()}
                className="bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-black text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {saving && <span className="w-3 h-3 border border-black/30 border-t-black rounded-full animate-spin" />}
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-zinc-500 hover:text-white text-xs px-2 py-1.5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <span className="text-zinc-700 text-xs ml-auto">↵ save · esc cancel</span>
            </div>
          </div>
        ) : (
          /* View mode */
          <>
            <p className={`text-sm font-medium leading-snug ${task.completed ? "line-through text-zinc-500" : "text-white"}`}>
              {task.taskName}
            </p>
            {task.description && (
              <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed line-clamp-2">
                {task.description}
              </p>
            )}
          </>
        )}
      </div>

      {/* ── Action buttons (hover reveal) ───────────────────── */}
      {!editing && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {/* Edit */}
          <button
            onClick={() => setEditing(true)}
            aria-label="Edit task"
            className="p-1.5 text-zinc-500 hover:text-amber-400 rounded-lg hover:bg-zinc-800 transition-all"
          >
            <EditIcon />
          </button>

          {/* Delete — two-step confirmation */}
          {confirming ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDelete(task.$id)}
                className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-zinc-800 transition-all font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirm(false)}
                className="text-xs text-zinc-500 hover:text-white px-1.5 py-1 rounded-lg transition-all"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirm(true)}
              aria-label="Delete task"
              className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-zinc-800 transition-all"
            >
              <TrashIcon />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
