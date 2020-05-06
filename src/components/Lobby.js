import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import {Redirect} from 'react-router-dom';
import Chat from './Chat'
import './style/lobby.css';


export default function Lobby() {

  const [redirect, setRedirect] = useState(() => {

    let game = localStorage.getItem("inGame");
    let lobby = localStorage.getItem("inLobby");

    if(lobby && lobby !== "false") {
      return null;
    }
    else if (game && game === "true") return '/game'
    return '/'
  });

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
          setHostId(snapshot.child('hostId').val());
          let newList = {};
          snapshot.child('players').forEach((player)=> {
            newList[player.key] = player.child('name').val();  
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

  const [gameId] = useState(localStorage.getItem("gameId"));

  function endLobby() {
    //update the database, delete entire instance of the lobby
    let gameRef = firebase.database().ref().child(`lobbies/${gameId}`);

    gameRef.once("value")
      .then(function(snapshot) {
        if(snapshot.exists()) gameRef.remove();          
        else {
          console.log("Unable to end lobby.");
          return;
        }
      });  
  }

  function exitLobby() {
    //update the database!!!
    let playerListRef = firebase.database().ref().child(`lobbies/${gameId}/players`);

    playerListRef.once("value")
        .then(function(snapshot) {
          if(snapshot.exists()) playerListRef.child(localStorage.getItem("userId")).remove();          
          else {
            console.log("unable to remove player in db.");
            return;
          }
        });   
    //update localStorage
    localStorage.removeItem("inLobby");
    localStorage.removeItem("inGame");
    localStorage.removeItem("gameId");
           
    //redirect back '/' (home)
    setRedirect('/');
  }

  function copyLobbyId() {
    var input = document.createElement('textarea');
    input.innerHTML = gameId;
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input);
  }

  const [gameStarted, setGameStarted] = useState(false)

  function startGame() {
    //create new game in games table, with:
      // list of players
      // host id
      // messages
  }

  return (
    redirect?
    <Redirect to={redirect}/>
    :
    <div className="lobby-container">
      <div className="lobby">
        <div className="invite">
            <h3>Invite Yours Friends! They can join lobby with code: </h3>
            <h2 style={{marginBottom: "1vh"}} id="lobbyIdElement">{gameId}</h2>
            <button onClick={copyLobbyId}>Click to Copy</button>
        </div>
        <div className="playerlist">
          <h3 style={{marginTop: 0, marginBottom: "4px"}}>Players in Lobby</h3>
          <nav style={{textAlign: "center", width: "50%", margin: "auto"}}>
            <ul>
                {     
                Object.entries(playerList).map(([key, value]) => {   
                  return <li key={key}>
                    <span style={{fontWeight: "bold"}}>{value}</span>
                    <span style={{color: "red", fontWeight: "bold"}}> 
                    {key === hostId ? " Host": ""}
                    </span>
                    <span>
                      {key === localStorage.getItem("userId") ? " (You)" : ""}
                    </span>
                  </li>              
                })
                }   
            </ul>
          </nav> 
          <div style={{marginTop: "5px"}}>
            <span>[{Object.keys(playerList).length}/8 Players]</span> 
          </div>      
        </div>
        <div>
        {
          hostId === localStorage.getItem("userId")?
          <>
          <button onClick={endLobby}>End Lobby </button> 
          <button title={Object.keys(playerList).length < 2 ? "At least two players required.":""} 
          disabled={Object.keys(playerList).length < 2}>
              Start Game
          </button>
          </>
          :
          <>
          <button onClick={exitLobby}>Exit Lobby </button> 
          <button title="Host must start game."disabled>
              Start Game
          </button>
          </>
        }     
      </div>
      </div>

      <div className="chat">
        <Chat className="chat" gameId={gameId} playerList={playerList}/>
      </div>
      
    </div>
  )
}