import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../components/Dashboard.css';

function AdminDashboard() {
  const { user, logout } = useContext(AuthContext); // ✅ get user
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login/admin');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          🛠️ Welcome to Admin Dashboard {user?.username}
        </h2>
        <button className="btn-logout" onClick={handleLogout}>🚪 Logout</button>
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
