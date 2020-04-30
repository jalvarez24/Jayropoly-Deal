import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
// import firebase from './firebase';
import Nav from './components/Nav'
import Home from './components/Home'
import AllCards from './components/AllCards'
import Lobby from './components/Lobby'
import {v4 as uuidv4} from 'uuid';

const VerifyUser = () => {  
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
      <span className="App">
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/cards" component={AllCards} />
          <Route path="/lobby" exact component={Lobby}/>
        </Switch>
      </span>
    </Router>
  );
}