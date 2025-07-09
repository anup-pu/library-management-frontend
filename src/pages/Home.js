import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Home.css';
import tagoreImg from '../assets/tagore.png';

function Home() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  // Intersection Observer hooks for scroll-triggered animations
  const { ref: benefitsRef, inView: benefitsInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: easeRef, inView: easeInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  const benefits = [
    { icon: '🔍', title: 'Effortless Book Search', desc: 'Quickly find books by title, author, or genre.' },
    { icon: '📚', title: 'One-Click Borrowing', desc: 'Borrow books instantly from your dashboard.' },
    { icon: '📖', title: 'Track Your Reading', desc: 'Monitor borrowed books and due dates.' },
    { icon: '⏳', title: 'Stay Ahead of Deadlines', desc: 'Never miss a return with reminders.' },
    { icon: '🧹', title: 'Control Your History', desc: 'Clean up your dashboard by deleting old records.' }
  ];

  const easeOfUse = [
    { title: 'Intuitive Interface', desc: 'Navigate with ease using our clean, user-friendly design.' },
    { title: 'Fast Access', desc: 'Get to your books and records in just a few clicks.' },
    { title: 'Seamless Experience', desc: 'Enjoy a smooth, distraction-free borrowing process.' }
  ];

  return (
    <div className="home-container">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="navbar"
      >
        <div className="logo" onClick={() => navigate('/')}>📘 BorrowBuddy</div>
        <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </motion.nav>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1 className="home-title">Welcome to BorrowBuddy</h1>
        <p className="home-subtitle">Your smart digital library companion</p>
      </motion.div>

      {/* Login/Register Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="home-options"
      >
        {[
          { title: '📝 Register', desc: 'Create an account as a Student or Admin', path: '/signup' },
          { title: '🎓 Student Login', desc: 'Access books and borrow records', path: '/login/student' },
          { title: '🛠️ Admin Login', desc: 'Manage books and student borrowings', path: '/login/admin' }
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 + i * 0.2 }}
            className="card"
            onClick={() => navigate(card.path)}
          >
            <h2>{card.title}</h2>
            <p>{card.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Functionalities Section */}
      <div ref={benefitsRef} className="benefits-section">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="benefits-title"
        >
          🚀 Discover Your Library Superpowers
        </motion.h2>
        <div className="benefits-grid">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.5 }}
              className="benefit-card"
            >
              <div className="benefit-icon">{b.icon}</div>
              <h3>{b.title}</h3>
              <p>{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ease of Use Section */}
      <div ref={easeRef} className="ease-section">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={easeInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="ease-title"
        >
          🌟 Borrow Smarter, Stress Less
        </motion.h2>
        <div className="ease-grid">
          {easeOfUse.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={easeInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.5 }}
              className="ease-card"
            >
              <h3>{e.title}</h3>
              <p>{e.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quote Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="quote-section"
      >
        <img src={tagoreImg} alt="Inspiration" className="tagore-img" />
        <div className="quote-text">
          <p className="quote">“Success is not the absence of obstacles, but the courage to push through them.”</p>
          <p className="quote-author">— Rabindranath Tagore</p>
        </div>
      </motion.div>

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

export default Home;