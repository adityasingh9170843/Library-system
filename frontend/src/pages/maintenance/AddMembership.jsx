import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api'

export default function AddMembership() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactName: '',
    contactAddress: '',
    aadharCardNo: '',
    startDate: '',
    endDate: '',
    membershipType: 'six_months'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleMembershipTypeChange = (type) => {
    setFormData(prev => ({ ...prev, membershipType: type }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError('')
      setSuccess('')
      await api('/memberships', {
        method: 'POST',
        body: JSON.stringify(formData)
      })
      setSuccess('Membership added successfully!')
      setTimeout(() => navigate('/transaction-completed'), 1500)
    } catch (err) {
      setError(err.message || 'Failed to add membership')
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
        {}

        <h2 className="page-title">Add Membership</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {}
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          {}
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          {}
          <div className="form-group">
            <label>Contact Name</label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
            />
          </div>

          {}
          <div className="form-group">
            <label>Contact Address</label>
            <input
              type="text"
              name="contactAddress"
              value={formData.contactAddress}
              onChange={handleChange}
            />
          </div>

          {}
          <div className="form-group">
            <label>Aadhar Card No</label>
            <input
              type="text"
              name="aadharCardNo"
              value={formData.aadharCardNo}
              onChange={handleChange}
            />
          </div>

          {}
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          {}
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          {}
          <div className="form-group">
            <label>Membership Type</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="membershipType"
                  value="six_months"
                  checked={formData.membershipType === 'six_months'}
                  onChange={() => handleMembershipTypeChange('six_months')}
                />
                <span>Six Months</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="membershipType"
                  value="one_year"
                  checked={formData.membershipType === 'one_year'}
                  onChange={() => handleMembershipTypeChange('one_year')}
                />
                <span>One Year</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="membershipType"
                  value="two_years"
                  checked={formData.membershipType === 'two_years'}
                  onChange={() => handleMembershipTypeChange('two_years')}
                />
                <span>Two Years</span>
              </label>
            </div>
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
