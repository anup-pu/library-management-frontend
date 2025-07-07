import { useEffect, useState } from 'react';
import API from '../services/api';
import Swal from 'sweetalert2';
import { useLoader } from '../context/LoaderContext'; // 👈 Import loader hook
import './AvailableBooksPage.css';

function AvailableBooksPage() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { showLoader, hideLoader } = useLoader(); // 👈 use loader

  const fetchBooks = async () => {
    try {
      showLoader(); // 👈 Show loader
      const res = await API.get('/books', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBooks(res.data);
    } catch {
      Swal.fire('❌ Failed to fetch books', '', 'error');
    } finally {
      hideLoader(); // 👈 Hide loader
    }
  };

  const borrowBook = async (bookId) => {
    try {
      showLoader(); // 👈 Show loader
      await API.post(`/borrow/${bookId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      Swal.fire('✅ Book borrowed!', '', 'success');
      fetchBooks();
    } catch {
      Swal.fire('❌ Could not borrow book', '', 'error');
    } finally {
      hideLoader(); // 👈 Hide loader
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="available-books-container">
      <h2>📚 All Books</h2>

      <input
        type="text"
        placeholder="🔍 Search by title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <div className="book-list-grid">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className={`book-card ${!book.available ? 'unavailable' : ''}`}
          >
            <h4>{book.title}</h4>
            <p>
              <strong>Author:</strong> {book.author}
            </p>
            <p>Status: {book.available ? '✅ Available' : '❌ Unavailable'}</p>

            <button
              className="btn"
              disabled={!book.available}
              onClick={() => borrowBook(book.id)}
            >
              Borrow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvailableBooksPage;
