import React from 'react';
import '../App.css';
import Javi from  "../images/javinav300.jpg"
import {Link} from 'react-router-dom';

export default function Nav() {
    return (
        <nav className="navBar">
            <Link className="nav-logo" to="/">
                <h1 style={{fontSize: "3em", textDecoration: "none"}}>I GOT IT FAM!</h1>
            </Link>       
            {/* <img src={Javi}></img> */}
            <ul className="nav-links">
                <Link className="nav-link" to="/">
                        <li>Home</li>
                </Link>
                <Link className="nav-link" to="/instructions">
                        <li>Instructions</li>
                </Link>
            </ul>   
        </nav>
    );
}