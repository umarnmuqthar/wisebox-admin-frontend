import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Home.module.scss'
import wiseboxIcon from './assets/icons/wisebox.png'

const Home = () => {
    return (
        <div style={{height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {/* <Link to="admin">Admin Dashboard</Link>
            <br />
            <Link to="teacher">Teacher's Dashboard</Link> */}

            <div style={{height: '15em'}} className={styles.object}>
                <img src={wiseboxIcon} height="100%" style={{objectFit: 'contain'}} width="100%" alt="wisebox" />
            </div>
        </div>
    )
}

export default Home
