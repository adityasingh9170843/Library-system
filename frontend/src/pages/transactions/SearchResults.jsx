import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import TransactionLayout from '../../components/TransactionLayout'

export default function SearchResults(){
  const location = useLocation()
  const navigate = useNavigate()
  const results = location.state?.results || []
  const [selectedSerial, setSelectedSerial] = useState('')

  return (
    <TransactionLayout>
      <table className="menu-table" style={{width:'100%', maxWidth:1200}}>
        <tbody>
          <tr style={{height:50, backgroundColor:'#f0f0f0'}}>
            <td colSpan="5" style={{textAlign:'center', fontWeight:'bold', fontSize:18}}>Book Availability</td>
          </tr>
          <tr style={{height:40, backgroundColor:'#e8f4f8'}}>
            <td style={{width:'25%', paddingLeft:16, fontWeight:'bold'}}>Book Name</td>
            <td style={{width:'25%', paddingLeft:16, fontWeight:'bold'}}>Author Name</td>
            <td style={{width:'20%', paddingLeft:16, fontWeight:'bold'}}>Serial Number</td>
            <td style={{width:'15%', paddingLeft:16, fontWeight:'bold'}}>Available</td>
            <td style={{width:'15%', paddingLeft:16, fontWeight:'bold'}}>Select to issue the book</td>
          </tr>
          {results.length === 0 ? (
            <tr style={{height:50}}>
              <td colSpan="5" style={{textAlign:'center', color:'#666'}}>No results found</td>
            </tr>
          ) : (
            results.map(book => (
              <tr key={book.id || book._id} style={{height:40}}>
                <td style={{paddingLeft:16}}>{book.name}</td>
                <td style={{paddingLeft:16}}>{book.author}</td>
                <td style={{paddingLeft:16}}>{book.serialNo}</td>
                <td style={{paddingLeft:16}}>{book.status === 'Available' ? 'Y' : 'N'}</td>
                <td style={{paddingLeft:16}}>
                  <input 
                    type="radio" 
                    name="bookSelect" 
                    value={book.serialNo}
                    checked={selectedSerial === book.serialNo}
                    onChange={(e) => setSelectedSerial(e.target.value)}
                  />
                  <span style={{marginLeft:8}}>radio button</span>
                </td>
              </tr>
            ))
          )}
          <tr style={{height:20}}><td colSpan="5"></td></tr>
          <tr style={{height:60}}>
            <td colSpan="5" style={{textAlign:'center'}}>
              <button 
                onClick={() => navigate('/transactions/check')}
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
                Search
              </button>
              <button 
                onClick={() => navigate('/transactions')}
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
                Cancel
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Removed bottom note for cleaner UI */}
    </TransactionLayout>
  )
}
