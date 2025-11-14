import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function TransactionLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  function handleLogout() {
    navigate('/logged-out')
    logout()
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="sidebar-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">Transactions</div>
        <nav className="sidebar-menu">
          <a
            className={`sidebar-item ${isActive('/transactions/check') ? 'active' : ''}`}
            onClick={() => navigate('/transactions/check')}
          >
            Check Availability
          </a>
          <a
            className={`sidebar-item ${isActive('/transactions/issue') ? 'active' : ''}`}
            onClick={() => navigate('/transactions/issue')}
          >
            Issue Book
          </a>
          <a
            className={`sidebar-item ${isActive('/transactions/return') ? 'active' : ''}`}
            onClick={() => navigate('/transactions/return')}
          >
            Return Book
          </a>
          <a
            className={`sidebar-item ${isActive('/transactions/pay-fine') ? 'active' : ''}`}
            onClick={() => navigate('/transactions/pay-fine')}
          >
            Pay Fine
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="top-nav">
          <button onClick={() => navigate('/transactions')} className="btn btn-primary">Transactions</button>
          <div style={{flex:1}}></div>
          <button onClick={() => navigate('/home')} className="btn btn-secondary">Home</button>
          <button onClick={handleLogout} className="btn btn-danger">Log Out</button>
        </div>

        <div className="modern-card">
          {children}
        </div>
      </main>
    </div>
  )
}
