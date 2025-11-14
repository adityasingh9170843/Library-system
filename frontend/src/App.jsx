import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import './App.css'
import './modern-styles.css'
import AdminLogin from './pages/AdminLogin'
import UserLogin from './pages/UserLogin'
import { useAuth } from './context/AuthContext.jsx'
import HomeAdmin from './pages/HomeAdmin'
import HomeUser from './pages/HomeUser'
import AddBook from './pages/maintenance/AddBook'
import UpdateBook from './pages/maintenance/UpdateBook'
import AddMembership from './pages/maintenance/AddMembership'
import UpdateMembership from './pages/maintenance/UpdateMembership'
import UserManagement from './pages/maintenance/UserManagement'
import Maintenance from './pages/maintenance/Maintenance'
import CheckAvailability from './pages/transactions/CheckAvailability'
import IssueBook from './pages/transactions/IssueBook'
import ReturnBook from './pages/transactions/ReturnBook'
import PayFine from './pages/transactions/PayFine'
import SearchResults from './pages/transactions/SearchResults'
import TransactionsHome from './pages/transactions/TransactionsHome'
import BooksReport from './pages/reports/BooksReport'
import MoviesReport from './pages/reports/MoviesReport'
import MembershipsReport from './pages/reports/MembershipsReport'
import ActiveIssuesReport from './pages/reports/ActiveIssuesReport'
import OverdueReport from './pages/reports/OverdueReport'
import IssueRequestsReport from './pages/reports/IssueRequestsReport'
import ReportsHome from './pages/reports/ReportsHome'
import TransactionCancelled from './pages/TransactionCancelled'
import TransactionCompleted from './pages/TransactionCompleted'
import LoggedOut from './pages/LoggedOut'

function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div>
      <header className="main-header">
        <nav className="main-nav">
          <Link className="nav-link" to={user?.role === 'admin' ? '/admin' : '/user'}>Home</Link>
          <Link className="nav-link" to="/reports">Reports</Link>
          <Link className="nav-link" to="/transactions">Transactions</Link>
          {user?.role === 'admin' && <Link className="nav-link" to="/maintenance">Maintenance</Link>}
          {user && (
            <button 
              onClick={async () => { 
                navigate('/logged-out'); 
                await logout(); 
              }} 
              className="btn btn-secondary" 
              style={{ marginLeft: 'auto' }}>
              Log Out
            </button>
          )}
        </nav>
      </header>
      <main>
        {children}
      </main>
    </div>
  )
}

function Protected({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{padding:16}}>Loading...</div>
  if (!user) return <Navigate to="/login/user" replace />
  if (role && user?.role !== role) return <Navigate to="/login/user" replace />
  return <Layout>{children}</Layout>
}

export default function App() {
  return (
    <Routes>
  <Route path="/login" element={<Navigate to="/login/user" />} />
  <Route path="/login/admin" element={<AdminLogin />} />
  <Route path="/login/user" element={<UserLogin />} />

      <Route path="/admin" element={<Protected role="admin"><HomeAdmin /></Protected>} />
      <Route path="/user" element={<Protected><HomeUser /></Protected>} />

      {/* Maintenance */}
      <Route path="/maintenance" element={<Protected role="admin"><Maintenance /></Protected>} />
      <Route path="/maintenance/books/add" element={<Protected role="admin"><AddBook /></Protected>} />
      <Route path="/maintenance/books/update" element={<Protected role="admin"><UpdateBook /></Protected>} />
      <Route path="/maintenance/membership/add" element={<Protected role="admin"><AddMembership /></Protected>} />
      <Route path="/maintenance/membership/update" element={<Protected role="admin"><UpdateMembership /></Protected>} />
      <Route path="/maintenance/users/add" element={<Protected role="admin"><UserManagement /></Protected>} />
      <Route path="/maintenance/users/update" element={<Protected role="admin"><UserManagement /></Protected>} />

      {/* Transactions */}
  <Route path="/transactions" element={<Protected><TransactionsHome /></Protected>} />
      <Route path="/transactions/check" element={<Protected><CheckAvailability /></Protected>} />
      <Route path="/transactions/issue" element={<Protected><IssueBook /></Protected>} />
      <Route path="/transactions/return" element={<Protected><ReturnBook /></Protected>} />
      <Route path="/transactions/pay-fine" element={<Protected><PayFine /></Protected>} />
  <Route path="/transactions/search-results" element={<Protected><SearchResults /></Protected>} />

  {/* Reports */}
  <Route path="/reports" element={<Protected><ReportsHome /></Protected>} />
      <Route path="/reports/books" element={<Protected><BooksReport /></Protected>} />
      <Route path="/reports/movies" element={<Protected><MoviesReport /></Protected>} />
      <Route path="/reports/memberships" element={<Protected><MembershipsReport /></Protected>} />
      <Route path="/reports/active-issues" element={<Protected><ActiveIssuesReport /></Protected>} />
      <Route path="/reports/overdue" element={<Protected><OverdueReport /></Protected>} />
  <Route path="/reports/issue-requests" element={<Protected><IssueRequestsReport /></Protected>} />

  {/* Confirmation Pages */}
  <Route path="/transaction-cancelled" element={<TransactionCancelled />} />
  <Route path="/transaction-completed" element={<TransactionCompleted />} />
  <Route path="/logged-out" element={<LoggedOut />} />

  <Route path="/" element={<Navigate to="/login/user" />} />
  <Route path="*" element={<Navigate to="/login/user" />} />
    </Routes>
  )
}
