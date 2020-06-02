import React, {useState, useEffect} from 'react';
import firebase from 'firebase';
import '../style/game.css';
import './style/game-vote.css';

export default function GameVote({category, letter, answer, answerId, playerList, giveUpId, setLocalGaveUp}) {
    useEffect(() => {
        setLocalGaveUp(false);
    }, [])

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
                        {
                            giveUpId === "" ?
                            <div className="bottom">
                                No one gave up in time. No one gets the point.
                            </div>
                            :
                            <div className="bottom">
                                Someone gave up and no one answered! Point goes to: &lt;
                                <span>
                                {
                                    playerList[giveUpId] ?
                                    playerList[giveUpId].name
                                    :
                                    "Loading Name"
                                }
                                </span>
                                &gt;
                            </div>
                        }
                    </>
                }
                
            </div>      
        </div>
    )
}