import React, { useState, useEffect } from 'react';
import { bookService } from '../services/bookService';
import { userService } from '../services/userService';
import { Book, Plus, Trash2, X, Heart, Search, CheckCircle, XCircle, Bookmark, BookmarkPlus, BookmarkMinus } from 'lucide-react';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentUser, setCurrentUser] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', available: true });
  const [addingBook, setAddingBook] = useState(false);

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [newRequest, setNewRequest] = useState({ title: '', author: '' });
  const [requesting, setRequesting] = useState(false);

  const fetchData = async () => {
    try {
      const [booksData, requestsData, wishlistData, userData] = await Promise.all([
        bookService.getAllBooks(),
        bookService.getAllRequests(),
        userService.getWishlist(),
        userService.getCurrentUser()
      ]);
      setBooks(booksData);
      setRequests(requestsData);
      setWishlist(wishlistData);
      setCurrentUser(userData);
    } catch (err) {
      setError('Failed to fetch data. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.deleteBook(id);
        setBooks(books.filter(b => b.id !== id));
      } catch (err) {
        alert('Failed to delete. You might not have admin permissions.');
      }
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddingBook(true);
    try {
      const added = await bookService.createBook(newBook);
      setBooks([...books, added]);
      setShowAddForm(false);
      setNewBook({ title: '', author: '', available: true });
    } catch (err) {
      alert('Failed to add book. You might need admin privileges.');
    } finally {
      setAddingBook(false);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setRequesting(true);
    try {
      const added = await bookService.createRequest(newRequest);
      setRequests([...requests, added]);
      setShowRequestForm(false);
      setNewRequest({ title: '', author: '' });
    } catch (err) {
      alert('Failed to request book.');
    } finally {
      setRequesting(false);
    }
  };

  const handleApproveRequest = async (id) => {
    try {
      await bookService.approveRequest(id);
      fetchData(); // Refresh to show newly added book and updated request status
    } catch (err) {
      alert('Failed to approve request. You might not have admin permissions.');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const updated = await bookService.toggleAvailability(id);
      setBooks(books.map(b => b.id === id ? updated : b));
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleInterest = async (id) => {
    try {
      const updated = await bookService.incrementInterest(id);
      setBooks(books.map(b => b.id === id ? updated : b));
    } catch (err) {
      alert('Failed to mark interest.');
    }
  };

  const handleToggleWishlist = async (book) => {
    try {
      const inWishlist = wishlist.some(w => w.id === book.id);
      if (inWishlist) {
        const updatedList = await userService.removeFromWishlist(book.id);
        setWishlist(updatedList);
      } else {
        const updatedList = await userService.addToWishlist(book.id);
        setWishlist(updatedList);
      }
    } catch (err) {
      alert('Failed to update wishlist.');
    }
  };

  const filteredBooks = books.filter(b => 
    (b.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
    (b.author?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-wrapper container animate-fade-in">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <div>
          <h1>Welcome {currentUser?.username || 'User'}!</h1>
          <p style={{color: 'var(--text-secondary)'}}>Manage your library and requested books</p>
        </div>
        <div style={{display: 'flex', gap: '1rem'}}>
          {!showRequestForm && (
            <button className="btn btn-secondary" onClick={() => setShowRequestForm(true)}>
              Request Book
            </button>
          )}
          {currentUser?.role === 'ADMIN' && !showAddForm && (
            <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
              <Plus size={18} /> Add Book
            </button>
          )}
        </div>
      </div>

      {/* Add Dashboard Analytics summary here */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary)' }}>{books.length}</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Total Books</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--success)' }}>{books.filter(b => b.available).length}</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Available Now</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--secondary)' }}>{wishlist.length}</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>In Wishlist</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--danger)' }}>{requests.length}</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Books Wanted</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Book Search */}
      <div className="form-group" style={{ position: 'relative', marginBottom: '2rem' }}>
        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input 
          type="text" 
          className="form-input" 
          placeholder="Search books by title or author..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '3rem' }}
        />
      </div>

      {showAddForm && (
        <div className="glass-panel animate-fade-in" style={{padding: '2rem', marginBottom: '2rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <h3 style={{margin: 0}}>Add New Book</h3>
            <button className="btn btn-secondary" style={{padding: '0.5rem'}} onClick={() => setShowAddForm(false)}>
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleAddSubmit} style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end'}}>
            <div className="form-group" style={{flex: '1 1 200px', marginBottom: 0}}>
              <label className="form-label">Title</label>
              <input type="text" className="form-input" required value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} />
            </div>
            <div className="form-group" style={{flex: '1 1 200px', marginBottom: 0}}>
              <label className="form-label">Author</label>
              <input type="text" className="form-input" required value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} />
            </div>
            <div className="form-group" style={{marginBottom: 0, paddingBottom: '0.75rem'}}>
              <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)'}}>
                <input type="checkbox" checked={newBook.available} onChange={e => setNewBook({...newBook, available: e.target.checked})} />
                Available
              </label>
            </div>
            <button type="submit" className="btn btn-primary" disabled={addingBook}>
              {addingBook ? 'Saving...' : 'Save Book'}
            </button>
          </form>
        </div>
      )}

      {showRequestForm && (
        <div className="glass-panel animate-fade-in" style={{padding: '2rem', marginBottom: '2rem', borderColor: 'var(--secondary)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <h3 style={{margin: 0}}>Request a Book</h3>
            <button className="btn btn-secondary" style={{padding: '0.5rem'}} onClick={() => setShowRequestForm(false)}>
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleRequestSubmit} style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end'}}>
            <div className="form-group" style={{flex: '1 1 200px', marginBottom: 0}}>
              <label className="form-label">Title</label>
              <input type="text" className="form-input" required value={newRequest.title} onChange={e => setNewRequest({...newRequest, title: e.target.value})} />
            </div>
            <div className="form-group" style={{flex: '1 1 200px', marginBottom: 0}}>
              <label className="form-label">Author</label>
              <input type="text" className="form-input" required value={newRequest.author} onChange={e => setNewRequest({...newRequest, author: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-secondary" disabled={requesting}>
              {requesting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)'}}>Loading data...</div>
      ) : (
        <>
          {wishlist.length > 0 && (
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bookmark size={24} color="var(--primary)" /> My Wishlist
              </h2>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem'}}>
                {wishlist.map((book) => (
                  <div key={book.id} className="glass-panel" style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', borderLeft: '4px solid var(--primary)'}}>
                    <h3 style={{margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)'}}>{book.title}</h3>
                    <p style={{color: 'var(--text-secondary)', marginBottom: '1rem', flex: 1}}>By {book.author}</p>
                    <button className="btn btn-secondary" style={{padding: '0.5rem', width: 'fit-content'}} onClick={() => handleToggleWishlist(book)}>
                      <BookmarkMinus size={16} /> Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h2 style={{ marginBottom: '1.5rem' }}>Library Collection</h2>
          {filteredBooks.length === 0 ? (
            <div className="glass-panel" style={{textAlign: 'center', padding: '4rem 2rem', marginBottom: '3rem'}}>
              <Book size={48} color="var(--text-secondary)" style={{marginBottom: '1rem', opacity: 0.5}} />
              <h3>No books found</h3>
              <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem'}}>Try adjusting your search or add a new book.</p>
            </div>
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem'}}>
              {filteredBooks.map((book) => (
                <div key={book.id} className="glass-panel" style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem'}}>
                    <h3 style={{margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)'}}>{book.title}</h3>
                    <span style={{
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '99px', 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      backgroundColor: book.available ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: book.available ? 'var(--success)' : 'var(--danger)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      cursor: 'pointer'
                    }} onClick={() => handleToggleStatus(book.id)} title="Click to toggle availability">
                      {book.available ? <CheckCircle size={14}/> : <XCircle size={14}/>}
                      {book.available ? 'Available' : 'Issued'}
                    </span>
                  </div>
                  <p style={{color: 'var(--text-secondary)', marginBottom: '1rem', flex: 1}}>By {book.author}</p>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: 'var(--glass-border)'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <button className="btn btn-secondary" style={{padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}} onClick={() => handleInterest(book.id)}>
                        <Heart size={16} color="var(--danger)" />
                        <span>{book.interestedCount || 0}</span>
                      </button>
                      
                      <button className="btn btn-secondary" style={{padding: '0.5rem'}} onClick={() => handleToggleWishlist(book)} title="Wishlist">
                        {wishlist.some(w => w.id === book.id) ? <BookmarkMinus size={16} color="var(--primary)" /> : <BookmarkPlus size={16} />}
                      </button>
                    </div>
                    <button className="btn btn-danger" style={{padding: '0.5rem'}} onClick={() => handleDelete(book.id)} title="Delete Book">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {requests.length > 0 && (
            <>
              <h2 style={{ marginBottom: '1.5rem', marginTop: '2rem' }}>Books Wanted by Users</h2>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
                {requests.map((req) => (
                  <div key={req.id} className="glass-panel" style={{padding: '1.5rem', borderLeft: '4px solid var(--secondary)'}}>
                    <h3 style={{margin: 0, fontSize: '1.1rem'}}>{req.title}</h3>
                    <p style={{color: 'var(--text-secondary)', margin: '0.5rem 0 0 0'}}>By {req.author}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', backgroundColor: req.status === 'APPROVED' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.1)', color: req.status === 'APPROVED' ? 'var(--success)' : 'inherit', borderRadius: '4px' }}>
                        Status: {req.status}
                      </span>
                      {currentUser?.role === 'ADMIN' && req.status !== 'APPROVED' && (
                        <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleApproveRequest(req.id)}>
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
