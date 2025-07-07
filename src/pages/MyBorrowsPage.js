import { useEffect, useState, useCallback } from 'react';
import API from '../services/api';
import Swal from 'sweetalert2';
import { useLoader } from '../context/LoaderContext';
import './Page.css';

function MyBorrowsPage() {
  const [borrows, setBorrows] = useState([]);
  const { showLoader, hideLoader } = useLoader();

  const fetchBorrows = useCallback(async () => {
    showLoader();
    try {
      const res = await API.get('/borrow/my', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBorrows(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire('❌ Failed to load borrows', '', 'error');
    } finally {
      hideLoader(); // ✅ Ensures loader stops
    }
  }, [showLoader, hideLoader]);

  useEffect(() => {
    fetchBorrows();
  }, []);

  const returnBook = async (bookId) => {
    showLoader();
    try {
      await API.post(`/borrow/return/${bookId}`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      Swal.fire('✅ Book returned!', '', 'success');
      fetchBorrows();
    } catch (err) {
      console.error(err);
      Swal.fire('❌ Return failed', '', 'error');
      hideLoader(); // ✅ Important fallback
    }
  };

  const handleDelete = async (borrowId) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete this borrow record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      showLoader();
      try {
        await API.delete(`/borrow/my/delete/${borrowId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        Swal.fire('✅ Record deleted!', '', 'success');
        fetchBorrows();
      } catch (err) {
        console.error(err);
        Swal.fire('❌ Delete failed', '', 'error');
        hideLoader(); // ✅ Important fallback
      }
    }
  };

  const current = borrows.filter((b) => !b.returnDate);
  const history = borrows.filter((b) => b.returnDate);

  return (
    <div className="page-container">
      <h2 className="dashboard-title">🕮 My Borrowed Books</h2>

      <section>
        <h3 className="section-title">📘 Currently Borrowed</h3>
        {current.length ? (
          <div className="book-list-grid">
            {current.map((b) => (
              <div key={b.id} className="book-card borrowed">
                <h4>{b.book?.title || 'Book Removed'}</h4>
                <p><strong>Issue Date:</strong> {b.borrowDate}</p>
                {b.book && (
                  <button className="btn-return" onClick={() => returnBook(b.book.id)}>
                    Return Book
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No active borrows.</p>
        )}
      </section>

      <section>
        <h3 className="section-title">📗 Borrow History</h3>
        {history.length ? (
          <div className="history-list">
            {history.map((b) => (
              <div key={b.id} className="history-card">
                <h4>{b.book?.title || 'Book Removed'}</h4>
                <p><strong>Issued:</strong> {b.borrowDate}</p>
                <p><strong>Returned:</strong> {b.returnDate}</p>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(b.id)}
                  style={{
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    marginTop: '8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No borrow history.</p>
        )}
      </section>
    </div>
  );
}

export default MyBorrowsPage;
