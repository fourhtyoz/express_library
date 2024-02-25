import { BookItemProps } from "../../common/interfaces"

export default function BookItem({title, author}: BookItemProps) {
        return (
        <>
            {title} by {author}
        </>
    )

}