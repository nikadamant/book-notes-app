const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const pool = require('./db');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM books ORDER BY read_date DESC');
  res.render('index', { books: rows });
});

app.get('/books/new', (req, res) => {
  res.render('new');
});

app.post('/books', async (req, res) => {
  const { title, author, review, rating, read_date } = req.body;
  const cover_url = `http://covers.openlibrary.org/b/ISBN/${req.body.isbn}-L.jpg`;
  await pool.query(
    'INSERT INTO books (title, author, review, rating, cover_url, read_date) VALUES ($1, $2, $3, $4, $5, $6)',
    [title, author, review, rating, cover_url, read_date]
  );
  res.redirect('/');
});

app.get('/books/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
  res.render('show', { book: rows[0] });
});

app.get('/books/:id/edit', async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
  res.render('edit', { book: rows[0] });
});

app.post('/books/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, review, rating, read_date } = req.body;
  await pool.query(
    'UPDATE books SET title = $1, author = $2, review = $3, rating = $4, read_date = $5 WHERE id = $6',
    [title, author, review, rating, read_date, id]
  );
  res.redirect(`/books/${id}`);
});

app.post('/books/:id/delete', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM books WHERE id = $1', [id]);
  res.redirect('/');
});

app.listen(3000, () => console.log('Server on http://localhost:3000'));
