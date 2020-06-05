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
        let playerCount = Object.keys(playerList).length;

        if(playerCount > 0) {
            let votesSubmitted = 0;
            let yesCount = 0;
            let votesNeeded = Math.floor((playerCount - 1) / 2);
            votesNeeded = (playerCount - 1) % 2 === 0 ? votesNeeded : votesNeeded + 1;
            console.log("votesNeeded: " + votesNeeded);
            
            for(let key of Object.keys(playerList)) {
                if(playerList[key].vote !== "") {
                    votesSubmitted++;
                    if(playerList[key].vote === true) yesCount++;
                }
            }

            if(votesSubmitted >= playerCount - 1 || yesCount >= votesNeeded) {
                console.log("All players have voted!");
                //call createNewRound
            }
        }
    }, [playerList]);

    const submitAnswer = async (response) => {
        let gameRef =  await firebase.database().ref().child(`lobbies/${localStorage.getItem("gameId")}`);
        gameRef.child('players').child(localStorage.getItem('userId')).child('vote').set(response);
    } 

    return (
        <div className="game-vote-container">
            <div className="game-vote">
                {
                    answer !== "" && answerId !== "" ?
                    <>
                        <div className="top answer-summary">
                            <span className="category-letter-container">
                                <span className="category-letter">Category: <span>{category}</span> | </span>
                                <span className="category-letter">Letter: <span>{letter}</span></span>
                            </span>
                            <div className="player">
                                <span>
                                    {
                                        playerList[answerId] ?
                                        playerList[answerId].name + " "
                                        :
                                        "Loading Name"
                                    }
                                </span>
                                <span style={{color: "black"}}>answered:</span>
                            </div>
                            <span className="answer">{answer}</span>
                        </div>
                        <div className="bottom">
                            {
                                localStorage.getItem('userId') !== answerId ?
                                <div className="vote-area">
                                    <span className="msg">
                                        Vote! Give<span style={{color: "white"}}>
                                        {
                                            playerList[answerId] ?
                                            " " + playerList[answerId].name + " "
                                            :
                                            "Loading Name"
                                        }
                                        </span>a point?
                                    </span>
                                    <div className="vote-buttons-div">
                                        <button className="yes-button" onClick={() => submitAnswer(true)}>Yes</button>
                                        <button className="no-button" onClick={() => submitAnswer(false)}>No</button>
                                    </div>
                                </div>
                                :
                                <div className="vote-area">
                                    <span className="vote-loading-text">
                                        Players Voting
                                        <span className="loader-vote-dot">.</span>
                                        <span className="loader-vote-dot">.</span>
                                        <span className="loader-vote-dot">.</span>
                                    </span>
                                    <span className="convince-msg">Convince the fam to vote yes.</span>
                                </div>
                            }
                            <div className="player-votes">
                                <span style={{fontWeight: "bold"}}>Player Votes:</span>
                                <ul>
                                {
                                    Object.entries(playerList).map(([key, value]) => {
                                        if(key === answerId) return;
                                        return <li key={key}>
                                            <span style={{fontWeight: "bold"}}>{value.name}</span>
                                            <span style={{color: "red", fontWeight: "bold"}}> 
                                            {
                                                value.vote === "" ?
                                                <span>Hasn't Voted.</span> :
                                                <span>
                                                {
                                                    value.vote === true ?
                                                    "YES" :
                                                    "NO"
                                                }
                                                </span>
                                            }
                                            </span>
                                        </li>              
                                    })
                                }
                                </ul>
                            </div>
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