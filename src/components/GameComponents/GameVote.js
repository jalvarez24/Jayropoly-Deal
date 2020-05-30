import React, {useState, useEffect} from 'react';
import firebase from 'firebase';
import '../style/game.css';
import './style/game-vote.css';
import { blue } from 'color-name';

export default function GameVote({category, letter, answer, answerId, playerList}) {
    
    return (
        <div className="game-vote-container">
            <div className="game-vote">
                {
                    answer !== "" && answerId !== "" ?
                    <>
                        <div className="top">
                            <span style={{fontWeight: "bold", color: "blue"}}>
                                {
                                    playerList[answerId] ?
                                    playerList[answerId].name + " "
                                    :
                                    "Loading Name"
                                }
                            </span>
                            answered: {answer}
                        </div>
                        <div className="bottom">
                            Vote! Give them a point?
                        </div>
                    </>
                    :
                    <>
                       <div className="top">
                            No one answered in time!
                        </div>
                        <div className="bottom">
                            Point goes to: &lt;Player Name&gt;
                        </div>
                    </>
                }
                
            </div>      
        </div>
    )
}