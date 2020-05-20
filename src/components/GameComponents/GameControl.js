import React from 'react'
import '../style/game.css'
import './style/game-control.css'

export default function GameControl({roundEndTime}) {
    return (
        <div className="game-component game-control">
            <div className="game-control-div">
                {
                    roundEndTime < Date.now() ?
                    <>
                        <input className="control-input"/>
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
