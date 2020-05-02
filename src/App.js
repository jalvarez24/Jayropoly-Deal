import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
// import firebase from './firebase';
import Nav from './components/Nav';
import Home from './components/Home';
import AllCards from './components/AllCards';
import Lobby from './components/Lobby';
import Game from './components/Game';
import {v4 as uuidv4} from 'uuid';

function VerifyUser() {  
  if(localStorage.getItem("userId") === null) {
    localStorage.setItem("userId", uuidv4().substring(0,8));
  }
  return null;
}

let cardsOn = false;

export default function App() {
  return (
    <Router>
      <VerifyUser />
      <Nav />
      <div className="App">
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/lobby" component={Lobby}/>
          <Route path="/game" component={Game}/>
        </Switch>
      </div>
    </Router>
  );
}