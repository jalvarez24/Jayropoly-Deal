import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
// import firebase from './firebase';
import Nav from './components/Nav'
import Home from './components/Home'
import cardList from './cards.json'
import AllCards from './components/AllCards'
import LobbyContainer from './components/LobbyContainer'
import {v4 as uuidv4} from 'uuid';

const VerifyUser = () => {  
  if(localStorage.getItem("userId") === null) {
    localStorage.setItem("userId", uuidv4().substring(0,8));
  }
  else{
    //Cookie already set
  }
  return null;
}

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
      <VerifyUser />
      <Nav />
      <span className="App">
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/cards" component={() => <AllCards cards={cards}/>} />
          <Route path="/lobby" component={() => <LobbyContainer cards={cards}/>} />
        </Switch>
      </span>
    </Router>
  );
}

export default App;
