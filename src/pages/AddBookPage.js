import { useState } from 'react';
import API from '../services/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './Page.css';

function AddBookPage() {
  const [form, setForm] = useState({ title: '', author: '', genre: '' });
  const nav = useNavigate();

  const add = (e) => {
    e.preventDefault();
    API.post('/books', form, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(() => {
        Swal.fire('✅ Book added!', '', 'success');
        nav('/admin/books');
      })
      .catch(() => Swal.fire('❌ Failed to add book', '', 'error'));
  };

  return (
    <div className="page-container">
      <h2 className="dashboard-title">➕ Add New Book</h2>
      <form onSubmit={add} className="book-form">
        <input
          type="text"
          placeholder="📖 Book Title"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="✍️ Author Name"
          required
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />
        <input
          type="text"
          placeholder="🏷️ Genre"
          required
          value={form.genre}
          onChange={(e) => setForm({ ...form, genre: e.target.value })}
        />
        <button type="submit" className="btn btn-primary">Add Book</button>
      </form>
    </div>
  );
}

export default AddBookPage;
