import BookItem from "./BookItem"
import { BooksListProps } from "../../common/interfaces"

export default function BooksList({books}:BooksListProps) {
    return (
        <>
            {books.map((item:any, index:number) => <BookItem key={index} title={item.title} author={item.author.first_name}/>)}
        </>
    )
}