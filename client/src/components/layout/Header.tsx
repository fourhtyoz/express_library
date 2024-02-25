import styles from './Header.module.scss'

export default function Header() {
    return (
        <div className={styles.container}>
            {/* TODO: get these from the backend */}
            <h1 className={styles.title}>Library</h1>
            <p className={styles.description}>A lame ass qoute is here</p>
        </div>
    )
}