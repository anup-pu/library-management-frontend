import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLoader } from '../context/LoaderContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import API from '../services/api';
import Swal from 'sweetalert2';
import '../components/Dashboard.css';

function AllBooksPage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const { showLoader, hideLoader } = useLoader();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const { ref: searchRef, inView: searchInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: booksRef, inView: booksInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

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

  const handleLogout = () => {
    showLoader();
    setTimeout(() => {
      logout();
      hideLoader();
      navigate('/login/admin');
    }, 800);
  };

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
        <h1 className="dashboard-title">📚 Manage All Books</h1>
        <p className="dashboard-subtitle">Control your library inventory</p>
      </motion.div>

      {/* Search Bar */}
      <div ref={searchRef} className="search-section">
        <motion.input
          type="text"
          className="search-bar"
          placeholder="🔍 Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          initial={{ opacity: 0, x: -30 }}
          animate={searchInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* Book List Section */}
      <div ref={booksRef} className="book-list-section">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={booksInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="links-title"
        >
          🚀 Your Library Collection
        </motion.h2>
        <div className="book-list-grid">
          {filtered.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              animate={booksInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.5 }}
              className="book-card"
            >
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
            </motion.div>
          ))}
        </div>
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

export default AllBooksPage;