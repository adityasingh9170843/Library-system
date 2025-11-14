import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const CATEGORY_ROWS = [
  { from: 'SC(B/M)000001', to: 'SC(B/M)000001', cat: 'Science' },
  { from: 'EC(B/M)000001', to: 'EC(B/M)000001', cat: 'Economics' },
  { from: 'FC(B/M)000001', to: 'FC(B/M)000001', cat: 'Fiction' },
  { from: 'CH(B/M)000001', to: 'CH(B/M)000001', cat: 'Children' },
  { from: 'PD(B/M)000001', to: 'PD(B/M)000001', cat: 'Personal Development' }
]

export default function HomeAdmin(){
  const navigate = useNavigate()
  const { logout } = useAuth()
  return (
    <div className="page-container">
      <div className="modern-card">
        <h2 className="page-title">Admin Home</h2>
        <h3 style={{margin:'0 0 12px'}}>Product Details</h3>
        <table className="simple-table" style={{maxWidth:900}}>
        <thead>
          <tr>
            <th style={{width:'30%'}}>Code No From</th>
            <th style={{width:'30%'}}>Code No To</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {CATEGORY_ROWS.map(r=> (
            <tr key={r.from}>
              <td>{r.from}</td>
              <td>{r.to}</td>
              <td style={{fontWeight:'bold'}}>{r.cat}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  )
}
