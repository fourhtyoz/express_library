import styles from './LeftMenu.module.scss'

export default function LeftMenu() {
    return (
        <div className={styles.container}>
            <ul className={styles.list}>
                {/* TODO: get this from the backend */}
                <li>Home page</li>
                <li>All books</li>
                <li>All authors</li>
                <li>All genres</li>
                <li>Add a new book</li>
                <li>Add a new author</li>
                <li>Add a new genre</li>
            </ul>
        </div>
    )
}