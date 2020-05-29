import React, {useState, useEffect, useContext} from 'react'
import Player from './Player';
import firebase from '../firebase';
import Chat from './Chat'
import './style/game.css'
import {Redirect} from 'react-router-dom';
import GameArea from './GameComponents/GameArea';
import GameControl from './GameComponents/GameControl';
import GamePlayers from './GameComponents/GamePlayers';
import Modal from 'react-modal';


export default function Game() {
    const [gameId] = useState(localStorage.getItem("gameId"));
    const [functionsLoaded, setFunctionsLoaded] = useState(false);

    const [redirect, setRedirect] = useState(() => {

        let game = localStorage.getItem("inGame");
        let lobby = localStorage.getItem("inLobby");
        
        if(game && game !== "false"){
            return null;
        }
        else if (lobby && lobby === "true") return '/lobby';
        return '/';
    });

    const [category, setCategory] = useState("");
    const [letter, setLetter] = useState("");
    const [roundStartTime, setRoundStartTime] = useState("loading");
    const [roundEndTime, setRoundEndTime] = useState("loading");

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

              if(snapshot.child('category').val() !== "") {
                setCategory(snapshot.child('category').val());
              }

              if(snapshot.child('letter').val() !== "") {
                setLetter(snapshot.child('letter').val());
              }

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
        console.log("createRound start: " + new Date());
        let gameRef =  await firebase.database().ref().child(`lobbies/${localStorage.getItem("gameId")}`);
        await gameRef.child('roundStartTime').set(0);
        console.log("createRound end: " + new Date());
      }

      const submitAnswer = async (e) => {
        if(e.key === "Enter") {
          let input = e.currentTarget.value;
          if(input === "") return;
          console.log("submitAnswer() called. Input: " + input);
          let gameRef =  await firebase.database().ref().child(`lobbies/${localStorage.getItem("gameId")}`);
          gameRef.once("value")
          .then((snapshot) => {
            console.log("value child: " + snapshot.child('answer').child('value').val());
            if(snapshot.child('answer').child('value').val() === "") {
              console.log("Submit answer attempt.");
              gameRef.child('answer').child('value').set(input);
              gameRef.child('answer').child('id').set(localStorage.getItem('userId'));
            }
          })
        }
      }

    return(
        redirect?
        <Redirect to={redirect}/>
        :
        <div className="game-container">
        {
          functionsLoaded ? 
          <> 
            <div className="game-left">
                <div className="game-left-top">
                    <div className="game-area-container">
                        <GameArea category={category} letter={letter} roundStartTime={roundStartTime} roundEndTime={roundEndTime}/>
                    </div>
                    <div className="game-players-container">
                        <GamePlayers playerList={playerList}/>
                    </div>
                </div>
                <div className="game-left-bottom">
                        <GameControl roundStartTime={roundStartTime} roundEndTime={roundEndTime} submitAnswer={submitAnswer}/>
                </div>
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