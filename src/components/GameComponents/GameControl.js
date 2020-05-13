import React from 'react'
import '../style/game.css'
import './style/game-control.css'

export default function GameControl() {
    return (
        <div className="game-component game-control">
            <div className="game-control-div">
                <input className="control-input"></input>
                <div className="give-up-container">
                    <button className="give-up">Give Up</button>
                </div>
                
            </div>
        </div>
    )
}
