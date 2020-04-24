import React, { Component } from 'react';
import firebase from '../firebase';
import Lobby from './Lobby'
import {v4 as uuidv4} from 'uuid';

class LobbyContainer extends Component {

    state = { 
      players: [
        {
            id: localStorage.getItem("userId"),
            name: "joe"
        },
        {
            id: "a1s2d3f",
            name: "alex"
        }
      ],
      cards: this.props.cards
    };

    shuffleDeck = (cards) => {
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
  
    componentDidMount() {
      let gameId = uuidv4().substring(0,8);
      let shuffledCards = this.shuffleDeck(this.props.cards);
      // let shuffledCards = this.props.cards;

      // const db = firebase.firestore();
      // const gamesRef = db.collection("games");
      let rootRef = firebase.database().ref();
      let gamesRef = rootRef.child('games');

      

      
      /*
      /what do I need to pass lobby page and start a new game?

        -players in lobby
          -player.id
          -player.name

        -cards
          -in array form
      */
      let hostId = uuidv4().substring(0,8);
      let obj = {     
        hostId: hostId,
        players: [
          {id: hostId,
          name: "jost"},
          {id: "otherId",
            name: "josh"}
        ]
      };      

      // gamesRef.child(gameId).set(obj);

      // let userId = "M5eAmTjsyFkBVlnQYDW"
      // return firebase.database().ref('/games/' + userId).once('value').then(function(snapshot) {
      //   var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
      //  console.log(username);
      // });
      


      // gamesRef.doc(gameId.substring(0,8)).set({
      //   players: this.state.players,
      //   cards: shuffledCards
      // })
    }
    render() {
      return (
        <Lobby players={this.state.players}/>
      )
    }
  }

  export default LobbyContainer;