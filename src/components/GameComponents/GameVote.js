import React, {useState, useEffect} from 'react';
import firebase from 'firebase';
import '../style/game.css';
import './style/game-vote.css';
import { isEmptyStatement } from '@babel/types';

export default function GameVote({category, letter, answer, answerId, playerList, giveUpId, setLocalGaveUp}) {

    useEffect(() => {
        setLocalGaveUp(false);
    }, []);

    useEffect(() => {
        if(JSON.stringify(playerList) !== '{}') {
            console.log("playerList: " + (JSON.stringify(playerList)));
            //check if players have voted
        }
    }, [playerList]);

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
                            <span>answered: {answer}</span>
                        </div>
                        <div className="bottom">
                            <span>Vote! Give them a point?</span>
                        </div>
                    </>
                    :
                    <>
                       <div className="top">
                           <span>No one answered in time!</span>
                        </div>
                        {
                            giveUpId === "" ?
                            <div className="bottom">
                                <span>No one gave up in time. No one gets the point.</span>
                            </div>
                            :
                            <div className="bottom">
                                <span>
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
                                </span>
                            </div>
                        }
                    </>
                }
                
            </div>      
        </div>
    )
}