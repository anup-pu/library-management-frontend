import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Make sure this file exists

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">📚 Library Management System</h1>
      <p className="home-subtitle">Manage your library with ease</p>
      <div className="home-options">
        <div className="card" onClick={() => navigate('/signup')}>
          <h2>📝 Register</h2>
          <p>Create an account as a Student or Admin</p>
        </div>

        <div className="card" onClick={() => navigate('/login/student')}>
          <h2>🎓 Student Login</h2>
          <p>Access books and borrow records</p>
        </div>

        <div className="card" onClick={() => navigate('/login/admin')}>
          <h2>🛠️ Admin Login</h2>
          <p>Manage books and student borrowings</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
