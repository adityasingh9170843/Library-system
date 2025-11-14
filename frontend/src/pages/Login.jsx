import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login(){
  const [email, setEmail] = useState('admin@lib.local')
  const [password, setPassword] = useState('admin')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  async function onSubmit(e){
    e.preventDefault()
    setError('')
    try{
  const user = await login(email, password)
      navigate(user.role === 'admin' ? '/admin' : '/user')
    }catch(err){
      setError(err.message)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '48px auto' }}>
      <h2>Library Management System</h2>
      <form onSubmit={onSubmit} style={{ display:'grid', gap:12 }}>
        <label>
          User ID (email)
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          Password
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
        </label>
        {error && <div style={{ color:'red' }}>{error}</div>}
        <div style={{ display:'flex', gap:8 }}>
          <button type="reset" onClick={()=>{setEmail(''); setPassword('')}}>Cancel</button>
          <button type="submit">Login</button>
        </div>
      </form>
      <p style={{ marginTop:16, fontSize:12, opacity:.7 }}>Tip: first run seed admin: POST /api/auth/seed-admin</p>
    </div>
  )
}
