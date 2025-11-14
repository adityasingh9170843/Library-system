import { useNavigate } from 'react-router-dom'

export default function TransactionCancelled() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/logged-out')
  }

  return (
    <div className="page-container">
      <div className="modern-card">
        {/* Top Navigation */}
        <div className="top-nav">
          <button onClick={() => navigate('/home')} className="btn-secondary">
            Home
          </button>
        </div>

        {/* Cancelled Message */}
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '72px', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '600',
            color: '#ffc107',
            marginBottom: '15px'
          }}>
            Transaction Cancelled
          </h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
            The transaction was cancelled and no changes were made.
          </p>
          <button onClick={() => navigate('/home')} className="btn-primary">
            Return to Home
          </button>
        </div>

        {/* Log Out Button */}
        <div style={{ marginTop: '40px', textAlign: 'right' }}>
          <button onClick={handleLogout} className="btn-danger">
            Log Out
          </button>
        </div>
      </div>
    </div>
  )
}
