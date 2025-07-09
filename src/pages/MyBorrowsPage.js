import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLoader } from '../context/LoaderContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import API from '../services/api';
import Swal from 'sweetalert2';
import '../components/Dashboard.css';

function MyBorrowsPage() {
  const [borrows, setBorrows] = useState([]);
  const { showLoader, hideLoader } = useLoader();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const { ref: currentRef, inView: currentInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: historyRef, inView: historyInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

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
      hideLoader();
    }
  }, [showLoader, hideLoader, setBorrows]); // Added setBorrows to dependencies

  useEffect(() => {
    fetchBorrows();
  }, []); // Added fetchBorrows to dependencies

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
    } finally {
      hideLoader();
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
      } finally {
        hideLoader();
      }
    }
  };

  const handleLogout = () => {
    showLoader();
    setTimeout(() => {
      logout();
      hideLoader();
      navigate('/login/student');
    }, 800);
  };

  const current = borrows.filter((b) => !b.returnDate);
  const history = borrows.filter((b) => b.returnDate);

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="navbar"
      >
        <div className="logo" onClick={() => navigate('/')}>📘 BorrowBuddy</div>
        <div>
          <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </motion.nav>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1 className="dashboard-title">🕮 My Borrowed Books</h1>
        <p className="dashboard-subtitle">View and manage your borrowing history</p>
      </motion.div>

      {/* Currently Borrowed Section */}
      <div ref={currentRef} className="book-list-section">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={currentInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-title"
        >
          📘 Currently Borrowed
        </motion.h2>
        {current.length ? (
          <div className="book-list-grid">
            {current.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 30 }}
                animate={currentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.5 }}
                className="book-card borrowed"
              >
                <h4>{b.book?.title || 'Book Removed'}</h4>
                <p><strong>Issue Date:</strong> {b.borrowDate}</p>
                <div className="book-actions">
                  {b.book && (
                    <button className="btn btn-return" onClick={() => returnBook(b.book.id)}>
                      Return Book
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={currentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="no-records"
          >
            No active borrows.
          </motion.p>
        )}
      </div>

      {/* Borrow History Section */}
      <div ref={historyRef} className="history-section">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={historyInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-title"
        >
          📗 Borrow History
        </motion.h2>
        {history.length ? (
          <div className="history-list">
            {history.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 30 }}
                animate={historyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.5 }}
                className="history-card"
              >
                <h4>{b.book?.title || 'Book Removed'}</h4>
                <p><strong>Issued:</strong> {b.borrowDate}</p>
                <p><strong>Returned:</strong> {b.returnDate}</p>
                <div className="history-actions">
                  <button className="btn btn-delete" onClick={() => handleDelete(b.id)}>
                    🗑️ Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={historyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="no-records"
          >
            No borrow history.
          </motion.p>
        )}
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="footer"
      >
        <div className="footer-content">
          <p>BorrowBuddy: Empowering seamless library experiences.</p>
          <div className="contact-info">
            <a href="kanup1541@gmail.com">📧 kanup1541@gmail.com</a>
            <a href="+91 8529507224">📞 +91 8529507224</a>
            <a href="https://www.linkedin.com/in/anup-kumar-337a3324a/">🔗 LinkedIn</a>
          </div>
          <p>© 2025 BorrowBuddy | All Rights Reserved</p>
          <p>Made with ❤️ by Anup Kumar</p>
        </div>
      </motion.footer>
    </div>
  );
}

export default MyBorrowsPage;