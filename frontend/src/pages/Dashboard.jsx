import React, { useState, useEffect } from 'react';
import { bookService } from '../services/bookService';
import { Book, Plus, Trash2, X } from 'lucide-react';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', available: true });
  const [addingBook, setAddingBook] = useState(false);

  const fetchBooks = async () => {
    try {
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (err) {
      setError('Failed to fetch books. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
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

  return (
    <div className="page-wrapper container animate-fade-in">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <div>
          <h1>Your Library</h1>
          <p style={{color: 'var(--text-secondary)'}}>Manage your book collection</p>
        </div>
        {!showAddForm && (
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            <Plus size={18} /> Add Book
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

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

      {loading ? (
        <div style={{textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)'}}>Loading books...</div>
      ) : books.length === 0 ? (
        <div className="glass-panel" style={{textAlign: 'center', padding: '4rem 2rem'}}>
          <Book size={48} color="var(--text-secondary)" style={{marginBottom: '1rem', opacity: 0.5}} />
          <h3>No books found</h3>
          <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem'}}>Get started by adding your first book.</p>
          {!showAddForm && (
            <button className="btn btn-primary" onClick={() => setShowAddForm(true)}><Plus size={18} /> Add New Book</button>
          )}
        </div>
      ) : (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem'}}>
          {books.map((book) => (
            <div key={book.id} className="glass-panel" style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                <h3 style={{margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)'}}>{book.title}</h3>
                <span style={{
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '99px', 
                  fontSize: '0.75rem', 
                  fontWeight: '600',
                  backgroundColor: book.available ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: book.available ? 'var(--success)' : 'var(--danger)'
                }}>
                  {book.available ? 'Available' : 'Issued'}
                </span>
              </div>
              <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1}}>By {book.author}</p>
              
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '1rem', borderTop: 'var(--glass-border)'}}>
                <button className="btn btn-danger" style={{padding: '0.5rem'}} onClick={() => handleDelete(book.id)} title="Delete Book">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
