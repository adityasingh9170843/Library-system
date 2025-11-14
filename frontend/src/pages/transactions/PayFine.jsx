import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { api } from '../../api'
import TransactionLayout from '../../components/TransactionLayout'

export default function PayFine(){
  const [bookName, setBookName] = useState('')
  const [author, setAuthor] = useState('')
  const [serialNo, setSerialNo] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [actualReturnDate, setActualReturnDate] = useState('')
  const [fineCalculated, setFineCalculated] = useState('')
  const [finePaid, setFinePaid] = useState(false)
  const [remarks, setRemarks] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  // Pre-fill data if coming from return book page
  useEffect(() => {
    if (location.state?.issueId) {
      // In real app, you'd fetch issue details by ID
      setFineCalculated(location.state.fine || '0')
    }
  }, [location.state])

  async function handleConfirm(e){
    e.preventDefault()
    setMessage('')
    
    if(!serialNo){ 
      setMessage('Serial No is required')
      return 
    }
    
    try{
      
      
      const data = await api('/transactions/pay-fine', { 
        method:'POST', 
        body:{ 
          issueId: serialNo, 
          finePaid, 
          remarks 
        } 
      })
      setMessage('Fine payment processed successfully!')
      
      setTimeout(() => {
        setBookName('')
        setAuthor('')
        setSerialNo('')
        setIssueDate('')
        setReturnDate('')
        setActualReturnDate('')
        setFineCalculated('')
        setFinePaid(false)
        setRemarks('')
        setMessage('')
      }, 3000)
    }catch(err){ 
      setMessage(err.message) 
    }
  }

  function handleCancel(){
    navigate('/transactions')
  }

  return (
    <TransactionLayout>
      <form onSubmit={handleConfirm}>
        <table className="menu-table" style={{width:'100%', maxWidth:1000}}>
          <tbody>
            <tr style={{height:50, backgroundColor:'#f0f0f0'}}>
              <td colSpan="2" style={{textAlign:'center', fontWeight:'bold', fontSize:18}}>Pay Fine</td>
            </tr>
            
            {}
            <tr style={{height:50}}>
              <td style={{width:200, paddingLeft:16, fontWeight:'bold'}}>Enter Book Name</td>
              <td style={{paddingLeft:16}}>
                <input 
                  type="text" 
                  value={bookName}
                  onChange={e=>setBookName(e.target.value)}
                  style={{width:'95%', padding:'8px', border:'1px solid #ccc', borderRadius:4}}
                  placeholder="Book name (optional)"
                />
              </td>
            </tr>

            {}
            <tr style={{height:50}}>
              <td style={{paddingLeft:16, fontWeight:'bold'}}>Enter Author</td>
              <td style={{paddingLeft:16}}>
                <input 
                  type="text" 
                  value={author}
                  onChange={e=>setAuthor(e.target.value)}
                  style={{width:'95%', padding:'8px', border:'1px solid #ccc', borderRadius:4}}
                  placeholder="Author name (optional)"
                />
              </td>
            </tr>

            {}
            <tr style={{height:50}}>
              <td style={{paddingLeft:16, fontWeight:'bold'}}>Serial No</td>
              <td style={{paddingLeft:16}}>
                <input 
                  type="text" 
                  value={serialNo}
                  onChange={e=>setSerialNo(e.target.value)}
                  style={{width:'95%', padding:'8px', border:'1px solid #ccc', borderRadius:4}}
                  placeholder="Enter serial number"
                  required
                />
              </td>
            </tr>

            {}
            <tr style={{height:50}}>
              <td style={{paddingLeft:16, fontWeight:'bold'}}>Issue Date</td>
              <td style={{paddingLeft:16}}>
                <input 
                  type="date" 
                  value={issueDate}
                  onChange={e=>setIssueDate(e.target.value)}
                  style={{width:'95%', padding:'8px', border:'1px solid #ccc', borderRadius:4}}
                />
              </td>
            </tr>

            {}
            <tr style={{height:50}}>
              <td style={{paddingLeft:16, fontWeight:'bold'}}>Return Date</td>
              <td style={{paddingLeft:16}}>
                <input 
                  type="date" 
                  value={returnDate}
                  onChange={e=>setReturnDate(e.target.value)}
                  style={{width:'95%', padding:'8px', border:'1px solid #ccc', borderRadius:4}}
                />
              </td>
            </tr>

            {}
            <tr style={{height:50}}>
              <td style={{paddingLeft:16, fontWeight:'bold'}}>Actual Return Date</td>
              <td style={{paddingLeft:16}}>
                <input 
                  type="date" 
                  value={actualReturnDate}
                  onChange={e=>setActualReturnDate(e.target.value)}
                  style={{width:'95%', padding:'8px', border:'1px solid #ccc', borderRadius:4}}
                />
              </td>
            </tr>

            {}
            <tr style={{height:50}}>
              <td style={{paddingLeft:16, fontWeight:'bold'}}>Fine Calculated</td>
              <td style={{paddingLeft:16}}>
                <input 
                  type="text" 
                  value={fineCalculated || '0'}
                  onChange={e=>setFineCalculated(e.target.value)}
                  style={{width:'95%', padding:'8px', border:'1px solid #ccc', borderRadius:4, backgroundColor:'#f5f5f5'}}
                  placeholder="by default zero"
                  readOnly
                />
              </td>
            </tr>

            {}
            <tr style={{height:50}}>
              <td style={{paddingLeft:16, fontWeight:'bold'}}>Fine Paid</td>
              <td style={{paddingLeft:16}}>
                <input 
                  type="checkbox" 
                  checked={finePaid}
                  onChange={e=>setFinePaid(e.target.checked)}
                  style={{width:'20px', height:'20px', cursor:'pointer'}}
                />
                <span style={{marginLeft:12}}>{finePaid ? 'Yes' : 'No'}</span>
              </td>
            </tr>

            {}
            <tr style={{height:80}}>
              <td style={{paddingLeft:16, fontWeight:'bold', verticalAlign:'top', paddingTop:16}}>Remarks</td>
              <td style={{paddingLeft:16}}>
                <textarea 
                  value={remarks}
                  onChange={e=>setRemarks(e.target.value)}
                  style={{width:'95%', padding:'8px', border:'1px solid #ccc', borderRadius:4, minHeight:60, resize:'vertical'}}
                  placeholder="Optional remarks"
                />
              </td>
            </tr>

            <tr style={{height:20}}><td colSpan="2"></td></tr>

            {}
            <tr style={{height:60}}>
              <td colSpan="2" style={{textAlign:'center'}}>
                <button 
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding:'12px 48px',
                    backgroundColor:'#5b9bd5',
                    color:'white',
                    border:'none',
                    borderRadius:20,
                    fontSize:16,
                    fontWeight:'bold',
                    cursor:'pointer',
                    marginRight:24
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    padding:'12px 48px',
                    backgroundColor:'#5b9bd5',
                    color:'white',
                    border:'none',
                    borderRadius:20,
                    fontSize:16,
                    fontWeight:'bold',
                    cursor:'pointer'
                  }}
                >
                  Confirm
                </button>
              </td>
            </tr>

            {}
            {message && (
              <tr>
                <td colSpan="2" style={{textAlign:'center', padding:'16px', color: message.includes('successfully') ? 'green' : 'red', fontWeight:'bold'}}>
                  {message}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </form>

      {}
    </TransactionLayout>
  )
}
