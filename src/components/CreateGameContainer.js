import React, { Component } from 'react';
import firebase from '../firebase';

class CreateGameContainer extends Component {

    state = { 
      players: [
        {
          id: "ID1",
          name: "Alex"
        },
        {
          id: "ID2",
          name: "Bob"
        },
        {
          id: "ID3",
          name: "Carl"
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
      let gameId = "bl4hID1";
      // let shuffledCards = this.shuffleDeck(this.props.cards);
      let shuffledCards = this.props.cards;
      const db = firebase.firestore();
      const gamesRef = db.collection("games");
      gamesRef.doc(gameId).set({
        players: this.state.players,
        cards: shuffledCards
      })
    }
  
    render() {
      return (
        <div>
          CreateGameContainer
        </div>
      )
    }
  }

  export default CreateGameContainer;