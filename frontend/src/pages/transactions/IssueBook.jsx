import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { api } from '../../api'
import TransactionLayout from '../../components/TransactionLayout'

export default function IssueBook(){
  const [availableBooks, setAvailableBooks] = useState([])
  const [selectedBook, setSelectedBook] = useState('')
  const [author, setAuthor] = useState('')
  const [membershipId, setMembershipId] = useState('')
  const [issueDate, setIssueDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [returnDate, setReturnDate] = useState(dayjs().add(15, 'day').format('YYYY-MM-DD'))
  const [remarks, setRemarks] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  // Fetch available books on mount
  useEffect(() => {
    async function fetchAvailableBooks() {
      try {
        const books = await api('/books/available')
        setAvailableBooks(books)
      } catch (err) {
        console.error('Failed to load available books:', err)
      }
    }
    fetchAvailableBooks()
  }, [])

  // Auto-update return date when issue date changes (max 15 days)
  useEffect(()=>{
    setReturnDate(dayjs(issueDate).add(15, 'day').format('YYYY-MM-DD'))
  },[issueDate])

  // Update author when book is selected
  useEffect(() => {
    if (selectedBook) {
      const book = availableBooks.find(b => b.serialNo === selectedBook)
      if (book) {
        setAuthor(book.author)
      }
    } else {
      setAuthor('')
    }
  }, [selectedBook, availableBooks])

  async function handleConfirm(e){
    e.preventDefault()
    setMessage('')
    
    if(!selectedBook){ 
      setMessage('Please select a book from dropdown')
      return 
    }
    
    const max = dayjs(issueDate).add(15, 'day')
    if(dayjs(returnDate).isAfter(max)) { 
      setMessage('Return date cannot be greater than 15 days from issue date')
      return 
    }
    
    try{
      const data = await api('/transactions/issue', { 
        method:'POST', 
        body:{ 
          serialNo: selectedBook, 
          membershipId, 
          issueDate, 
          returnDate, 
          remarks 
        } 
      })
      setMessage('Book issued successfully!')
      // Reset form
      setTimeout(() => {
        setSelectedBook('')
        setAuthor('')
        setMembershipId('')
        setIssueDate(dayjs().format('YYYY-MM-DD'))
        setReturnDate(dayjs().add(15, 'day').format('YYYY-MM-DD'))
        setRemarks('')
        setMessage('')
      }, 2000)
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
              <td colSpan="2" style={{textAlign:'center', fontWeight:'bold', fontSize:18}}>Book Issue</td>
            </tr>
            
            {/* Book Name Dropdown */}
            <tr style={{height:50}}>
              <td style={{width:200, paddingLeft:16, fontWeight:'bold'}}>Enter Book Name</td>
              <td style={{paddingLeft:16}}>
                <select 
                  value={selectedBook} 
                  onChange={e=>setSelectedBook(e.target.value)}
                  style={{width:'95%', padding:'8px', border:'1px solid #ccc', borderRadius:4}}
                  required
                >
                  <option value="">-- Select Book --</option>
                  {availableBooks.map(book => (
                    <option key={book.serialNo} value={book.serialNo}>
                      {book.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>

            {/* Author */}
            <tr style={{height:50}}>
              <td style={{paddingLeft:16, fontWeight:'bold'}}>Enter Author</td>
              <td style={{paddingLeft:16}}>
                <input 
                  type="text" 
                  value={author}
                  readOnly
                  style={{width:'95%', padding:'8px', border:'1px solid #ccc', borderRadius:4, backgroundColor:'#f5f5f5'}}
                  placeholder="Auto-filled from book selection"
                />
              </td>
            </tr>

            {/* Membership ID */}
            <tr style={{height:50}}>
              <td style={{paddingLeft:16, fontWeight:'bold'}}>Membership ID</td>
              <td style={{paddingLeft:16}}>
                <input 
                  type="text" 
                  value={membershipId}
                  onChange={e=>setMembershipId(e.target.value)}
                  style={{width:'95%', padding:'8px', border:'1px solid #ccc', borderRadius:4}}
                  placeholder="Enter membership ID"
                  required
                />
              </td>
            </tr>

            {/* Issue Date */}
            <tr style={{height:50}}>
              <td style={{paddingLeft:16, fontWeight:'bold'}}>Issue Date</td>
              <td style={{paddingLeft:16}}>
                <input 
                  type="date" 
                  value={issueDate}
                  min={dayjs().format('YYYY-MM-DD')}
                  onChange={e=>setIssueDate(e.target.value)}
                  style={{width:'95%', padding:'8px', border:'1px solid #ccc', borderRadius:4}}
                  required
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
                  required
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
