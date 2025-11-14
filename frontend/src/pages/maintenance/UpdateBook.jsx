import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api'

export default function UpdateBook() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    typeBook: false,
    typeMovie: false,
    name: '',
    serialNo: '',
    status: '',
    date: ''
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
      await api('/books/update', {
        method: 'PUT',
        body: JSON.stringify(formData)
      })
      setSuccess('Book/Movie updated successfully!')
      setTimeout(() => navigate('/maintenance'), 2000)
    } catch (err) {
      setError(err.message || 'Failed to update book/movie')
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
        {/* Top Navigation removed: Home button not required */}

        <h2 className="page-title">Update Book/Movie</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Type Selection */}
          <div className="form-group">
            <label>Type</label>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="radio"
                  name="typeSelection"
                  checked={formData.typeBook}
                  onChange={() => setFormData(prev => ({ ...prev, typeBook: true, typeMovie: false }))}
                />
                <span>Book</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="radio"
                  name="typeSelection"
                  checked={formData.typeMovie}
                  onChange={() => setFormData(prev => ({ ...prev, typeBook: false, typeMovie: true }))}
                />
                <span>Movie</span>
              </label>
            </div>
          </div>

          {/* Book/Movie Name */}
          <div className="form-group">
            <label>Book/Movie Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </div>

          {/* Serial No */}
          <div className="form-group">
            <label>Serial No</label>
            <input
              type="text"
              name="serialNo"
              value={formData.serialNo}
              onChange={handleChange}
              placeholder="Enter serial number"
            />
          </div>

          {/* Status */}
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="">Select status</option>
              <option value="available">Available</option>
              <option value="issued">Issued</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          {/* Date */}
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
            <button type="button" onClick={handleCancel} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Confirm</button>
          </div>
        </form>

        {/* Log Out Button */}
        <div style={{ marginTop: '40px', textAlign: 'right' }}>
          <button onClick={handleLogout} className="btn-danger">Log Out</button>
        </div>
      </div>
    </div>
  )
}
