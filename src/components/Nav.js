import React from 'react';
import '../App.css';
import Javi from  "../images/javibanner.jpg"
import {Link} from 'react-router-dom';

export default function Nav() {
    return (
        <nav className="navBar">
            {/* <Link className="nav-logo" to="/">
                <h1 style={{fontSize: "3em", textDecoration: "none"}}>I GOT IT FAM!</h1>
            </Link>        */}
            <Link className="pic-logo" to="/">
                <img src={Javi}></img>
                <div>
                    <h2>I GOT IT</h2>
                    <h1>FAM!</h1>
                </div>
            </Link>       
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