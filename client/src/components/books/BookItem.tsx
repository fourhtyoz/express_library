import { BookItemProps } from "../../common/interfaces"
import styles from './BookItem.module.scss'

export default function BookItem({title, author}: BookItemProps) {
        return (
        <div className={styles.container}>
            <p>{title}</p>
            <p>{author}</p>
        </div>
    )

}