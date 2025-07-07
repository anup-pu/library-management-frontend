import API from './api';

export const getAllBooks = () => API.get('/books');
export const getAvailableBooks = () => API.get('/books/available');
export const addBook = (book) => API.post('/books', book);
export const updateBook = (id, book) => API.put(`/books/${id}`, book);
export const deleteBook = (id) => API.delete(`/books/${id}`);
export const toggleBookAvailability = (id) => API.put(`/books/toggle/${id}`);
