import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api'

export default function UpdateMembership() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    membershipId: '',
    firstName: '',
    lastName: '',
    contactName: '',
    contactAddress: '',
    aadharCardNo: '',
    startDate: '',
    endDate: '',
    status: '',
    amountPending: ''
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
      await api('/memberships/update', {
        method: 'PUT',
        body: JSON.stringify(formData)
      })
      setSuccess('Membership updated successfully!')
      setTimeout(() => navigate('/maintenance'), 2000)
    } catch (err) {
      setError(err.message || 'Failed to update membership')
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
        {/* Top Navigation */}
        <div className="top-nav">
          <button onClick={() => navigate('/home')} className="btn-secondary">Home</button>
        </div>

        <h2 className="page-title">Update Membership</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Membership ID */}
          <div className="form-group">
            <label>Membership ID</label>
            <input
              type="text"
              name="membershipId"
              value={formData.membershipId}
              onChange={handleChange}
              placeholder="Enter membership ID"
            />
          </div>

          {/* First Name */}
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          {/* Contact Name */}
          <div className="form-group">
            <label>Contact Name</label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
            />
          </div>

          {/* Contact Address */}
          <div className="form-group">
            <label>Contact Address</label>
            <input
              type="text"
              name="contactAddress"
              value={formData.contactAddress}
              onChange={handleChange}
            />
          </div>

          {/* Aadhar Card No */}
          <div className="form-group">
            <label>Aadhar Card No</label>
            <input
              type="text"
              name="aadharCardNo"
              value={formData.aadharCardNo}
              onChange={handleChange}
            />
          </div>

          {/* Start Date */}
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
          </div>

          {/* End Date */}
          <div className="form-group">
            <label>End Date</label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
          </div>

          {/* Status */}
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Amount Pending */}
          <div className="form-group">
            <label>Amount Pending</label>
            <input
              type="text"
              name="amountPending"
              value={formData.amountPending}
              onChange={handleChange}
            />
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
