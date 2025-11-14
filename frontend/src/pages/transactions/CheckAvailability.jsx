import { useState, useEffect } from 'react'
import { api } from '../../api'
import { useNavigate } from 'react-router-dom'
import TransactionLayout from '../../components/TransactionLayout'

export default function CheckAvailability(){
  const [bookName, setBookName] = useState('')
  const [author, setAuthor] = useState('')
  const [status, setStatus] = useState('All')
  const [selectedBook, setSelectedBook] = useState('')
  const [availableBooks, setAvailableBooks] = useState([])
  const [error, setError] = useState('')
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

  async function handleSearch(){
    setError('')
    // Use dropdown selection if present, otherwise use manual inputs
    let searchQuery = bookName || author
    
    if (selectedBook) {
      // If a book is selected from dropdown, search by its serial number for exact match
      const book = availableBooks.find(b => b.serialNo === selectedBook)
      if (book) {
        searchQuery = book.name
      }
    }
    
    if(!searchQuery){ 
      setError('Enter at least book name or author, or select from dropdown'); 
      return 
    }
    
    try { 
      const data = await api(`/books?q=${encodeURIComponent(searchQuery)}`)
      
      let filtered = data
      if(status === 'Available') filtered = data.filter(b => b.status === 'Available')
      else if(status === 'Issued') filtered = data.filter(b => b.status === 'Issued')
      navigate('/transactions/search-results', { state: { results: filtered }})
    }catch(err){ 
      setError(err.message) 
    }
  }

  function handleBack(){
    navigate('/transactions')
  }

  return (
    <TransactionLayout>
      <table className="menu-table" style={{width:'100%', maxWidth:800}}>
        <tbody>
          <tr style={{height:50}}>
            <td colSpan="2" style={{textAlign:'center', fontWeight:'bold', fontSize:18}}>Book Availability</td>
          </tr>
          <tr style={{height:50}}>
            <td style={{width:200, paddingLeft:16}}>Enter Book Name</td>
            <td style={{paddingLeft:16}}>
              <input 
                type="text" 
                value={bookName} 
                onChange={e=>setBookName(e.target.value)}
                style={{width:'90%', padding:'6px 8px', border:'1px solid #ccc', borderRadius:4}}
                placeholder="Book name"
              />
            </td>
          </tr>
          <tr style={{height:50}}>
            <td style={{paddingLeft:16}}>Enter Author</td>
            <td style={{paddingLeft:16}}>
              <input 
                type="text" 
                value={author} 
                onChange={e=>setAuthor(e.target.value)}
                style={{width:'90%', padding:'6px 8px', border:'1px solid #ccc', borderRadius:4}}
                placeholder="Author name"
              />
            </td>
          </tr>
          <tr style={{height:50}}>
            <td style={{paddingLeft:16}}>Select Book</td>
            <td style={{paddingLeft:16}}>
              <select 
                value={selectedBook} 
                onChange={e=>setSelectedBook(e.target.value)}
                style={{width:'90%', padding:'6px 8px', border:'1px solid #ccc', borderRadius:4}}
              >
                <option value="">-- Select Available Book --</option>
                {availableBooks.map(book => (
                  <option key={book.serialNo} value={book.serialNo}>
                    {book.name} ({book.author})
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr style={{height:50}}>
            <td style={{paddingLeft:16}}>Status</td>
            <td style={{paddingLeft:16}}>
              <select 
                value={status} 
                onChange={e=>setStatus(e.target.value)}
                style={{width:'90%', padding:'6px 8px', border:'1px solid #ccc', borderRadius:4}}
              >
                <option value="All">All</option>
                <option value="Available">Available</option>
                <option value="Issued">Issued</option>
              </select>
            </td>
          </tr>
          <tr style={{height:20}}><td colSpan="2"></td></tr>
          <tr style={{height:60}}>
            <td colSpan="2" style={{textAlign:'center'}}>
              <button 
                onClick={handleBack}
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
                Back
              </button>
              <button 
                onClick={handleSearch}
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
                Search
              </button>
            </td>
          </tr>
          {error && (
            <tr>
              <td colSpan="2" style={{textAlign:'center', color:'red', paddingTop:8}}>{error}</td>
            </tr>
          )}
        </tbody>
      </table>
    </TransactionLayout>
  )
}
