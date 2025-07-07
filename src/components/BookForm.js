import { useState } from 'react';
import { addBook } from '../services/bookService';
import { useLoader } from '../context/LoaderContext'; // 👈 import loader

function BookForm({ setBooks }) {
  const [form, setForm] = useState({ title: '', author: '', genre: '' });
  const [message, setMessage] = useState('');
  const { showLoader, hideLoader } = useLoader(); // 👈 use loader

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.genre) {
      setMessage('❌ All fields are required');
      return;
    }
    try {
      showLoader(); // 👈 show loader before request
      const res = await addBook(form);
      setBooks(prev => [...prev, res.data]);
      setForm({ title: '', author: '', genre: '' });
      setMessage('✅ Book added successfully!');
    } catch (err) {
      setMessage('❌ Failed to add book');
    } finally {
      hideLoader(); // 👈 always hide loader
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Book</h3>
      {message && <p>{message}</p>}
      <input
        placeholder="Title"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
      />
      <input
        placeholder="Author"
        value={form.author}
        onChange={e => setForm({ ...form, author: e.target.value })}
      />
      <input
        placeholder="Genre"
        value={form.genre}
        onChange={e => setForm({ ...form, genre: e.target.value })}
      />
      <button type="submit">Add Book</button>
    </form>
  );
}

export default BookForm;
