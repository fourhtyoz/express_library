import { useEffect, useState } from "react"
import BooksList from "../books/BooksList"
import axios from "axios"
import styles from './Main.module.scss'


export default function Main() {
    const [books, setBooks] = useState([])
    const [error, setError] = useState('')
    useEffect(() => {
        async function getBooks() {
            // TODO: refactor this
            const res = await axios.get('http://localhost:4000/catalog/books')
            if (res.status === 200) {
                setBooks(res.data.books)
            } else {
                setError('We are sorry. We did not manage to make an API request. Please try again later')

            }
        }
        getBooks()

    }, [])

    console.log(books)

    return (
        <div className={styles.wrapper}>
        {error 
        ? 
        <div className="error">error</div>
        :
        <div className={styles.container}>
            <h1 className={styles.title}>Books</h1>
            <BooksList books={books} />
        </div>
        }
        </div>
    )    
}