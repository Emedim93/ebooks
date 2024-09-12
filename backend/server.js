const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();
const cors = require('cors');
const app = express();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/books', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books');
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des livres:', err.message);
        res.status(500).send('Server error');
    }
});

app.post('/books', async (req, res) => {
    try {
        const { title, author, year, isbn } = req.body;
        const newBook = await pool.query(
            'INSERT INTO books (title, author, year, isbn) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, author, year, isbn]
        );
        res.json(newBook.rows[0]);
    } catch (err) {
        console.log('Erreur lors de l\'ajout du livre:', err.message);
        res.status(500).send('Server error');
    }
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});