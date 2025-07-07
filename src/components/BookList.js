import './BookList.css';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toggleBookAvailability } from '../services/bookService';
import Swal from 'sweetalert2';
import { useLoader } from '../context/LoaderContext'; // 👈 import loader

function BookList({ books, setBooks }) {
  const { user } = useContext(AuthContext);
  const { showLoader, hideLoader } = useLoader(); // 👈 loader hook

  const handleToggle = async (id) => {
    try {
      showLoader(); // 👈 show loader before request
      await toggleBookAvailability(id);
      setBooks(prev =>
        prev.map(book =>
          book.id === id ? { ...book, available: !book.available } : book
        )
      );
    } catch (error) {
      Swal.fire('❌ Failed to update status', '', 'error');
    } finally {
      hideLoader(); // 👈 always hide loader
    }
  };

  return (
    <div className="book-list-grid">
      {books.map(book => (
        <div key={book.id} className="book-card">
          <h4>{book.title}</h4>
          <p><strong>Author:</strong> {book.author}</p>
          <p>
            <strong>Status:</strong>{' '}
            <span className={`status-badge ${!book.available ? 'status-unavailable' : ''}`}>
              {book.available ? 'Available' : 'Unavailable'}
            </span>
          </p>

          {user?.role === 'ADMIN' && (
            <button className="btn" onClick={() => handleToggle(book.id)}>
              {book.available ? 'Mark Unavailable' : 'Mark Available'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default BookList;
