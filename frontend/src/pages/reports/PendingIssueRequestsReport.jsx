import { useEffect, useState } from 'react'
import { api } from '../../api'

export default function PendingIssueRequestsReport(){
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  useEffect(()=>{ api('/reports/pending-issue-requests').then(setRows).catch(e=>setError(e.message)) },[])
  return (
    <div>
      <h3>Pending Issue Requests</h3>
      {error && <div style={{color:'red'}}>{error}</div>}
      <table className="simple-table"><thead><tr><th>Request ID</th><th>Book Serial</th><th>Member</th><th>Requested On</th><th>Status</th></tr></thead>
        <tbody>{rows.map(r=> <tr key={r._id}><td>{r._id}</td><td>{r.serialNo}</td><td>{r.membershipId}</td><td>{new Date(r.createdAt).toLocaleDateString()}</td><td>{r.status || 'pending'}</td></tr>)}</tbody>
      </table>
      {!rows.length && <p style={{opacity:0.7}}>No pending requests.</p>}
    </div>
  )
}
