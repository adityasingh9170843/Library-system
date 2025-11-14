import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const { login, logout } = useAuth()
  const navigate = useNavigate()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(userId, password)
      if (user?.role !== 'admin') {
        setError('This account is not an admin. Please use the User Login page or sign in with an admin account.')
        await logout()
        return
      }
      navigate('/admin')
    } catch (err) {
      setError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="modern-card auth-card">
        <h2>Admin Login</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="simple-form">
          <div className="form-group">
            <label>User ID</label>
            <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="auth-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Signing in...' : 'Login as Admin'}</button>
          </div>
        </form>
        <div className="mt-2" style={{ textAlign:'center' }}>
          <small>
            Not an admin? <Link to="/login/user">User Login</Link>
          </small>
        </div>
      </div>
    </div>
  )
}
