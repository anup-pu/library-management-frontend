import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLoader } from '../context/LoaderContext'; // 👈 import useLoader
import './Dashboard.css';

function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);
  const { showLoader, hideLoader } = useLoader(); // 👈 useLoader hook
  const navigate = useNavigate();

  const handleLogout = () => {
    showLoader(); // 👈 show loader
    setTimeout(() => {
      logout();
      hideLoader(); // 👈 hide after logout
      navigate('/login/student');
    }, 800);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          🎓 Welcome to Student Dashboard {user?.username}
        </h2>
        <button className="btn-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <div className="dashboard-links-grid">
        <Link to="/books" className="dashboard-link-card">
          📚 Browse Books
          <p>Search and borrow books</p>
        </Link>

        <Link to="/my-borrows" className="dashboard-link-card">
          🕮 My Borrows
          <p>View your current & past borrowings</p>
        </Link>
      </div>
    </div>
  );
}

export default StudentDashboard;
