const express = require('express'); // création de express pour initialiser les routes
const { Pool } = require('pg');
require('dotenv').config();
const app = express();

const pool = new Pool({
    connectionString: 'postgres://user:password@localhost:5432/ebookdb'
});

const cors = require('cors');
app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.json());


//TEST de la route de base
app.get('/', (req, res) => {
    res.send('Can i have some beer!');
});

app.get('/books', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }       
});

app.post('/books', async (req, res) => {
    try{
        const { title, author, year, isbn } = req.body;
        const newBook = await pool.query(
            'INSERT INTO books (title, author, year, isbn) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, author, year, isbn]
        );
        res.json(newBook.rows[0]);
    }   catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});


app.delete('/books/:id', async (req,res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM books WHERE id = $1', [id]);
        res.json('Book deleted');
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});