import React from 'react'
import '../style/game.css'
import './style/player-scores.css'

export default function GamePlayers() {
    return (
        <div className="game-component">
            <div className="player-scores-div">
                <div className="player-scores">
                    <span>Player Scores:</span>
                    <ul>
                        <li>
                            Item1
                        </li>
                        <li>
                            Item2
                        </li>
                        <li>
                            Item3
                        </li>
                        <li>
                            Item4
                        </li>
                        <li>
                            Item5
                        </li>
                        <li>
                            Item6
                        </li>
                    </ul>
                </div>
                <div className="player-status">
                    <span>Player Status:</span>
                    <ul>
                        <li>
                            Item1
                        </li>
                        <li>
                            Item2
                        </li>
                        <li>
                            Item3
                        </li>
                        <li>
                            Item4
                        </li>
                        <li>
                            Item5
                        </li>
                        <li>
                            Item6
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}