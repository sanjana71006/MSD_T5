const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const BOOKS_FILE = path.join(__dirname, 'books.json');

// Middleware
app.use(express.json());

// Helper function to read books from file
const readBooks = () => {
  try {
    if (!fs.existsSync(BOOKS_FILE)) {
      fs.writeFileSync(BOOKS_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(BOOKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading books file:', error);
    return [];
  }
};

// Helper function to write books to file
const writeBooks = (books) => {
  try {
    fs.writeFileSync(BOOKS_FILE, JSON.stringify(books, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing books file:', error);
    return false;
  }
};

// GET /books/available - Return only available books
app.get('/books/available', (req, res) => {
  try {
    const books = readBooks();
    const availableBooks = books.filter(book => book.available === true);
    res.json(availableBooks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve available books' });
  }
});

// GET /books - Return all books
app.get('/books', (req, res) => {
  try {
    const books = readBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve books' });
  }
});

// POST /books - Add a new book
app.post('/books', (req, res) => {
  try {
    const { title, author, available } = req.body;

    // Validation
    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }

    const books = readBooks();
    
    // Generate auto-increment ID
    const newId = books.length > 0 
      ? Math.max(...books.map(book => book.id)) + 1 
      : 1;

    const newBook = {
      id: newId,
      title,
      author,
      available: available !== undefined ? available : true
    };

    books.push(newBook);

    if (writeBooks(books)) {
      res.status(201).json(newBook);
    } else {
      res.status(500).json({ error: 'Failed to save book' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create book' });
  }
});

// PUT /books/:id - Update a book
app.put('/books/:id', (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    
    if (isNaN(bookId)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    const books = readBooks();
    const bookIndex = books.findIndex(book => book.id === bookId);

    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const { title, author, available } = req.body;

    // Update only provided fields
    if (title !== undefined) books[bookIndex].title = title;
    if (author !== undefined) books[bookIndex].author = author;
    if (available !== undefined) books[bookIndex].available = available;

    if (writeBooks(books)) {
      res.json(books[bookIndex]);
    } else {
      res.status(500).json({ error: 'Failed to update book' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// DELETE /books/:id - Delete a book
app.delete('/books/:id', (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    
    if (isNaN(bookId)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    const books = readBooks();
    const bookIndex = books.findIndex(book => book.id === bookId);

    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const deletedBook = books.splice(bookIndex, 1)[0];

    if (writeBooks(books)) {
      res.json({ message: 'Book deleted successfully', book: deletedBook });
    } else {
      res.status(500).json({ error: 'Failed to delete book' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
