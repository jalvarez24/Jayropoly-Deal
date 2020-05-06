import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import {Redirect} from 'react-router-dom';
import Chat from './Chat'

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
    <div id="lobby" style={{width: "400px", margin: "auto"}}>
      <div style={{backgroundColor: "lightgrey", padding: "20px"}}>
          <h3>Invite Yours Friends! They can join lobby with code: </h3>
          <h2>{gameId}</h2>
      </div>
      <div style={{backgroundColor: "lightgreen", padding: "10px", textAlign: "center"}}>
        <h3 style={{marginTop: 0, marginBottom: "4px"}}>Players in Lobby</h3>
        <nav style={{textAlign: "center", width: "50%", margin: "auto"}}>
          <ul style={{listStyleType: "none", margin: 0,padding: 0, backgroundColor: "aquamarine"}}>
              {     
              Object.entries(playerList).map(([key, value]) => {
                
                return <li key={key}><span style={{fontWeight: "bold"}}></span>{value} <span style={{color: "red", fontWeight: "bold"}}> {key === hostId ? "Host": ""}</span></li>              
              })
              }   
          </ul>
        </nav> 
        <div style={{marginTop: "5px"}}>
          <span>[{Object.keys(playerList).length}/8 Players]</span> 
        </div>      
      </div>
      <Chat gameId={gameId} playerList={playerList}/>
      <div>
        {
          hostId === localStorage.getItem("userId")?
          <button onClick={endLobby}>End Lobby </button> 
          :
          <button onClick={exitLobby}>Exit Lobby </button> 
        }
        
          <button title={Object.keys(playerList).length < 2 ? "At least two players required.":""} 
          disabled={Object.keys(playerList).length < 2}>
              Start Game
          </button>
      </div>
    </div>
  )
}