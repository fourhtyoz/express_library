interface BookItemProps {
    title: string,
    author: string    
}

export default function BookItem({title, author}: BookItemProps) {
        return (
        <>
            {title} by {author}
        </>
    )

}