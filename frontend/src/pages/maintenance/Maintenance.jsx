import { useNavigate } from 'react-router-dom'

export default function Maintenance() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/logged-out')
  }

  const maintenanceItems = [
    {
      title: 'Membership',
      items: [
        { label: 'Add Membership', path: '/maintenance/membership/add', icon: '➕' },
        { label: 'Update Membership', path: '/maintenance/membership/update', icon: '✏️' }
      ]
    },
    {
      title: 'Books/Movies',
      items: [
        { label: 'Add Book/Movie', path: '/maintenance/books/add', icon: '➕' },
        { label: 'Update Book/Movie', path: '/maintenance/books/update', icon: '✏️' }
      ]
    },
    {
      title: 'User Management',
      items: [
        { label: 'Add User', path: '/maintenance/users/add', icon: '👤' },
        { label: 'Update User', path: '/maintenance/users/update', icon: '✏️' }
      ]
    }
  ]

  return (
    <div className="page-container">
      <div className="modern-card">
        {/* Top Navigation removed: Home button not required */}

        <h2 className="page-title">Maintenance</h2>

        {/* Maintenance Menu Grid */}
        <div className="menu-grid">
          {maintenanceItems.map((section, idx) => (
            <div key={idx} className="modern-card" style={{ padding: '20px' }}>
              <h3 style={{ 
                marginBottom: '15px', 
                fontSize: '18px', 
                fontWeight: '600',
                color: '#667eea',
                borderBottom: '2px solid #667eea',
                paddingBottom: '10px'
              }}>
                {section.title}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {section.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    onClick={() => navigate(item.path)}
                    className="btn-primary"
                    style={{ 
                      justifyContent: 'flex-start',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
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
