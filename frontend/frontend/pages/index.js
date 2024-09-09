import { useState, useEffect } from 'react';
import axios from 'axios';


const searchBook = async (isbn) => {
    try {
        const res = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
        return res.data[`ISBN:${isbn}`];
    } catch (error) {
        console.error("Erreur lors de la recherche du livre :", error);
    }
};

const Home = () => {
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({ title: '', author: '', year: '', isbn: '' });

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await axios.get('http://localhost:5000/books');
            setBooks(res.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des livres:', error);
        }
    };

    const addBook = async () => {
        try {
            await axios.post('http://localhost:5000/books', newBook);
            setNewBook({ title: '', author: '', year: '', isbn: ''});
            fetchBooks();
        } catch (error) {
            console.error('Erreur lors de l\'ajout du livre:', error);
        }
    };

    const fetchBookInfo = async (isbn) => {
        const bookInfo = await searchBook(isbn);
        if (bookInfo) {
            setNewBook({
                title: bookInfo.title || '',
                author: bookInfo.authors ? bookInfo.authors[0].name : '',
                year: bookInfo.publish_date || '',
                isbn: isbn,
            });
        }
    };

    return (
        <div>
            <h1>Gestion des livres</h1>
            <div>
                <input 
                    type="text" 
                    placeholder="Titre" 
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} 
                />
                <input 
                    type="text" 
                    placeholder="Auteur" 
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} 
                />
                <input 
                    type="text" 
                    placeholder="Année" 
                    value={newBook.year}
                    onChange={(e) => setNewBook({ ...newBook, year: e.target.value })} 
                />
                <input 
                    type="text" 
                    placeholder="ISBN" 
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })} 
                    onBlur={(e) => fetchBookInfo(e.target.value)} 
                />
                <button onClick={addBook}>Ajouter</button>
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
