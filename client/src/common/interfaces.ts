import { BookType } from "./types"


export interface BookItemProps {
    title: string,
    author: string    
}

export interface BooksListProps {
    books: BookType[]
}