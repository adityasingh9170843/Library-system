import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { api } from '../../api'

export default function BooksReport() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    api('/reports/books').then(setRows).catch(e => setError(e.message))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/logged-out')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="sidebar-layout">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">Reports</div>
        <nav className="sidebar-menu">
          <a
            onClick={() => navigate('/reports/books')}
            className={`sidebar-item ${isActive('/reports/books') ? 'active' : ''}`}
          >
            Master List of Books
          </a>
          <a
            onClick={() => navigate('/reports/movies')}
            className={`sidebar-item ${isActive('/reports/movies') ? 'active' : ''}`}
          >
            Master List of Movies
          </a>
          <a
            onClick={() => navigate('/reports/memberships')}
            className={`sidebar-item ${isActive('/reports/memberships') ? 'active' : ''}`}
          >
            Master List of Memberships
          </a>
          <a
            onClick={() => navigate('/reports/active-issues')}
            className={`sidebar-item ${isActive('/reports/active-issues') ? 'active' : ''}`}
          >
            Active Issues
          </a>
          <a
            onClick={() => navigate('/reports/overdue')}
            className={`sidebar-item ${isActive('/reports/overdue') ? 'active' : ''}`}
          >
            Overdue Returns
          </a>
          <a
            onClick={() => navigate('/reports/issue-requests')}
            className={`sidebar-item ${isActive('/reports/issue-requests') ? 'active' : ''}`}
          >
            Pending Issue Requests
          </a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="modern-card">
          {/* Top Navigation */}
          <div className="top-nav">
            <button onClick={() => navigate('/reports')} className="btn-primary">
              Reports
            </button>
          </div>

          <h2 className="page-title">Master List of Books</h2>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Data Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Name of Book</th>
                  <th>Author Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Cost</th>
                  <th>Procurement Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.filter(r => r.type === 'book').map(r => (
                  <tr key={r._id}>
                    <td>{r.serialNo}</td>
                    <td>{r.name}</td>
                    <td>{r.author}</td>
                    <td>{r.category}</td>
                    <td>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: r.status === 'Available' ? '#d4edda' : '#fff3cd',
                        color: r.status === 'Available' ? '#155724' : '#856404'
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td>${r.cost}</td>
                    <td>{new Date(r.procurementDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '15px', marginTop: '30px', justifyContent: 'space-between' }}>
            <button onClick={() => navigate('/reports')} className="btn-secondary">
              Back to Reports
            </button>
            <button onClick={handleLogout} className="btn-danger">
              Log Out
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
