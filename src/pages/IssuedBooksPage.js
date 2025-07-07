import { useEffect, useState } from 'react';
import API from '../services/api';
import Swal from 'sweetalert2';
import './Page.css';

function IssuedBooksPage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = () => {
    API.get('/borrow/all', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => setRecords(res.data))
      .catch(() => Swal.fire('❌ Failed to fetch issued books', '', 'error'));
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the record.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await API.delete(`/borrow/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        Swal.fire('✅ Deleted', 'Borrow record removed', 'success');
        fetchRecords(); // refresh the list
      } catch (err) {
        Swal.fire('❌ Failed to delete record', '', 'error');
      }
    }
  };

  return (
    <div className="page-container">
      <h2 className="dashboard-title">📄 Issued Books Records</h2>

      {records.length === 0 ? (
        <p>No issued records found.</p>
      ) : (
        <div className="history-list">
          {records.map((r) => (
            <div key={r.id} className="history-card">
              <h4>
                <strong>{r.title || 'Book Removed'}</strong>{' '}
                <span style={{ fontWeight: 'normal' }}>by</span>{' '}
                <strong>{r.author || 'Unknown'}</strong>
              </h4>
              <p>
                <strong>User:</strong> {r.username} ({r.email})
              </p>
              <p>
                <strong>Issued:</strong> {r.borrowDate}
              </p>
              <p>
                <strong>Returned:</strong> {r.returnDate || '— Not Returned —'}
              </p>
              <button className="btn delete-btn" onClick={() => handleDelete(r.borrowId)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default IssuedBooksPage;
