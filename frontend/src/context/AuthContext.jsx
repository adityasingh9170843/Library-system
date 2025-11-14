import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiClient } from '../api'

const KEY = 'lib_auth'
const AuthCtx = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(()=>{
    try { return JSON.parse(localStorage.getItem(KEY))?.user || null } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  // Hydrate from cookie on page refresh
  useEffect(()=>{
    if(user) return
    let ignore = false
    setLoading(true)
    apiClient.get('/auth/me').then(res=>{
      if(!ignore && res.data?.user) {
        setUser(res.data.user)
        localStorage.setItem(KEY, JSON.stringify({ user: res.data.user }))
      }
    }).catch(()=>{}).finally(()=>setLoading(false))
    return ()=>{ ignore = true }
  },[])

  async function login(userId, password){
    const { data } = await apiClient.post('/auth/login', { userId, password })
    setUser(data.user)
    localStorage.setItem(KEY, JSON.stringify({ user: data.user }))
    return data.user
  }

  async function logout(){
    try { await apiClient.post('/auth/logout') } catch {}
    setUser(null)
    localStorage.removeItem(KEY)
  }

  const value = useMemo(()=>({ user, loading, login, logout }), [user, loading])
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth(){
  const ctx = useContext(AuthCtx)
  if(!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
