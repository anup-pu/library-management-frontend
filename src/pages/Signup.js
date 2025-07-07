import Swal from 'sweetalert2';
import { useState } from 'react';
import { signup } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'STUDENT' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Signup</h2>
        <input placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="STUDENT">Student</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
