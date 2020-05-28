import React from 'react'
import '../style/game.css'
import './style/game-control.css'

export default function GameControl({roundStartTime}) {
    return (
        <div className="game-component game-control">
            <div className="game-control-div">
                {
                    roundStartTime < Date.now() ?
                    <>
                        <input className="control-input" autoFocus/>
                        <div className="give-up-container">
                            <button className="give-up">Give Up</button>
                        </div> 
                    </>      
                    :
                    <span className="loading-span">GET READY TO ANSWER!</span>
                }
            </div>
        </div>
    )
}
