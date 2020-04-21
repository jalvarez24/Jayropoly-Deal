import React from 'react';
import './App.css';
import firebase from './firebase';
import cardList from './cards.json'

import AllCards from './components/AllCards'

const App =() => {
  const cards = cardList.cards;
  console.log(cards);
  // const [cards, setCards] = React.useState([]);

  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     const db = firebase.firestore();
  //     const data = await db.collection("cards").get();
  //     setCards(data.docs.map(doc => doc.data()));
  //   }
  //   fetchData();
  // }, [])

  return (
    <span className="App">
      <AllCards cards={cards}/>
    </span>
  );
}

export default App;
