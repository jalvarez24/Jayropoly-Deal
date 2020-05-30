import React from 'react'
import '../style/game.css'
import './style/game-control.css'

export default function GameControl({roundStartTime, roundEndTime, submitAnswer}) {

    return (
        <div className="game-component game-control">
            <div className="game-control-div">
                {
                    roundStartTime > Date.now() ?
                    <span className="loading-span">GET READY TO ANSWER!</span>
                    :
                    <>
                        <input className="control-input" autoFocus onKeyDown={(e) => {submitAnswer(e)}}/>
                        <div className="give-up-container">
                            <button className="give-up">Give Up</button>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}
