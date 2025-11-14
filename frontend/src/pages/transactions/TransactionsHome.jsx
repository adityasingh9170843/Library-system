import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import TransactionLayout from '../../components/TransactionLayout'

export default function TransactionsHome(){
  const navigate = useNavigate()
  const { user } = useAuth()
  return (
    <TransactionLayout>
      <div className="menu-grid">
        <button className="btn btn-primary" onClick={() => navigate('/transactions/check')}>Check Availability</button>
        <button className="btn btn-primary" onClick={() => navigate('/transactions/issue')}>Issue Book</button>
        <button className="btn btn-primary" onClick={() => navigate('/transactions/return')}>Return Book</button>
        <button className="btn btn-primary" onClick={() => navigate('/transactions/pay-fine')}>Pay Fine</button>
        <button className="btn btn-secondary" onClick={() => navigate('/home')}>Home</button>
      </div>
    </TransactionLayout>
  )
}
