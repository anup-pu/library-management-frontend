import { useEffect, useState } from 'react';
import API from '../services/api';
import Swal from 'sweetalert2';
import { useLoader } from '../context/LoaderContext'; // 👈 import loader
import './BookList.css';

function BorrowedBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const { showLoader, hideLoader } = useLoader(); // 👈 use loader

  const fetchBorrowedBooks = async () => {
    try {
      showLoader(); // 👈 show loading while fetching
      const res = await API.get('/borrow/my');
      setBorrowedBooks(res.data);
    } catch (error) {
      Swal.fire('❌ Could not fetch borrowed books', '', 'error');
    } finally {
      hideLoader(); // 👈 hide after fetch
    }
  };

  const returnBook = async (bookId) => {
    try {
      showLoader(); // 👈 show loader while returning
      await API.post(`/borrow/return/${bookId}`);
      Swal.fire('✅ Book returned!', '', 'success');
      fetchBorrowedBooks();
    } catch {
      Swal.fire('❌ Return failed', '', 'error');
      hideLoader(); // in case fetchBorrowedBooks not called
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📚 My Borrowed Books</h2>
      {borrowedBooks.length === 0 ? (
        <p>No borrowed books yet.</p>
      ) : (
        <div className="book-list-grid">
          {borrowedBooks.map((borrow) => (
            <div key={borrow.id} className="book-card">
              <h4>{borrow.book.title}</h4>
              <p><strong>Author:</strong> {borrow.book.author}</p>
              <p><strong>Borrowed:</strong> {borrow.borrowDate}</p>
              {borrow.returnDate ? (
                <p><strong>Returned:</strong> {borrow.returnDate}</p>
              ) : (
                <button className="btn" onClick={() => returnBook(borrow.book.id)}>Return</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BorrowedBooks;
