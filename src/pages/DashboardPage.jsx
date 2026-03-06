import { useState, useEffect } from "react";
import { taskService } from "../appwrite/tasks";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";

export default function DashboardPage({ user, onLogout }) {
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding]   = useState(false);
  const [filter, setFilter]   = useState("all");

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    try {
      const res = await taskService.getAll(user.$id);
      setTasks(res.documents);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAdd = async (title, description) => {
    setAdding(true);
    try {
      const task = await taskService.create(title, description, user.$id);
      setTasks((prev) => [task, ...prev]);
    } finally { setAdding(false); }
  };

  const handleToggle = async (id, completed) => {
    setTasks((prev) => prev.map((t) => t.$id === id ? { ...t, completed } : t));
    try { await taskService.update(id, { completed }); }
    catch { setTasks((prev) => prev.map((t) => t.$id === id ? { ...t, completed: !completed } : t)); }
  };

  const handleEdit = async (id, data) => {
    const orig = tasks.find((t) => t.$id === id);
    // Optimistic update — map title → taskName so UI reflects immediately
    setTasks((all) => all.map((t) =>
      t.$id === id ? { ...t, taskName: data.title, title: data.title, description: data.description } : t
    ));
    try { await taskService.updateTask(id, data); }
    catch {
      // Rollback on failure
      setTasks((all) => all.map((t) => t.$id === id ? { ...t, ...orig } : t));
      console.error("Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    setTasks((prev) => prev.filter((t) => t.$id !== id));
    try { await taskService.delete(id); }
    catch { console.error("Delete failed"); }
  };

  const clearCompleted = () => tasks.filter((t) => t.completed).forEach((t) => handleDelete(t.$id));

  const total    = tasks.length;
  const done     = tasks.filter((t) => t.completed).length;
  const active   = total - done;
  const pct      = total ? Math.round((done / total) * 100) : 0;
  const filtered = tasks.filter((t) =>
    filter === "active" ? !t.completed : filter === "done" ? t.completed : true
  );

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white">
      <Navbar user={user} onLogout={onLogout} taskStats={{ total, done }} />

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="flex items-end justify-between mb-1">
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Georgia', serif" }}>My Tasks</h1>
            {total > 0 && <span className="text-zinc-500 text-sm">{pct}% complete</span>}
          </div>
          <p className="text-zinc-600 text-sm mb-4">
            {total === 0 ? "No tasks yet — add one below" : `${done} done · ${active} remaining`}
          </p>
          {total > 0 && (
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          )}
        </div>

        <div className="flex gap-1 mb-6 bg-zinc-900 border border-zinc-800 rounded-xl p-1 w-fit">
          {[{ key:"all", label:"All", count:total }, { key:"active", label:"Active", count:active }, { key:"done", label:"Done", count:done }]
            .map(({ key, label, count }) => (
              <button key={key} onClick={() => setFilter(key)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === key ? "bg-[#18181b] text-white shadow" : "text-zinc-500 hover:text-zinc-300"}`}>
                {label}
                {count > 0 && <span className={`text-xs rounded-full px-1.5 ${filter === key ? "bg-zinc-700 text-zinc-300" : "bg-zinc-800 text-zinc-500"}`}>{count}</span>}
              </button>
            ))}
        </div>

        <TaskForm onAdd={handleAdd} loading={adding} />

        {loading ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-600 text-sm">Loading tasks…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-zinc-600">
            <div className="text-5xl mb-4">{filter === "done" ? "🎉" : filter === "active" ? "✅" : "📋"}</div>
            <p className="text-sm">{filter === "done" ? "No completed tasks yet" : filter === "active" ? "No active tasks — all done!" : "No tasks yet. Add one above!"}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((task) => (
              <TaskCard key={task.$id} task={task} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} />
            ))}
          </div>
        )}

        {done > 0 && (
          <div className="mt-8 flex justify-end">
            <button onClick={clearCompleted} className="text-xs text-zinc-600 hover:text-red-400 transition-colors">
              Clear completed ({done})
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
