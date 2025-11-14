import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function UserLogin() {
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
      if (user?.role !== 'user') {
        setError('This account is not a standard user. Please use the Admin Login page or sign in with a user account.')
        await logout()
        return
      }
      navigate('/user')
    } catch (err) {
      setError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="modern-card auth-card">
        <h2>User Login</h2>
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
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Signing in...' : 'Login as User'}</button>
          </div>
        </form>
        <div className="mt-2" style={{ textAlign:'center' }}>
          <small>
            Are you an admin? <Link to="/login/admin">Admin Login</Link>
          </small>
        </div>
      </div>
    </div>
  )
}
