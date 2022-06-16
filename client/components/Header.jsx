import styles from '../styles/Header.module.scss'
import HeaderSearch from "./header-search";
import Head from "next/head";
import {faHome, faMessage, faSquarePlus} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useState} from "react";
import Link from "next/link";

export default function Header() {
    return (
        <>
            <Head>
                <title>Instgram clone</title>
                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"/>
            </Head>
            <header className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.header__inner}>
                        <a className={styles.header__logo} href={'http://localhost:3000'}>instagram-prototype</a>
                        <HeaderSearch></HeaderSearch>
                        <nav className={styles.header_nav}>
                            <FontAwesomeIcon className={styles.header_icons + styles.active} icon={faHome} />
                            <Link href="/direct"><a><FontAwesomeIcon className={styles.header_icons} icon={faMessage} /></a></Link>
                            <button><FontAwesomeIcon icon={faSquarePlus} className={styles.header_icons}/></button>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    )
}