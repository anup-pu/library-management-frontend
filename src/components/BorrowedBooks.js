import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLoader } from '../context/LoaderContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import API from '../services/api';
import Swal from 'sweetalert2';
import './BookList.css';

function BorrowedBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const { showLoader, hideLoader } = useLoader();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const { ref: booksRef, inView: booksInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  const fetchBorrowedBooks = useCallback(async () => {
    try {
      showLoader();
      const res = await API.get('/borrow/my', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBorrowedBooks(res.data);
    } catch (error) {
      Swal.fire('❌ Could not fetch borrowed books', '', 'error');
    } finally {
      hideLoader();
    }
  }, [showLoader, hideLoader, setBorrowedBooks]);

  useEffect(() => {
    fetchBorrowedBooks();
  }, [fetchBorrowedBooks]);

  const returnBook = async (bookId) => {
    try {
      showLoader();
      await API.post(`/borrow/return/${bookId}`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      Swal.fire('✅ Book returned!', '', 'success');
      fetchBorrowedBooks();
    } catch {
      Swal.fire('❌ Return failed', '', 'error');
    } finally {
      hideLoader();
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
        <h1 className="dashboard-title">📚 My Borrowed Books</h1>
        <p className="dashboard-subtitle">Manage your borrowed books</p>
      </motion.div>

      {/* Book List Section */}
      <div ref={booksRef} className="book-list-section">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={booksInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-title"
        >
          🚀 Your Borrowed Collection
        </motion.h2>
        {borrowedBooks.length === 0 ? (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={booksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="no-records"
          >
            No borrowed books yet.
          </motion.p>
        ) : (
          <div className="book-list-grid">
            {borrowedBooks.map((borrow, i) => (
              <motion.div
                key={borrow.id}
                initial={{ opacity: 0, y: 30 }}
                animate={booksInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.5 }}
                className="book-card borrowed"
              >
                <h4>{borrow.book?.title || 'Book Removed'}</h4>
                <p><strong>Author:</strong> {borrow.book?.author || 'Unknown'}</p>
                <p><strong>Borrowed:</strong> {borrow.borrowDate}</p>
                {borrow.returnDate ? (
                  <p><strong>Returned:</strong> {borrow.returnDate}</p>
                ) : (
                  <div className="book-actions">
                    <button className="btn btn-return" onClick={() => returnBook(borrow.book.id)}>
                      Return Book
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
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
        </div>
      </motion.footer>
    </div>
  );
}

export default BorrowedBooks;