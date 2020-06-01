import React from 'react'
import '../style/game.css'
import './style/game-control.css'

export default function GameControl({roundStartTime, roundEndTime, submitAnswer, submitGiveUp, giveUpId, localGaveUp}) {

    return (
        <div className="game-component game-control">
            <div className="game-control-div">
                {
                    roundStartTime > Date.now() ?
                    <span className="loading-span">GET READY TO ANSWER!</span>
                    :
                    <>
                    {
                        localGaveUp === false ?
                        <>
                            <input className="control-input" autoFocus onKeyDown={(e) => {submitAnswer(e)}}/>
                            <div className="give-up-container">
                                <button className="give-up" onClick={(e) => {submitGiveUp(e)}}>Give Up</button>
                            </div>
                        </>
                        :
                        <>
                        {
                            giveUpId === localStorage.getItem('userId') ?
                            <span className="loading-span">First to give up!</span>
                            :
                            <span className="loading-span">Somebody beat you to it!</span>
                        }
                        </>
                    }
                    </>
                }
            </div>
        </div>
    )
}
