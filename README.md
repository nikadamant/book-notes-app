# Book Notes App

Track your non-fiction book notes, reviews, ratings, and covers!

## Setup

1. Install dependencies:
npm install

markdown
Copy
Edit

2. Run the app:
nodemon index.js

sql
Copy
Edit

3. Visit: `http://localhost:3000`

## DB Setup

Make sure PostgreSQL is running. Create a DB called `book_notes`, and run:

```sql
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    review TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 10),
    cover_url TEXT,
    read_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);