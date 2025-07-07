import Swal from 'sweetalert2';
import { useState, useContext } from 'react';
import { login as loginAPI } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Login({ role }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login: saveLogin } = useContext(AuthContext); // ⬅ saves token & user
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // 🔄 Clear old session
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    try {
      const res = await loginAPI(identifier, password);

      if (res.data.role !== role) {
        Swal.fire({
          icon: 'warning',
          title: 'Access Denied',
          text: `Only ${role}s can log in here.`,
        });
        return;
      }

      // ✅ Save token & user via context
      saveLogin(res.data, res.data.token);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        timer: 1000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate(role === 'ADMIN' ? '/admin' : '/student');
      }, 1000);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid email/username or password',
      });
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>{role} Login</h2>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Email or Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" className="btn-primary">Login</button>
      </form>
    </div>
  );
}

export default Login;
