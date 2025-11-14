import { useEffect, useState } from 'react'
import { api } from '../../api'

export default function OverdueReturnsReport(){
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  useEffect(()=>{ api('/reports/overdue-returns').then(setRows).catch(e=>setError(e.message)) },[])
  return (
    <div>
      <h3>Overdue Returns</h3>
      {error && <div style={{color:'red'}}>{error}</div>}
      <table className="simple-table"><thead><tr><th>Serial</th><th>Name</th><th>Member</th><th>Issue Date</th><th>Return Date</th></tr></thead>
        <tbody>{rows.map(r=> <tr key={r._id}><td>{r.serialNo}</td><td>{r.bookName}</td><td>{r.membershipId}</td><td>{new Date(r.issueDate).toLocaleDateString()}</td><td>{new Date(r.returnDate).toLocaleDateString()}</td></tr>)}</tbody>
      </table>
    </div>
  )
}
