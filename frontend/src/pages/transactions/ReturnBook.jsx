import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { api } from '../../api'
import TransactionLayout from '../../components/TransactionLayout'

export default function ReturnBook(){
  const [bookName, setBookName] = useState('')
  const [author, setAuthor] = useState('')
  const [serialNo, setSerialNo] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [remarks, setRemarks] = useState('')
  const [actualReturnDate, setActualReturnDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  async function handleConfirm(e){
    e.preventDefault()
    setMessage('')
    
    if(!serialNo){ 
      setMessage('Serial No is required')
      return 
    }
    
    try{
      const data = await api('/transactions/return', { 
        method:'POST', 
        body:{ serialNo, actualReturnDate } 
      })
      setMessage(`Book returned successfully! Fine calculated: Rs.${data.transaction.fineCalculated}`)
      
      // Clear form after 3 seconds if no fine, otherwise redirect to pay fine
      if(data.transaction.fineCalculated > 0) {
        setTimeout(() => {
          navigate('/transactions/pay-fine', { 
            state: { issueId: data.transaction._id, fine: data.transaction.fineCalculated } 
          })
        }, 2000)
      } else {
        setTimeout(() => {
          setBookName('')
          setAuthor('')
          setSerialNo('')
          setIssueDate('')
          setReturnDate('')
          setRemarks('')
          setActualReturnDate(dayjs().format('YYYY-MM-DD'))
          setMessage('')
        }, 3000)
      }
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
              <td colSpan="2" style={{textAlign:'center', fontWeight:'bold', fontSize:18}}>Return Book</td>
            </tr>
            
            {/* Book Name */}
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

            {/* Author */}
            <tr style={{height:50}}>
              <td style={{paddingLeft:16, fontWeight:'bold'}}>Enter Author</td>
              <td style={{paddingLeft:16}}>
                <textarea 
                  value={author}
                  onChange={e=>setAuthor(e.target.value)}
                  style={{width:'95%', padding:'8px', border:'1px solid #ccc', borderRadius:4, minHeight:40, resize:'vertical'}}
                  placeholder="Author name (optional)"
                />
              </td>
            </tr>

            {/* Serial No */}
            <tr style={{height:50}}>
              <td style={{paddingLeft:16, fontWeight:'bold'}}>Serial No</td>
              <td style={{paddingLeft:16}}>
                <select 
                  value={serialNo}
                  onChange={e=>setSerialNo(e.target.value)}
                  style={{width:'95%', padding:'8px', border:'1px solid #ccc', borderRadius:4}}
                  required
                >
                  <option value="">-- Select Serial Number --</option>
                  {/* In real app, you'd populate this with issued books */}
                  <option value="manual">Enter Manually</option>
                </select>
                {serialNo === 'manual' && (
                  <input 
                    type="text" 
                    onChange={e=>setSerialNo(e.target.value)}
                    style={{width:'95%', padding:'8px', border:'1px solid #ccc', borderRadius:4, marginTop:8}}
                    placeholder="Enter serial number"
                  />
                )}
              </td>
            </tr>

            {/* Issue Date */}
            <tr style={{height:50}}>
              <td style={{paddingLeft:16, fontWeight:'bold'}}>Issue Date</td>
              <td style={{paddingLeft:16}}>
                <input 
                  type="text" 
                  value={issueDate}
                  onChange={e=>setIssueDate(e.target.value)}
                  style={{width:'95%', padding:'8px', border:'1px solid #ccc', borderRadius:4, backgroundColor:'#f5f5f5'}}
                  placeholder="Auto-filled or enter manually"
                />
              </td>
            </tr>

            {/* Return Date */}
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

            {/* Remarks */}
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

            {/* Buttons */}
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

            {/* Message */}
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

      {/* Removed bottom note for cleaner UI */}
    </TransactionLayout>
  )
}
