import React, {useState, useEffect} from 'react';
import firebase from 'firebase';
import '../style/game.css';
import './style/game-vote.css';
import { isEmptyStatement } from '@babel/types';

export default function GameVote({category, letter, answer, answerId, playerList, giveUpId, setLocalGaveUp, hostId, createNewRound}) {

    const [newRoundDetected, setNewRoundDetected] = useState(false);
    const [givePointTo, setGivePointTo] = useState("");
    const [playerVoted, setPlayerVoted] = useState(false);

    useEffect(() => {
        setLocalGaveUp(false);
    }, []);

    // useEffect(() => {
    //     // let playerCount = Object.keys(playerList).length;

    //     // if(playerCount > 0) {
    //     //     let votesSubmitted = 0;
    //     //     let yesCount = 0;
    //     //     let votesNeeded = Math.floor((playerCount - 1) / 2);
    //     //     votesNeeded = (playerCount - 1) % 2 === 0 ? votesNeeded : votesNeeded + 1;
    //     //     console.log("votesNeeded: " + votesNeeded);
            
    //         // for(let key of Object.keys(playerList)) {
    //         //     if(playerList[key].vote !== "") {
    //         //         votesSubmitted++;
    //         //         if(playerList[key].vote === true) yesCount++;
    //         //     }
    //         // }

    //         // if(votesSubmitted >= playerCount - 1 || yesCount >= votesNeeded) {
    //         //     if(localStorage.getItem('userId') === hostId) {
    //         //         if(yesCount >= votesNeeded) {
    //         //             setGivePointTo(answerId);
    //         //         }
    //         //         if(newRoundDetected === false)
    //         //             setNewRoundDetected(true);
    //         //     }
    //         // }
    //     }
    // }, [playerList]);

    // useEffect(() => {
    //     if(newRoundDetected === true) {
    //         console.log("CREATENEWROUND!");
    //         if(givePointTo !== ""){
    //             let gameRef = firebase.database().ref().child(`lobbies/${localStorage.getItem("gameId")}`);
    //             gameRef.once("value")
    //             .then((snapshot) => {
    //                 gameRef.child('players').child(answerId).child('score').set(
    //                     snapshot.child('players').child(answerId).child('score').val() + 1
    //                 );
    //             })
    //             setGivePointTo("");
    //         }
    //         createNewRound();
    //         setNewRoundDetected(false);
    //     }
    //     return () => {
    //         setNewRoundDetected(false);
    //         setGivePointTo("");
    //     }
    // }, [newRoundDetected]);

    useEffect(() => {
        if(giveUpId !== "" && localStorage.getItem('userId') === hostId){
            console.log("SOMEONE GAVE UP!")
            let gameRef = firebase.database().ref().child(`lobbies/${localStorage.getItem("gameId")}`);
            gameRef.once("value")
            .then((snapshot) => {
                gameRef.child('players').child(giveUpId).child('score').set(
                    snapshot.child('players').child(giveUpId).child('score').val() + 1
                );
                let username = snapshot.child('players').child(giveUpId).child('name').val();
                gameRef.child('messages').push({
                    message: `Point given to: ${username}`,
                    userId: "systemMsg"
                })
            })
        }
    }, []);

    const submitAnswer = async (response) => {
        let gameRef =  await firebase.database().ref().child(`lobbies/${localStorage.getItem("gameId")}`);
        gameRef.child('players').child(localStorage.getItem('userId')).child('vote').set(response);
        setPlayerVoted(true);
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
                                        {
                                            playerVoted ?
                                            <div>
                                                Vote Submitted!
                                            </div>
                                            :
                                            <>
                                                <button className="yes-button" onClick={() => submitAnswer(true)}>Yes</button>
                                                <button className="no-button" onClick={() => submitAnswer(false)}>No</button>
                                            </>
                                        }
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
                            <div className="score-summary">
                                Scores:
                                    <ul>
                                    {
                                        Object.entries(playerList).map(([key, value]) => {
                                            return <li key={key}>
                                                <span style={{fontWeight: "bold"}}>{value.name}</span>
                                                <span style={{color: "red", fontWeight: "bold"}}> 
                                                {
                                                    value.score
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
                           <div className="no-answer-div">
                               <span>No one answered in time!</span>
                               {
                                   giveUpId === "" ?
                                   <span>No one gave up!</span>
                                   :
                               <span>But 
                                   <span className="player-name">
                                   {

                                    playerList[giveUpId] ?
                                    " " + playerList[giveUpId].name + " "
                                    :
                                    "Loading Name"

                                   }
                                   </span> gave up first!</span>
                               }
                            </div>
                        </div>
                            <div className="bottom">
                                <div className="vote-area no-answer">
                                <span style={{fontSize: "calc((3vh + 3vw)/2)", marginBottom: "5%", fontWeight: "bold"}}>Ready up for next round!</span>
                                    <button onClick={() => submitAnswer(false)} className="yes-button" style={{height:"30%"}}>
                                       Ready!
                                    </button>
                                </div>
                                <div className="player-votes">
                                    <span style={{fontWeight: "bold"}}>Ready Up:</span>
                                    <ul>
                                    {
                                        Object.entries(playerList).map(([key, value]) => {
                                            return <li key={key}>
                                                <span style={{fontWeight: "bold"}}>{value.name}</span>
                                                <span style={{color: "red", fontWeight: "bold"}}> 
                                                {
                                                    value.vote === "" ?
                                                    <span>Not Ready</span> :
                                                    <span style={{color: "green"}}>Ready!</span>
                                                }
                                                </span>
                                            </li>              
                                        })
                                    }
                                    </ul>
                                </div>
                                <div className="score-summary">
                                    <span style={{fontWeight: "bold"}}>Scores:</span>
                                    <ul>
                                    {
                                        Object.entries(playerList).map(([key, value]) => {
                                            return <li key={key}>
                                                <span style={{fontWeight: "bold"}}>{value.name}</span>
                                                <span style={{color: "red", fontWeight: "bold"}}> 
                                                {
                                                    value.score
                                                }
                                                </span>
                                            </li>              
                                        })
                                    }
                                    </ul>
                                </div>
                            </div>
                    </>
                }
            </div>      
        </div>
    )
}