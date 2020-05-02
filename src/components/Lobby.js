import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import {Link, Redirect} from 'react-router-dom';
import Chat from './Chat'
import cardsList from '../cards.json'

const cards = cardsList.cards;

export default function Lobby() {

  const [redirect, setRedirect] = useState(null);

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

  function shuffleDeck(cards) {
    let cardsCopy = cards;
    var currentIndex = cardsCopy.length;
    var temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = cardsCopy[currentIndex];
      cardsCopy[currentIndex] = cardsCopy[randomIndex];
      cardsCopy[randomIndex] = temporaryValue;
    }
  
    return cards;
  };

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

  function startGame() {
    //create new game in games table, with:
      // list of players
      // host id
      // messages
  }

  let count = 1;

  return (
    redirect?
    <Redirect to={redirect}/>
    :
    <div id="lobby" style={{width: "500px"}}>
      <div style={{backgroundColor: "lightgrey", padding: "20px"}}>
          <h3>Invite Yours Friends! They can join lobby with code: </h3>
          <h2>{gameId}</h2>
      </div>
      <div style={{backgroundColor: "lightgreen", padding: "20px"}}>
        <h3>Players in Lobby</h3>
          <ul style={{listStyleType: "none", padding: 0, margin: 0, width: "200px", backgroundColor: "aquamarine"}}>
              {     
              Object.entries(playerList).map(([key, value]) => {
                
                return <li key={key}><span style={{fontWeight: "bold"}}>{count++}</span>: {value} <span style={{color: "red", fontWeight: "bold"}}> {key === hostId ? "Host": ""}</span></li>              
              })
              }   
          </ul>
      </div>
      <Chat gameId={gameId} playerList={playerList}/>
      <div>
        {
          hostId === localStorage.getItem("userId")?
          <button onClick={endLobby}>End Lobby </button> 
          :
          <button onClick={exitLobby}>Exit Lobby </button> 
        }
        
          <button disabled={Object.keys(playerList).length < 2}>
              Start Game
          </button>
      </div>
    </div>
  )
}