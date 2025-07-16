import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'book_notes',
  password: 'NICER312',
  port: 4717,
});

export default pool;
