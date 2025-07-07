import { useState, useEffect } from 'react';
import API from '../services/api';
import Swal from 'sweetalert2';
import { useLoader } from '../context/LoaderContext'; // 👈 Import loader context
import './Page.css';

function AllBooksPage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const { showLoader, hideLoader } = useLoader(); // 👈 Hook for showing/hiding loader

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        showLoader();
        const res = await API.get('/books');
        setBooks(res.data);
      } catch {
        Swal.fire('❌ Load failed', '', 'error');
      } finally {
        hideLoader();
      }
    };
    fetchBooks();
  }, []);

  const toggle = async (id) => {
    try {
      showLoader();
      await API.put(`/books/toggle/${id}`);
      setBooks((prev) =>
        prev.map((book) =>
          book.id === id ? { ...book, available: !book.available } : book
        )
      );
    } catch {
      Swal.fire('❌ Toggle failed', '', 'error');
    } finally {
      hideLoader();
    }
  };

  const remove = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete Book?',
      text: 'This book will be removed permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        showLoader();
        await API.delete(`/books/${id}`);
        setBooks((prev) => prev.filter((book) => book.id !== id));
        Swal.fire('✅ Deleted!', '', 'success');
      } catch {
        Swal.fire('❌ Delete failed', '', 'error');
      } finally {
        hideLoader();
      }
    }
  };

  const filtered = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <h2 className="dashboard-title">📚 Manage All Books</h2>

      <input
        type="text"
        className="search-bar"
        placeholder="🔍 Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="book-list-grid">
        {filtered.map((book) => (
          <div key={book.id} className="book-card">
            <h4>{book.title}</h4>
            <p><strong>Author:</strong> {book.author}</p>
            <p>Status: {book.available ? '✅ Available' : '❌ Issued'}</p>
            <div className="book-actions">
              <button className="btn" onClick={() => toggle(book.id)}>
                {book.available ? 'Mark Unavailable' : 'Mark Available'}
              </button>
              <button className="btn btn-delete" onClick={() => remove(book.id)}>
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
