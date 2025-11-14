import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { api } from '../../api'

export default function MembershipsReport() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    api('/reports/memberships').then(setRows).catch(e => setError(e.message))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/logged-out')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="sidebar-layout">
      <aside className="sidebar">
        <div className="sidebar-header">Reports</div>
        <nav className="sidebar-menu">
          <a className={`sidebar-item ${isActive('/reports/books') ? 'active' : ''}`} onClick={()=>navigate('/reports/books')}>Master List of Books</a>
          <a className={`sidebar-item ${isActive('/reports/movies') ? 'active' : ''}`} onClick={()=>navigate('/reports/movies')}>Master List of Movies</a>
          <a className={`sidebar-item ${isActive('/reports/memberships') ? 'active' : ''}`} onClick={()=>navigate('/reports/memberships')}>Master List of Memberships</a>
          <a className={`sidebar-item ${isActive('/reports/active-issues') ? 'active' : ''}`} onClick={()=>navigate('/reports/active-issues')}>Active Issues</a>
          <a className={`sidebar-item ${isActive('/reports/overdue') ? 'active' : ''}`} onClick={()=>navigate('/reports/overdue')}>Overdue Returns</a>
          <a className={`sidebar-item ${isActive('/reports/issue-requests') ? 'active' : ''}`} onClick={()=>navigate('/reports/issue-requests')}>Pending Issue Requests</a>
        </nav>
      </aside>
      <main className="main-content">
        <div className="top-nav">
          <button className="btn btn-primary" onClick={()=>navigate('/reports')}>Reports</button>
          <div style={{flex:1}}></div>
          <button className="btn btn-danger" onClick={handleLogout}>Log Out</button>
        </div>
        <div className="modern-card">
          <h2 className="page-title">Master List of Memberships</h2>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{overflowX:'auto'}}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Membership Id</th>
                  <th>Name of Member</th>
                  <th>Contact Number</th>
                  <th>Contact Address</th>
                  <th>Aadhar Card No</th>
                  <th>Start Date of Membership</th>
                  <th>End Date of Membership</th>
                  <th>Status</th>
                  <th>Amount Pending (Fine)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r._id}>
                    <td>{r._id}</td>
                    <td>{r.memberName}</td>
                    <td>{r.contactNumber}</td>
                    <td>{r.contactAddress}</td>
                    <td>{r.aadharCardNo}</td>
                    <td>{new Date(r.startDate).toLocaleDateString()}</td>
                    <td>{new Date(r.endDate).toLocaleDateString()}</td>
                    <td>{r.status}</td>
                    <td>{r.amountPendingFine || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="btn-group" style={{justifyContent:'space-between'}}>
            <button className="btn btn-secondary" onClick={()=>navigate('/reports')}>Back to Reports</button>
            <button className="btn btn-danger" onClick={handleLogout}>Log Out</button>
          </div>
        </div>
      </main>
    </div>
  )
}
