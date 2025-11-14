import { useNavigate } from 'react-router-dom'

export default function LoggedOut() {
  const navigate = useNavigate()

  return (
    <div className="page-container">
      <div className="modern-card">
        <div className="top-nav">
          <button onClick={() => navigate('/login')} className="btn btn-primary">Login</button>
        </div>

        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '15px' }}></div>
          <h2 className="page-title" style={{ borderBottom: 'none', marginBottom: 0 }}>You have successfully logged out.</h2>
        </div>
      </div>
    </div>
  )
}
