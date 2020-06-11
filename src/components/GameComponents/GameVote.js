import React, {useState, useEffect} from 'react';
import firebase from 'firebase';
import '../style/game.css';
import './style/game-vote.css';
import { isEmptyStatement, conditionalExpression } from '@babel/types';

export default function GameVote({category, letter, answer, answerId, playerList, giveUpId, setLocalGaveUp, hostId, createNewRound}) {

    const [newRoundDetected, setNewRoundDetected] = useState(false);
    const [givePointTo, setGivePointTo] = useState("");
    const [playerVoted, setPlayerVoted] = useState(false);
    const [playerReadyUped, setPlayerReadyUped] = useState(false);

    const [loadingNextRound, setLoadingNextRound] = useState(false);

    useEffect(() => {
        setLocalGaveUp(false);

        if(giveUpId !== "" && localStorage.getItem('userId') === hostId){
            let gameRef = firebase.database().ref().child(`lobbies/${localStorage.getItem("gameId")}`);
            gameRef.once("value")
            .then((snapshot) => {
                gameRef.child('players').child(giveUpId).child('score').set(
                    snapshot.child('players').child(giveUpId).child('score').val() + 1
                );
                gameRef.child('roundEndTime').set(Date.now() + 10000);
                let username = snapshot.child('players').child(giveUpId).child('name').val();
                gameRef.child('messages').push({
                    message: `Point given to ${username}`,
                    userId: "systemMsg"
                })
            })
        }
    }, []);

    useEffect(() => {
        if(playerList[localStorage.getItem('userId')] && playerList[localStorage.getItem('userId')].readyUp !== "")
            setPlayerReadyUped(true);
        if(playerList[localStorage.getItem('userId')] && playerList[localStorage.getItem('userId')].vote !== "")
            setPlayerVoted(true);

        //count votes || readyUps to display loading component => waiting on firebase functions to generate the new round
        let numOfPlayers = Object.keys(playerList).length;
        if(numOfPlayers > 0) {
            //count readyUps
            if(answerId === "") {
                let numOfReadyUps = 0;
                for(let key of Object.keys(playerList)) {
                    if(playerList[key].readyUp === true) numOfReadyUps++;
                }

                if(numOfReadyUps >= numOfPlayers) {
                    setLoadingNextRound(true);
                }
            }
            //count votes
            else {
                let yesVotes = 0;
                let anyVotes = 0;
                let votesNeeded = Math.floor((numOfPlayers - 1) / 2);
                votesNeeded = (numOfPlayers - 1) % 2 === 0 ? votesNeeded : votesNeeded + 1;

                for(let key of Object.keys(playerList)) {
                    if(playerList[key].vote === true) yesVotes++;
                    if(playerList[key].vote !== "") anyVotes++;
                }

                if(yesVotes >= votesNeeded || anyVotes >= (numOfPlayers - 1)) {
                    setLoadingNextRound(true);
                }
            }
        }
    }, [playerList]);

    const submitAnswer = async (response) => {
        let gameRef =  await firebase.database().ref().child(`lobbies/${localStorage.getItem("gameId")}`);
        gameRef.child('players').child(localStorage.getItem('userId')).child('vote').set(response);
        setPlayerVoted(true);
    } 

    const submitReadyUp = async (response) => {
        let gameRef =  await firebase.database().ref().child(`lobbies/${localStorage.getItem("gameId")}`);
        gameRef.child('players').child(localStorage.getItem('userId')).child('readyUp').set(response);
        setPlayerReadyUped(true);
    } 

    return (
        <div className="game-vote-container">
            {
            loadingNextRound === true ?
            <span className="vote-loading-text">
                Loading Next Round
                <span className="loader-vote-dot">.</span>
                <span className="loader-vote-dot">.</span>
                <span className="loader-vote-dot">.</span>
            </span>
            :
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
                                            {
                                                value.vote === "" ?
                                                <span style={{color: "#3399FF", fontWeight: "bold"}}>Pending</span> 
                                                :
                                                <>
                                                {
                                                    value.vote === false ?
                                                    <span style={{color: "red", fontWeight: "bold"}}>Denied!</span> 
                                                    :
                                                    <span style={{color: "green", fontWeight: "bold"}}>Accept!</span> 
                                                }
                                                </>
                                            }
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
                                {
                                    playerReadyUped === false ?
                                    <button onClick={() => submitReadyUp(true)} className="yes-button" style={{height:"30%"}}>
                                       <span className="ready-up-label">Ready!</span>
                                    </button>
                                    :
                                    <span>Waiting for other players.</span>
                                }
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
                                                    value.readyUp === "" ?
                                                    <span>Not Ready</span> :
                                                    <span style={{color: "green"}}>Ready</span>
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
            } 
        </div>
    )
}