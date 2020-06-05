import React from 'react'
import '../style/game.css'
import './style/game-players.css'
import { isPending } from 'q';

export default function GamePlayers({playerList}) {
    return (
        <div className="game-component">
            <div className="player-scores-div">
                <div className="player-scores">
                    <span>Player Scores:</span>
                    <ul>
                    {
                        Object.entries(playerList).map(([key, value]) => {   
                            return <li key={key}>
                                <span style={{fontWeight: "bold"}}>{value.name}</span>
                                <span style={{color: "red", fontWeight: "bold"}}> 
                                {value.score}
                                </span>
                            </li>              
                        })
                    }
                    </ul>
                </div>
                <div className="player-status">
                    <span>Player Status:</span>
                    <ul>
                    {
                        Object.entries(playerList).map(([key, value]) => {   
                            return <li key={key}>
                                <span style={{fontWeight: "bold"}}>{value.name}</span>
                                <span style={{color: "red", fontWeight: "bold"}}> 
                                {
                                    value.answer === false ?
                                    "none..." :
                                    "answer!"
                                }
                                </span>
                            </li>              
                        })
                    }
                    </ul>
                </div>
            </div>
        </div>
    )
}