import BookItem from "./BookItem"
import { BookType } from "../../types/BookType"

export interface BooksListProps {
    books: BookType[]
}

export default function BooksList({books}:BooksListProps) {
    return (
        <>
            {books.map((item:any, index:number) => <BookItem key={index} title={item.title} author={item.author.first_name}/>)}
        </>
    )
}