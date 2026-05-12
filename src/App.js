import { useState, useEffect } from 'react';

const API = 'http://localhost:5000/todos';

const FILTERS = ['All', 'Active', 'Completed'];
const PRIORITIES = ['low', 'medium', 'high'];

const priorityColor = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };
const priorityBg = { low: '#dcfce7', medium: '#fef3c7', high: '#fee2e2' };

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch(API).then(r => r.json()).then(setTodos);
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, priority }),
    });
    const todo = await res.json();
    setTodos([...todos, todo]);
    setText('');
  };

  const toggleTodo = async (id) => {
    const res = await fetch(`${API}/${id}`, { method: 'PUT' });
    const updated = await res.json();
    setTodos(todos.map(t => t.id === id ? updated : t));
  };

  const deleteTodo = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    setTodos(todos.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    todos.filter(t => t.completed).forEach(t => deleteTodo(t.id));
  };

  const filtered = todos.filter(t =>
    filter === 'All' ? true : filter === 'Active' ? !t.completed : t.completed
  );

  const completed = todos.filter(t => t.completed).length;
  const progress = todos.length ? Math.round((completed / todos.length) * 100) : 0;

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Header */}
        <div style={s.header}>
          <h1 style={s.title}>✅ My Tasks</h1>
          <p style={s.subtitle}>{completed} of {todos.length} completed</p>
        </div>

        {/* Progress Bar */}
        <div style={s.progressWrap}>
          <div style={{ ...s.progressBar, width: `${progress}%` }} />
        </div>

        {/* Add Form */}
        <form onSubmit={addTodo} style={s.form}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What needs to be done?"
            style={s.input}
          />
          <select value={priority} onChange={e => setPriority(e.target.value)} style={s.select}>
            {PRIORITIES.map(p => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
          <button type="submit" style={s.addBtn}>+ Add</button>
        </form>

        {/* Filter Tabs */}
        <div style={s.tabs}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ ...s.tab, ...(filter === f ? s.tabActive : {}) }}>
              {f}
              <span style={s.badge}>
                {f === 'All' ? todos.length : f === 'Active' ? todos.filter(t => !t.completed).length : completed}
              </span>
            </button>
          ))}
        </div>

        {/* Todo List */}
        <ul style={s.list}>
          {filtered.length === 0 && (
            <li style={s.empty}>
              {filter === 'Completed' ? '🎉 No completed tasks yet!' : '📝 Nothing here. Add a task above!'}
            </li>
          )}
          {filtered.map(todo => (
            <li key={todo.id} style={{ ...s.item, opacity: todo.completed ? 0.6 : 1 }}>
              <button onClick={() => toggleTodo(todo.id)} style={s.checkBtn}>
                {todo.completed ? '✅' : '⬜'}
              </button>
              <span style={{ ...s.text, textDecoration: todo.completed ? 'line-through' : 'none' }}>
                {todo.text}
              </span>
              <span style={{ ...s.priorityTag, background: priorityBg[todo.priority], color: priorityColor[todo.priority] }}>
                {todo.priority}
              </span>
              <button onClick={() => deleteTodo(todo.id)} style={s.deleteBtn}>🗑</button>
            </li>
          ))}
        </ul>

        {/* Footer */}
        {completed > 0 && (
          <div style={s.footer}>
            <button onClick={clearCompleted} style={s.clearBtn}>Clear Completed ({completed})</button>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: "'Segoe UI', sans-serif" },
  card: { background: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: 520, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  header: { marginBottom: 12 },
  title: { margin: 0, fontSize: 28, fontWeight: 700, color: '#1e1b4b' },
  subtitle: { margin: '4px 0 0', color: '#6b7280', fontSize: 14 },
  progressWrap: { height: 6, background: '#e5e7eb', borderRadius: 99, marginBottom: 24, overflow: 'hidden' },
  progressBar: { height: '100%', background: 'linear-gradient(90deg, #667eea, #764ba2)', borderRadius: 99, transition: 'width 0.4s ease' },
  form: { display: 'flex', gap: 8, marginBottom: 20 },
  input: { flex: 1, padding: '10px 14px', fontSize: 15, border: '2px solid #e5e7eb', borderRadius: 10, outline: 'none', transition: 'border 0.2s' },
  select: { padding: '10px 8px', border: '2px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', cursor: 'pointer', background: '#fff' },
  addBtn: { padding: '10px 18px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap' },
  tabs: { display: 'flex', gap: 8, marginBottom: 16 },
  tab: { flex: 1, padding: '8px 0', border: '2px solid #e5e7eb', borderRadius: 10, background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
  tabActive: { borderColor: '#667eea', color: '#667eea', background: '#eef2ff' },
  badge: { background: '#e5e7eb', borderRadius: 99, padding: '1px 7px', fontSize: 12, fontWeight: 700 },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  item: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', marginBottom: 8, background: '#f9fafb', borderRadius: 12, border: '1px solid #f3f4f6', transition: 'all 0.2s' },
  checkBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, padding: 0, lineHeight: 1 },
  text: { flex: 1, fontSize: 15, color: '#374151' },
  priorityTag: { fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: 0.5 },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 0, opacity: 0.5 },
  empty: { textAlign: 'center', color: '#9ca3af', padding: '32px 0', fontSize: 15 },
  footer: { marginTop: 16, textAlign: 'center' },
  clearBtn: { background: 'none', border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 16px', color: '#9ca3af', cursor: 'pointer', fontSize: 13 },
};
