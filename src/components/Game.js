import React, {useState, useEffect} from 'react'
import firebase from '../firebase';
import './style/game.css'
import {Redirect} from 'react-router-dom';
import GameArea from './GameComponents/GameArea';
import GameControl from './GameComponents/GameControl';
import GamePlayers from './GameComponents/GamePlayers';
import GameVote from './GameComponents/GameVote';
import Chat from './Chat'
import Javi from  "../images/javibanner.jpg"
import Settings from './Settings'

export default function Game() {
    const [functionsLoaded, setFunctionsLoaded] = useState(false);

    const [gameId] = useState(localStorage.getItem("gameId"));
    const [gameVoteOn, setGameVoteOn] = useState(false);
    const [category, setCategory] = useState("");
    const [letter, setLetter] = useState("");
    const [roundStartTime, setRoundStartTime] = useState("loading");
    const [roundEndTime, setRoundEndTime] = useState("loading");
    const [answer, setAnswer] = useState("");
    const [answerId, setAnswerId] = useState("");
    const [giveUpId, setGiveUpId] = useState("");
    const [localGaveUp, setLocalGaveUp] = useState(false);
    const [winner, setWinner] = useState("");
    const [scoreTarget, setScoreTarget] = useState(0);
    const [roundTime, setRoundTime] = useState(0);
    const [countdownTime, setCountdownTime] = useState(0);

    const [redirect, setRedirect] = useState(() => {

        let game = localStorage.getItem("inGame");
        let lobby = localStorage.getItem("inLobby");
        
        if(game && game !== "false"){
            return null;
        }
        else if (lobby && lobby === "true") return '/lobby';
        return '/';
    });

    //check for playerList updates in case there's a winner
    useEffect(() => {
      if(scoreTarget !== 0) {
        for(let key of Object.keys(playerList)) {
          if(playerList[key].score >= scoreTarget) {
            setWinner(key);
          }
        }
      }
    })

    //if answer detected on load, display vote
    useEffect(() => {
      if(answer !== "") {
        setGameVoteOn(true);
      }
    }, [answer]);

    //if roundStartTime || roundEndTime not reached on load, turn off display
    //else turn on
    useEffect(() => {
      if(roundStartTime > Date.now() || roundEndTime > Date.now()) {
        setGameVoteOn(false);
      }
      else{
        setGameVoteOn(true);
      }
    }, [roundStartTime, roundEndTime]);

    function GetPlayerList() {
        const [playerList, setPlayerList] = useState({});
        const [hostId, setHostId] = useState("");
      
        useEffect(() => {
          let gameRef =  firebase.database().ref().child(`lobbies/${localStorage.getItem("gameId")}`);
          gameRef.on("value", (snapshot) => {
            if(!snapshot.exists()) {
              localStorage.removeItem("gameId");
              localStorage.removeItem("inLobby");
              localStorage.removeItem("inGame");
              setRedirect("/");
            }
            else{
              if(snapshot.child('functionsLoaded').exists() && snapshot.child('functionsLoaded').val()) {
                setFunctionsLoaded(true);
              }

              if(snapshot.child('winner').val() !== "")
                setWinner(snapshot.child('winner').val());
              
              if(snapshot.child('roundStartTime').exists() && snapshot.child('roundStartTime').val() > 0){
                setRoundStartTime(snapshot.child('roundStartTime').val());
              }

              if(snapshot.child('roundEndTime').exists() && snapshot.child('roundEndTime').val() > 0){
                setRoundEndTime(snapshot.child('roundEndTime').val());
              }

              setCategory(snapshot.child('category').val());

              setLetter(snapshot.child('letter').val());

              setGiveUpId(snapshot.child('giveUpId').val());

              setAnswer(snapshot.child('answer').child('value').val());

              setAnswerId(snapshot.child('answer').child('id').val());

              setHostId(snapshot.child('hostId').val());

              setScoreTarget(snapshot.child('scoreTarget').val());

              setRoundTime(snapshot.child('roundTime').val());

              setCountdownTime(snapshot.child('countdownTime').val());

              let newList = {};
              snapshot.child('players').forEach((player)=> {
                
                newList[player.key] = {
                  name: player.child('name').val(),
                  vote: player.child('vote').val(),
                  score: player.child('score').val(),
                  readyUp: player.child('readyUp').val()
                }
              })
              setPlayerList(newList);
            }
          })
    
          //disconnect on unmount
          return () => {
            gameRef.off();
          }
    
        }, []);
      
        return {playerList, hostId};
      }
    
      const {playerList, hostId} = GetPlayerList();

      async function createNewRound() {
        let gameRef =  await firebase.database().ref().child(`lobbies/${localStorage.getItem("gameId")}`);
        await gameRef.child('roundStartTime').set(0);
        await gameRef.child('answer').child('id').set("");
        await gameRef.child('answer').child('value').set("");
        await gameRef.child('category').set("");
        await gameRef.child('letter').set("");
        await gameRef.child('giveUpId').set("");
        for(let key of Object.keys(playerList)) {
          await gameRef.child('players').child(key).child('vote').set("");
        }
      }

      async function submitAnswer(e) {
        if(e.key === "Enter") {
          let input = e.currentTarget.value;
          if(input === "") return;
          let gameRef =  await firebase.database().ref().child(`lobbies/${localStorage.getItem("gameId")}`);
          gameRef.once("value")
          .then((snapshot) => {
            if(snapshot.child('answer').child('value').val() === "") {
              gameRef.child('answer').child('value').set(input);
              gameRef.child('answer').child('id').set(localStorage.getItem('userId'));
            }
          })
        }
      }

      async function submitGiveUp(e) {
        setLocalGaveUp(true);
        let gameRef =  await firebase.database().ref().child(`lobbies/${localStorage.getItem("gameId")}`);
        gameRef.once("value")
          .then((snapshot) => {
            if(snapshot.child('giveUpId').val() === "") {
              gameRef.child('giveUpId').set(localStorage.getItem('userId'));
            }
          })
      }

    return(
        redirect ?
        <Redirect to={redirect}/>
        :
        <div className="game-container">
        {
          functionsLoaded ?
          <>
            {
            winner === "" ?
              <>
                <div className="game-left">
                {
                  gameVoteOn ?
                  <GameVote
                    category={category}
                    letter={letter}
                    answer={answer}
                    answerId={answerId}
                    playerList={playerList}
                    giveUpId={giveUpId}
                    setLocalGaveUp={setLocalGaveUp}
                    setCategory={setCategory}
                    setLetter={setLetter}
                    hostId={hostId}
                    createNewRound={createNewRound}
                    scoreTarget={scoreTarget}
                  />
                  :
                  <>
                    <div className="game-left-top">
                        <div className="game-area-container">
                            <GameArea 
                              category={category}
                              letter={letter} 
                              roundStartTime={roundStartTime} 
                              roundEndTime={roundEndTime}
                              answer={answer}
                              setGameVoteOn={setGameVoteOn}
                              gameVoteOn={gameVoteOn}
                            />
                        </div>
                        <div className="game-players-container">
                            <GamePlayers 
                              playerList={playerList}
                            />
                        </div>
                    </div>
                    <div className="game-left-bottom">
                            <GameControl 
                              roundStartTime={roundStartTime}
                              roundEndTime={roundEndTime}
                              submitAnswer={submitAnswer}
                              submitGiveUp={submitGiveUp}
                              giveUpId={giveUpId}
                              localGaveUp={localGaveUp}
                            />
                    </div>
                  </>
                }
                </div>
              </>
              :
              <div className="game-left">
                <div className="winner-container">
                  <div className="winner">
                    <img src={Javi} className="javi-pic"/> 
                    <div className="banner">
                      <span className="winner-label">
                        Winner: 
                        <span>
                          {
                            playerList[winner] ?
                            " " + playerList[winner].name :
                            "loading"
                          }
                        </span>
                      </span>
                      <div className="winner-buttons">
                        <button style={{marginRight: "5%"}}>Back to Lobby</button>
                        <button>Quit</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            <div className="game-right">
                <Chat gameId={gameId} playerList={playerList}/>
            </div>
            {/* <button style={{width: "60px", height: "30px", position: "absolute"}} onClick={createNewRound}>New</button> */} 
          </>     
          :
          <div className="game-loading">
            <span className="game-loading-text">
              Loading Game
              <span className="loader__dot">.</span><span className="loader__dot">.</span><span className="loader__dot">.</span>
            </span>
            <div className="loading-spinner">
              <div className="loading-spinner-inner">
                <div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div>
              </div>
            </div>
          </div>
        }
        <Settings hostId={hostId} scoreTarget={scoreTarget} roundTime={roundTime} countdownTime={countdownTime}/>
        </div>
    )
}