import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLoader } from '../context/LoaderContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import API from '../services/api';
import Swal from 'sweetalert2';
import '../components/Dashboard.css';

function IssuedBooksPage() {
  const [records, setRecords] = useState([]);
  const { showLoader, hideLoader } = useLoader();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const { ref: historyRef, inView: historyInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  const fetchRecords = useCallback(async () => {
    try {
      showLoader();
      const res = await API.get('/borrow/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRecords(res.data);
    } catch {
      Swal.fire('❌ Failed to fetch issued books', '', 'error');
    } finally {
      hideLoader();
    }
  }, [showLoader, hideLoader, setRecords]); // Dependencies for fetchRecords

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the record.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        showLoader();
        await API.delete(`/borrow/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        Swal.fire('✅ Deleted', 'Borrow record removed', 'success');
        fetchRecords();
      } catch {
        Swal.fire('❌ Failed to delete record', '', 'error');
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
      navigate('/login/admin');
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
        <h1 className="dashboard-title">📄 Issued Books Records</h1>
        <p className="dashboard-subtitle">Track and manage borrowed books</p>
      </motion.div>

      {/* History List Section */}
      <div ref={historyRef} className="history-section">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={historyInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="links-title"
        >
          🚀 Borrowing History
        </motion.h2>
        {records.length === 0 ? (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={historyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="no-records"
          >
            No issued records found.
          </motion.p>
        ) : (
          <div className="history-list">
            {records.map((r, i) => (
              <motion.div
                key={r.borrowId}
                initial={{ opacity: 0, y: 30 }}
                animate={historyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.5 }}
                className="history-card"
              >
                <h4>
                  <strong>{r.title || 'Book Removed'}</strong>{' '}
                  <span style={{ fontWeight: 'normal' }}>by</span>{' '}
                  <strong>{r.author || 'Unknown'}</strong>
                </h4>
                <p><strong>User:</strong> {r.username} ({r.email})</p>
                <p><strong>Issued:</strong> {r.borrowDate}</p>
                <p><strong>Returned:</strong> {r.returnDate || '— Not Returned —'}</p>
                <div className="history-actions">
                  <button className="btn btn-delete" onClick={() => handleDelete(r.borrowId)}>
                    🗑️ Delete
                  </button>
                </div>
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
          <p>Made with ❤️ by Anup Kumar</p>
        </div>
      </motion.footer>
    </div>
  );
}

export default IssuedBooksPage;