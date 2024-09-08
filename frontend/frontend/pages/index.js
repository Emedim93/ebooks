import { useState, useEffect } from 'react';
import axios from 'axios';

const searchBook = async (isbn) => {
    const res = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
    return res.data['ISBN:${isbn'];
};


const fetchBookInfo = async (isbn) => {
    const bookInfo = await searchBook(isbn);
    console.log(bookInfo); //Affichez les informations dans la console pour voir ce que l'API retourne
}
const Home = () => {
    const [books, setBooks] = useState([]);
    const [newbooks, setNewBooks] = useState({ title: '',  author: '', year: '', isbn: ''});

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        const res = await axios.get('http://localhost: 5000/books');
        setBooks(res.data);
    };

    const addBook = async () => {
        await axios.post('http://localhost:5000/books', newBook);
        fetchBooks(); // Met à jour la liste des livres
    };

    return (
        <div>
            <h1>Gestions des livres</h1>
            <div>
            <input type="text" placeholder="Titre" onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} />
                <input type="text" placeholder="Auteur" onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} />
                <input type="text" placeholder="Année" onChange={(e) => setNewBook({ ...newBook, year: e.target.value })} />
                <input type="text" placeholder="ISBN" onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })} />
                <button onclick={addBook}>Ajouter</button>
            </div>
            <h2>Liste des livres</h2>
            <ul>
                {books.map((book) => (
                    <li key={book.id}>
                        {book.title} - {book.author} ({book.year})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;