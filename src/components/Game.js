import React, {useState, useEffect} from 'react'
import firebase from '../firebase';
import './style/game.css'
import {Redirect} from 'react-router-dom';
import GameArea from './GameComponents/GameArea';
import GameControl from './GameComponents/GameControl';
import GamePlayers from './GameComponents/GamePlayers';
import GameVote from './GameComponents/GameVote';
import Chat from './Chat'

export default function Game() {
    const [gameId] = useState(localStorage.getItem("gameId"));
    const [functionsLoaded, setFunctionsLoaded] = useState(false);
    const [gameVoteOn, setGameVoteOn] = useState(false);
    const [category, setCategory] = useState("");
    const [letter, setLetter] = useState("");
    const [roundStartTime, setRoundStartTime] = useState("loading");
    const [roundEndTime, setRoundEndTime] = useState("loading");
    const [answer, setAnswer] = useState("");
    const [answerId, setAnswerId] = useState("");
    const [giveUpId, setGiveUpId] = useState("");
    const [localGaveUp, setLocalGaveUp] = useState(false);

    const [redirect, setRedirect] = useState(() => {

        let game = localStorage.getItem("inGame");
        let lobby = localStorage.getItem("inLobby");
        
        if(game && game !== "false"){
            return null;
        }
        else if (lobby && lobby === "true") return '/lobby';
        return '/';
    });

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
        console.log("TURN OFF GAMEVOTE.");
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

              let newList = {};
              snapshot.child('players').forEach((player)=> {
                newList[player.key] = {
                  name: player.child('name').val(),
                  answer: player.child('answer').val(),
                  score: player.child('score').val()
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
        gameRef.child('roundStartTime').set(0);
        gameRef.child('answer').child('id').set("");
        gameRef.child('answer').child('value').set("");
        gameRef.child('category').set("");
        gameRef.child('letter').set("");
        gameRef.child('giveUpId').set("");
      }

      const submitAnswer = async (e) => {
        if(e.key === "Enter") {
          let input = e.currentTarget.value;
          if(input === "") return;
          console.log("submitAnswer() called. Input: " + input);
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

      const submitGiveUp = async (e) => {
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
            <div className="game-right">
                <Chat gameId={gameId} playerList={playerList}/>
            </div>
            <button style={{width: "60px", height: "30px", position: "absolute"}} onClick={createNewRound}>New</button>
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
        </div>
    )
}