import express from 'express';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import env from 'dotenv';

env.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});
db.connect();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Home Page
app.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM books ORDER BY read_date DESC');
  const books = result.rows;
  res.render('index', { books });
});

// Add New
app.get('/books/new', (req, res) => {
  res.render('new');
});

app.post('/books', async (req, res) => {
  const { title, author, review, rating, read_date, isbn } = req.body;
  const cover_url = `http://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
  await db.query(
    'INSERT INTO books (title, author, review, rating, cover_url, read_date) VALUES ($1, $2, $3, $4, $5, $6)',
    [title, author, review, rating, cover_url, read_date]
  );
  res.redirect('/');
});

// View One
app.get('/books/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await db.query('SELECT * FROM books WHERE id = $1', [id]);
  res.render('show', { book: rows[0] });
});

// Edit
app.get('/books/:id/edit', async (req, res) => {
  const { id } = req.params;
  const { rows } = await db.query('SELECT * FROM books WHERE id = $1', [id]);
  res.render('edit', { book: rows[0] });
});

app.post('/books/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, review, rating, read_date } = req.body;
  await db.query(
    'UPDATE books SET title = $1, author = $2, review = $3, rating = $4, read_date = $5 WHERE id = $6',
    [title, author, review, rating, read_date, id]
  );
  res.redirect(`/books/${id}`);
});

// Delete
app.post('/books/:id/delete', async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM books WHERE id = $1', [id]);
  res.redirect('/');
});

app.listen(3000, () => console.log('🌐 Server running at http://localhost:3000'));
