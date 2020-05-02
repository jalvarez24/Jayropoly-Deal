import React, {useState, useEffect} from 'react'
import Player from './Player';
import firebase from '../firebase';

export default function Game(props) {
    const [counter, setCounter] = useState(0);

    function increase (){
        setCounter(counter + 1);
    }

    return(
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