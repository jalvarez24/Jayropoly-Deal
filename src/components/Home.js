import React, {useState} from 'react';
import firebase from '../firebase';
import {Link, Redirect} from 'react-router-dom';
import '../App.css';
import {v4 as uuidv4} from 'uuid';


export default function Home() {

  //string
  const [username, setUsername] = useState(localStorage.getItem("username") === null ? "" : localStorage.getItem("username"));
  //string
  const [joinLobbyId, setJoinLobbyId] = useState("");
  //bool
  const [returningUser, setReturningUser] = useState(localStorage.getItem("username") !== null);
  
  const [redirect, setRedirect] = useState(() => {
    // if(localStorage.getItem("inGame") !== null) {
    //   return "game";
    // }
    // else 
    if(localStorage.getItem("inLobby") !== null)
      return '/lobby'
    return null;
  });


  function createLobby() {
    let gameId = uuidv4().substring(0,5);

    if(localStorage.getItem("gameId")) {
      gameId = localStorage.getItem("gameId");
    }

    localStorage.setItem("inLobby", true);
    localStorage.setItem("inGame", false);
    localStorage.setItem("gameId", gameId);

    let userId = localStorage.getItem('userId');
    let username = localStorage.getItem('username');

    let gameInfo = {
      hostId: userId,
    }
    let rootRef = firebase.database().ref();
    let lobbiesRef = rootRef.child('lobbies');
    lobbiesRef.child(gameId).set(gameInfo);
    lobbiesRef.child(gameId).child('players').child(userId).set({name: username});
  }

  function joinLobby() {
    if(joinLobbyId === "") {
      showErrorMessage("Enter lobby id to join  a friend.")
      return;
    }
    document.getElementById('username')

    let userId = localStorage.getItem('userId');
    let username = localStorage.getItem('username');

    let gameRef = firebase.database().ref().child(`lobbies/${joinLobbyId}`);

    gameRef.once("value")
        .then(function(snapshot) {
          if(snapshot.exists()) {
            gameRef.child('players').child(userId).set({name: username});

            localStorage.setItem("inLobby", true);
            localStorage.setItem("inGame", false);
            localStorage.setItem("gameId", joinLobbyId);
            setRedirect('/lobby');
          }
          else {
            showErrorMessage("Lobby does not exist. Try again.")
          }
        });   
  }

  function changeName() {
    localStorage.removeItem("username");
    setUsername("");
    setReturningUser(null);
  }

  function preventEnter(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  //for displaying errors:
  const [errorOn, setErrorOn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function showErrorMessage(msg, howLong = 3) {
    console.log("called");
    if(errorOn) return;
    setErrorOn(true);
    setErrorMessage(msg);
    let interval = setInterval(() => {
      setErrorOn();
      setErrorMessage("");
      stopInverval();
    }, howLong * 1000);

    function stopInverval() {
      clearInterval(interval);
    }
  }

    return( 
      <div>
        {
          redirect?
          <Redirect to={redirect}/>
          :
          <>
          <h1>Welcome to <span style={{color: "gold"}}>I GOT IT FAM</span></h1>
          <form onSubmit={(e) => {e.preventDefault()}} onKeyDown={preventEnter}>
            <div>
              {
              returningUser ?
              <>
                <h4>Username: {username}</h4>
                <button style={{marginLeft: "10px"}} onClick={changeName}>
                  Change Username
                </button>
                
              </>
              :
              <>
                <span>Enter a name to play: </span>
                <input  onChange={(e) => {setUsername(e.target.value.trim())}} type="text" required/>
              </>
              }
            </div> 
            <hr/>
            <div className="menu-option">
              <span>Join a friend, enter their lobby id: </span>
              <div>
                <input onChange={(e) => { setJoinLobbyId(e.target.value.trim())}} type="text"/>
                {
                username === "" ? 
                <>
                  <button onClick={() => showErrorMessage("Username required.")}>Join Friend</button> 
                </> :
                <>
                  <button onClick={joinLobby}>Join Friend</button> 
                </>
                }
              </div>
            </div>
            <div className="menu-option">
              <span>Join a random game: 
                <button id="random-game-button" disabled>Join Random</button>
                <span style={{backgroundColor: "lightgrey"}}>Coming Soon!</span>
              </span>
            </div>
            <div className="menu-option">
              <span>Create a new lobby and invite friends: 
                {
                username === "" ? 
                <>
                  <button onClick={() => showErrorMessage("Username required.")}>Create Lobby</button> 
                </> :
                  <Link to="/lobby">
                    {
                      !returningUser ?
                        localStorage.setItem("username", username):
                        null 
                    }
                    <button onClick={createLobby}>Create Lobby</button>
                  </Link>
                }
              </span>
            </div>
          </form>
          <span id="errorMessage" style={{color: "red"}}>{errorMessage}</span>
          </>
          }
      </div>
      
    )
}