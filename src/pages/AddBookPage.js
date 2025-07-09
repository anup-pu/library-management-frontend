import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLoader } from '../context/LoaderContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import API from '../services/api';
import Swal from 'sweetalert2';
import '../components/Dashboard.css';

function AddBookPage() {
  const [form, setForm] = useState({ title: '', author: '', genre: '' });
  const { showLoader, hideLoader } = useLoader();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const { ref: formRef, inView: formInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  const handleLogout = () => {
    showLoader();
    setTimeout(() => {
      logout();
      hideLoader();
      navigate('/login/admin');
    }, 800);
  };

  const add = async (e) => {
    e.preventDefault();
    try {
      showLoader();
      await API.post('/books', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      Swal.fire('✅ Book added!', '', 'success');
      navigate('/admin/books');
    } catch {
      Swal.fire('❌ Failed to add book', '', 'error');
    } finally {
      hideLoader();
    }
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
        <h1 className="dashboard-title">➕ Add a New Book</h1>
        <p className="dashboard-subtitle">Grow your library with ease</p>
      </motion.div>

      {/* Form Section */}
      <div ref={formRef} className="form-section">
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={formInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          onSubmit={add}
          className="book-form"
        >
          {[
            { placeholder: '📖 Book Title', name: 'title' },
            { placeholder: '✍️ Author Name', name: 'author' },
            { placeholder: '🏷️ Genre', name: 'genre' }
          ].map((input, i) => (
            <motion.input
              key={i}
              type="text"
              placeholder={input.placeholder}
              required
              value={form[input.name]}
              onChange={(e) => setForm({ ...form, [input.name]: e.target.value })}
              initial={{ opacity: 0, x: -30 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.3 }}
            />
          ))}
          <motion.button
            type="submit"
            className="btn btn-primary"
            initial={{ opacity: 0, y: 30 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            Add Book
          </motion.button>
        </motion.form>
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

export default AddBookPage;