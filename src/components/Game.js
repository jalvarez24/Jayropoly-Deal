import React, {useState, useEffect} from 'react'
import Player from './Player';
import firebase from '../firebase';
import {Redirect} from 'react-router-dom';


export default function Game(props) {

    const [redirect, setRedirect] = useState(() => {

        let game = localStorage.getItem("inGame");
        let lobby = localStorage.getItem("inLobby");
        
        if(game && game !== "false"){
            return null;
        }
        else if (lobby && lobby === "true") return '/lobby';
        return '/';
    });

    return(
        redirect?
        <Redirect to={redirect}/>
        :
        <div style={{backgroundColor: "grey"}}>
            <div style={{width: "800px", height: "500px", backgroundColor: "lightblue"}}>
                <h1 style={{marginTop: 0}}>Playing Field:</h1>
                <div style={{display: "inline"}}>
                    Category:
                </div>
                <div style={{display: "inline"}}>
                    Letter:
                </div>
            </div>
        </div>
    )
}