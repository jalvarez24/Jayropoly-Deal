import React from 'react';
import '../App.css';
import {Link} from 'react-router-dom';

export default function Nav() {

    const navStyle = {
        color: "purple",
        textDecoration: "none"
    }

    return (
        <nav className="navBar">
            <h1>I GOT IT FAM!</h1>
            <ul className="nav-links">
                <Link style={navStyle} to="/">
                        <li>Home</li>       
                </Link>
                {/* <Link style={navStyle} to="/cards">
                    <li>Cards</li>
                </Link> */}
            </ul>
        </nav>
    );
}