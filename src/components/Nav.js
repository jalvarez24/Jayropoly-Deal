import React from 'react';
import '../App.css';
import {Link} from 'react-router-dom';

const Nav = () => {

    const navStyle = {
        color: "purple",
        textDecoration: "none"
    }

    return (
        <nav>
            <h1>NavBar</h1>
            <ul className="nav-links">
                <Link style={navStyle} to="/">
                    <li>Home</li>
                </Link>
                <Link style={navStyle} to="/cards">
                    <li>Cards</li>
                </Link>
            </ul>
        </nav>
    );
}

export default Nav;