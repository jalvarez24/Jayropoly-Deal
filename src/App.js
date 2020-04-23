import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
// import firebase from './firebase';
import Nav from './components/Nav'
import Home from './components/Home'
import cardList from './cards.json'
import AllCards from './components/AllCards'
import CreateGameContainer from './components/CreateGameContainer'

const App =() => {
  const cards = cardList.cards;
  // console.table(cards);
  // const [cards, setCards] = React.useState([]);

  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     const db = firebase.firestore();
  //     const data = await db.collection("cards").get();
  //     setCards(data.docs.map(doc => doc.data()));
  //   }
  //   fetchData();
  // }, [])
  // const db = firebase.firestore();
  // db.collection("cards").add({
  //   id: 200,
  //   type: "new-type"
  // });
  // setCards(data.docs.map(doc => doc.data()));

  return (
    <Router>
      <CreateGameContainer cards={cards}/>
      <Nav />
      <span className="App">
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/cards" component={() => <AllCards cards={cards}/>} />
        </Switch>
      </span>
    </Router>
  );
}

export default App;
