import { useEffect, useState } from 'react';
import API from '../services/api';
import Swal from 'sweetalert2';
import './AvailableBooksPage.css';

function AvailableBooksPage() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBooks = async () => {
    try {
      const res = await API.get('/books', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBooks(res.data);
    } catch (err) {
      Swal.fire('❌ Failed to fetch books', '', 'error');
    }
  };

  const borrowBook = async (bookId) => {
    try {
      await API.post(`/borrow/${bookId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      Swal.fire('✅ Book borrowed!', '', 'success');
      fetchBooks();
    } catch (err) {
      Swal.fire('❌ Could not borrow book', '', 'error');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book =>
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
        {filteredBooks.map(book => (
          <div key={book.id} className={`book-card ${!book.available ? 'unavailable' : ''}`}>
            <h4>{book.title}</h4>
            <p><strong>Author:</strong> {book.author}</p>
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
