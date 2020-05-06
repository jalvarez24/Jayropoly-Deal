import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Nav from './components/Nav';
import Home from './components/Home';
import Lobby from './components/Lobby';
import Game from './components/Game';
import Instructions from './components/Instructions';
import {v4 as uuidv4} from 'uuid';

function VerifyUser() {  
  if(localStorage.getItem("userId") === null) {
    localStorage.setItem("userId", uuidv4().substring(0,8));
  }
  return null;
}

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
          <Route path="/instructions" component={Instructions}/>
        </Switch>
      </div>
    </Router>
  );
}