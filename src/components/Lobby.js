import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import Card from './Chat'
import cardsList from '../cards.json'
import {v4 as uuidv4} from 'uuid';

const cards = cardsList.cards;

function usePlayerList() {
  const [playerList, setPlayerList] = useState({});
  const [hostId, setHostId] = useState("");

  useEffect(() => {
    // let players =  firebase.database().ref().child(`lobbies/${localStorage.getItem("gameId")}/players`);
    let gameRef =  firebase.database().ref().child(`lobbies/${localStorage.getItem("gameId")}`);
    gameRef.on("value", (snapshot) => {
      setHostId(snapshot.child('hostId').val());
      let newList = {};
      snapshot.child('players').forEach((player)=> {
        newList[player.key] = player.child('name').val();  
      })
      setPlayerList(newList);
    })
  }, []);


  return {playerList, hostId};
}

export default function Lobby() {

  const {playerList, hostId} = usePlayerList();

  const [gameId, setGameId] = useState(localStorage.getItem("gameId"));

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

  function startGame() {
    //create new game in games table, with:
      // list of players
      // host id
      // messages
  }

  let count = 1;

  return (
    
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
      <Card gameId={gameId} playerList={playerList}/>
      <div>
          <button id="start-game-button" disabled={playerList.length < 2}>
              Start Game
          </button>
      </div>
    </div>
  )
}