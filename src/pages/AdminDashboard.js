import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLoader } from '../context/LoaderContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import '../components/Dashboard.css';

function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const { ref: linksRef, inView: linksInView } = useInView({ triggerOnce: true, threshold: 0.2 });

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
        <h1 className="dashboard-title">🛠️ Empower Your Library, {user?.username}</h1>
        <p className="dashboard-subtitle">Manage books and users effortlessly</p>
      </motion.div>

      {/* Dashboard Links Section */}
      <div ref={linksRef} className="dashboard-links-section">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={linksInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="links-title"
        >
        </motion.h2>
        <div className="dashboard-links-grid">
          {[
            { to: '/admin/books', title: '📘 Manage Books', desc: 'View, edit, delete & toggle availability' },
            { to: '/admin/add-book', title: '➕ Add Book', desc: 'Add a new book to the library' },
            { to: '/admin/issued', title: '🧾 Issued Books', desc: 'See who borrowed which book & when' }
          ].map((link, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={linksInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.5 }}
              className="dashboard-link-card"
            >
              <Link to={link.to}>
                <h3>{link.title}</h3>
                <p>{link.desc}</p>
              </Link>
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

export default AdminDashboard;