import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api'

export default function AddBook() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    type: 'book',
    name: '',
    author: '',
    category: '',
    serialNo: '',
    cost: '',
    procurementDate: '',
    quantity: '1'
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
      await api('/books', {
        method: 'POST',
        body: JSON.stringify({ ...formData, mode: 'add' })
      })
      setSuccess('Book/Movie added successfully!')
      setTimeout(() => navigate('/transaction-completed'), 1500)
    } catch (err) {
      setError(err.message || 'Failed to add book/movie')
    }
  }

  const handleCancel = () => {
    navigate('/transaction-cancelled')
  }

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

        <h2 className="page-title">Add Book/Movie</h2>

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
                  name="type"
                  value="book"
                  checked={formData.type === 'book'}
                  onChange={handleChange}
                />
                <span>Book</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="radio"
                  name="type"
                  value="movie"
                  checked={formData.type === 'movie'}
                  onChange={handleChange}
                />
                <span>Movie</span>
              </label>
            </div>
          </div>

          {/* Name */}
          <div className="form-group">
            <label>{formData.type === 'book' ? 'Book' : 'Movie'} Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Author */}
          <div className="form-group">
            <label>Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          {/* Serial Number */}
          <div className="form-group">
            <label>Serial Number</label>
            <input
              type="text"
              name="serialNo"
              value={formData.serialNo}
              onChange={handleChange}
            />
          </div>

          {/* Cost */}
          <div className="form-group">
            <label>Cost</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
            />
          </div>

          {/* Procurement Date */}
          <div className="form-group">
            <label>Date of Procurement</label>
            <input
              type="date"
              name="procurementDate"
              value={formData.procurementDate}
              onChange={handleChange}
            />
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label>Quantity/Copies (default: 1)</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Confirm
            </button>
          </div>
        </form>

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

