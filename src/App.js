import { useState, useEffect } from 'react';

const API = 'http://localhost:5000/todos';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    fetch(API).then(r => r.json()).then(setTodos);
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
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

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Todo App</h1>
      <form onSubmit={addTodo} style={styles.form}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add a new todo..."
          style={styles.input}
        />
        <button type="submit" style={styles.addBtn}>Add</button>
      </form>
      <ul style={styles.list}>
        {todos.map(todo => (
          <li key={todo.id} style={styles.item}>
            <span
              onClick={() => toggleTodo(todo.id)}
              style={{ ...styles.text, textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#aaa' : '#333' }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)} style={styles.deleteBtn}>✕</button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && <p style={styles.empty}>No todos yet. Add one above!</p>}
    </div>
  );
}

const styles = {
  container: { maxWidth: 480, margin: '60px auto', fontFamily: 'sans-serif', padding: '0 16px' },
  title: { textAlign: 'center', color: '#333' },
  form: { display: 'flex', gap: 8, marginBottom: 24 },
  input: { flex: 1, padding: '10px 14px', fontSize: 16, border: '1px solid #ddd', borderRadius: 6, outline: 'none' },
  addBtn: { padding: '10px 18px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 16 },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  item: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', marginBottom: 8, background: '#f9f9f9', borderRadius: 6, border: '1px solid #eee' },
  text: { cursor: 'pointer', fontSize: 16, flex: 1 },
  deleteBtn: { background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: 18, padding: '0 4px' },
  empty: { textAlign: 'center', color: '#aaa' },
};
