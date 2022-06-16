import styles from '../styles/Header.module.scss'
import {useState} from "react";
export default function HeaderSearch() {
    const [search, setSearch] = useState('')
    const [searchable, setSearchable] = useState(false);
    return (
        <>
            <form className={styles.search_form} action="search">
                <input onChange={e => { setSearch(e.target.value) }} value={search} type="text" name='value'/>
                {search &&
                    <button type='submit'>Search</button>
                }
            </form>
        </>
    )
}