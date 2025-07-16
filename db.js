const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'book_notes',
  password: 'NICER312',
  port: 4717,
});

module.exports = pool;
