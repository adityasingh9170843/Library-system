import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ReportsHome(){
  const navigate = useNavigate()
  const { logout } = useAuth()

  function handleLogout(){
    navigate('/logged-out')
    logout()
  }

  return (
    <div className="sidebar-layout">
      <aside className="sidebar">
        <div className="sidebar-header">Reports</div>
        <nav className="sidebar-menu">
          <a className="sidebar-item" onClick={()=>navigate('/reports/books')}>Master List of Books</a>
          <a className="sidebar-item" onClick={()=>navigate('/reports/movies')}>Master List of Movies</a>
          <a className="sidebar-item" onClick={()=>navigate('/reports/memberships')}>Master List of Memberships</a>
          <a className="sidebar-item" onClick={()=>navigate('/reports/active-issues')}>Active Issues</a>
          <a className="sidebar-item" onClick={()=>navigate('/reports/overdue')}>Overdue Returns</a>
          <a className="sidebar-item" onClick={()=>navigate('/reports/issue-requests')}>Pending Issue Requests</a>
        </nav>
      </aside>
      <main className="main-content">
        <div className="top-nav">
          <button className="btn btn-primary" onClick={()=>navigate('/reports')}>Reports</button>
          <div style={{flex:1}}></div>
          <button className="btn btn-secondary" onClick={()=>navigate('/home')}>Home</button>
          <button className="btn btn-danger" onClick={handleLogout}>Log Out</button>
        </div>
        <div className="modern-card">
          <h2 className="page-title">Available Reports</h2>
          <div className="menu-grid">
            <button className="btn btn-primary" onClick={()=>navigate('/reports/books')}>Books</button>
            <button className="btn btn-primary" onClick={()=>navigate('/reports/movies')}>Movies</button>
            <button className="btn btn-primary" onClick={()=>navigate('/reports/memberships')}>Memberships</button>
            <button className="btn btn-primary" onClick={()=>navigate('/reports/active-issues')}>Active Issues</button>
            <button className="btn btn-primary" onClick={()=>navigate('/reports/overdue')}>Overdue Returns</button>
            <button className="btn btn-primary" onClick={()=>navigate('/reports/issue-requests')}>Issue Requests</button>
          </div>
        </div>
      </main>
    </div>
  )
}
