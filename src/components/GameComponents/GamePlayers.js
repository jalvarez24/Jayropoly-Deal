import React, {useState} from 'react'
import '../style/game.css'
import './style/game-players.css'

export default function GamePlayers({playerList, scoreTarget}) {

    return (
        <div className="game-component">
            <div className="player-scores-div">
                <div className="player-scores">
                    <span className="scores-label">Scores:</span>
                    <ul>
                    {   
                        Object.entries(playerList).map(([key, value]) => {
                            return <li key={key}>
                                <span className="li-name" style={{fontWeight: "bold"}}>
                                    {value.name}
                                </span>
                                <span className="li-score" style={{color: "red", fontWeight: "bold"}}> 
                                    <span>{value.score}</span>
                                </span>
                            </li>              
                        })
                    }
                    <div className="players-target-score-label">Score Target: {scoreTarget}</div>
                    </ul>
                </div>
            </div>
        </div>
    )
}