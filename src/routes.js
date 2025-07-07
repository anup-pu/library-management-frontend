import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
// import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import BorrowedBooks from './components/BorrowedBooks';
import AvailableBooksPage from './pages/AvailableBooksPage';
import MyBorrowsPage from './pages/MyBorrowsPage';
import AdminDashboard from './pages/AdminDashboard';
import AllBooksPage from './pages/AllBooksPage';
import AddBookPage from './pages/AddBookPage';
import IssuedBooksPage from './pages/IssuedBooksPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login/student" element={<Login role="STUDENT" />} />
      <Route path="/login/admin" element={<Login role="ADMIN" />} />
      {/* <Route path="/admin" element={<AdminDashboard />} /> */}
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/borrowed-books" element={<BorrowedBooks />} />
      <Route path="/books" element={<AvailableBooksPage />} />
      <Route path="/my-borrows" element={<MyBorrowsPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/books" element={<AllBooksPage />} />
      <Route path="/admin/add-book" element={<AddBookPage />} />
      <Route path="/admin/issued" element={<IssuedBooksPage />} />
    </Routes>
  );
}

export default AppRoutes;
