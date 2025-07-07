import { useState, useEffect } from 'react';
import API from '../services/api';
import Swal from 'sweetalert2';
import './Page.css';

function AllBooksPage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('/books')
      .then(res => setBooks(res.data))
      .catch(() => Swal.fire('❌ Load failed', '', 'error'));
  }, []);

  const toggle = id =>
    API.put(`/books/toggle/${id}`)
      .then(() =>
        setBooks(b => b.map(x => (x.id === id ? { ...x, available: !x.available } : x)))
      )
      .catch(() => Swal.fire('❌ Toggle failed', '', 'error'));

  const remove = id =>
    API.delete(`/books/${id}`)
      .then(() => setBooks(b => b.filter(x => x.id !== id)))
      .catch(() => Swal.fire('❌ Delete failed', '', 'error'));

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <h2 className="dashboard-title">📚 Manage All Books</h2>

      <input
        type="text"
        className="search-bar"
        placeholder="🔍 Search by title..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="book-list-grid">
        {filtered.map(b => (
          <div key={b.id} className="book-card">
            <h4>{b.title}</h4>
            <p><strong>Author:</strong> {b.author}</p>
            <p>Status: {b.available ? '✅ Available' : '❌ Issued'}</p>
            <div className="book-actions">
              <button className="btn" onClick={() => toggle(b.id)}>
                {b.available ? 'Mark Unavailable' : 'Mark Available'}
              </button>
              <button className="btn btn-delete" onClick={() => remove(b.id)}>
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllBooksPage;
