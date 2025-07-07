import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLoader } from '../context/LoaderContext'; // 👈 import loader
import '../components/Dashboard.css';

function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const { showLoader, hideLoader } = useLoader(); // 👈 use loader
  const navigate = useNavigate();

  const handleLogout = () => {
    showLoader(); // 👈 show loader
    setTimeout(() => {
      logout();
      hideLoader(); // 👈 hide loader after logout
      navigate('/login/admin');
    }, 800); // optional delay to show loader briefly
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          🛠️ Welcome to Admin Dashboard {user?.username}
        </h2>
        <button className="btn-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <div className="dashboard-links-grid">
        <Link to="/admin/books" className="dashboard-link-card">
          📘 Manage Books
          <p>View, edit, delete & toggle availability</p>
        </Link>

        <Link to="/admin/add-book" className="dashboard-link-card">
          ➕ Add Book
          <p>Add a new book to the library</p>
        </Link>

        <Link to="/admin/issued" className="dashboard-link-card">
          🧾 Issued Books
          <p>See who borrowed which book & when</p>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
