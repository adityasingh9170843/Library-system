import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api'

export default function UserManagement() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    userType: 'new',
    name: '',
    status: 'active',
    role: 'admin'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError('')
      setSuccess('')
      await api('/users/manage', {
        method: 'POST',
        body: JSON.stringify(formData)
      })
      setSuccess('User management operation completed successfully!')
      setTimeout(() => navigate('/maintenance'), 2000)
    } catch (err) {
      setError(err.message || 'Failed to manage user')
    }
  }

  const handleCancel = () => {
    navigate('/maintenance')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/logged-out')
  }

  return (
    <div className="page-container">
      <div className="modern-card">
        {}

        <h2 className="page-title">User Management</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {}
          <div className="form-group">
            <label>User Type</label>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="radio"
                  name="userType"
                  value="new"
                  checked={formData.userType === 'new'}
                  onChange={handleChange}
                />
                <span>New User</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="radio"
                  name="userType"
                  value="existing"
                  checked={formData.userType === 'existing'}
                  onChange={handleChange}
                />
                <span>Existing User</span>
              </label>
            </div>
          </div>

          {}
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </div>

          {}
          <div className="form-group">
            <label>Status</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                name="status"
                checked={formData.status === 'active'}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  status: e.target.checked ? 'active' : 'inactive'
                }))}
              />
              <span>Active</span>
            </label>
          </div>

          {}
          <div className="form-group">
            <label>Role</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                name="role"
                checked={formData.role === 'admin'}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  role: e.target.checked ? 'admin' : 'user'
                }))}
              />
              <span>Admin</span>
            </label>
          </div>

          {}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Confirm
            </button>
          </div>
        </form>

        {}
        <div style={{ marginTop: '40px', textAlign: 'right' }}>
          <button onClick={handleLogout} className="btn-danger">
            Log Out
          </button>
        </div>
      </div>
    </div>
  )
}
