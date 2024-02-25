import { useState } from 'react'
import styles from './LeftMenu.module.scss'
import cn from 'classnames';


export default function LeftMenu() {
    const [hidden, setHidden] = useState(true);

    return (
        <div className={cn(styles.container, {hidden: hidden})} onClick={() => setHidden(prev => !prev)}>
            {!hidden &&
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
            }
        </div>
    )
}