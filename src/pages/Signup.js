import Swal from 'sweetalert2';
import { useState } from 'react';
import { signup } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { useLoader } from '../context/LoaderContext'; // 👈 import

function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'STUDENT' });
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader(); // 👈 useLoader hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader(); // 👈 Show loader
    try {
      await signup(form);
      Swal.fire({
        icon: 'success',
        title: 'Signup Successful',
        text: 'Redirecting to login...',
        timer: 1500,
        showConfirmButton: false,
      });
      setTimeout(() => navigate(`/login/${form.role.toLowerCase()}`), 1500);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: 'User already exists with that email or username',
      });
    } finally {
      hideLoader(); // 👈 Always hide loader
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Signup</h2>
        <input name="username" placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input name="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input name="password" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select name="role" onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="STUDENT">Student</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
