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

    let game = localStorage.getItem("inGame");
    let lobby = localStorage.getItem("inLobby");

    if(lobby  && lobby === "true") return '/lobby'
    else if (game && game === "true") return '/game' 
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
      gameStarted: false,
      category: "",
      letter: "",
      answer: {
        id: "",
        value: ""
      },
      giveUpId: "",
      scoreTarget: 5,
      roundTime: 10,
      countdownTime: 5
    }
    let rootRef = firebase.database().ref();
    let lobbiesRef = rootRef.child('lobbies');
    lobbiesRef.child(gameId).set(gameInfo);
    lobbiesRef.child(gameId).child('players').child(userId).set({
      name: username, 
      score: 0, 
      vote: "",
      readyUp: ""
    });
  }

  function joinLobby() {
    if(joinLobbyId === "") {
      showErrorMessage("Enter lobby id to join  a friend.")
      return;
    }
    document.getElementById('username')

    let userId = localStorage.getItem('userId');
    let username = localStorage.getItem('username');

    let lobbyRef = firebase.database().ref().child(`lobbies/${joinLobbyId}`);

    lobbyRef.once("value")
        .then(function(snapshot) {
          if(snapshot.exists()) {
            let playerCount = snapshot.child('players').numChildren();
            if(playerCount >= 6){
              showErrorMessage(`Lobby is full! [${playerCount}/6]`);
              return;
            }

            lobbyRef.child('players').child(userId).set({
                                        name: username, 
                                        score: 0, 
                                        vote: "",
                                        readyUp: ""
                                      });
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
    if(errorOn && msg === errorMessage) return;
    setErrorOn(true);
    setErrorMessage(msg);
    let interval = setInterval(() => {
      setErrorOn(false);
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
          <div className="home">
          <h1>Welcome to <span style={{color: "#3a43ef", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}>I GOT IT FAM!</span></h1>
          <form onSubmit={(e) => {e.preventDefault()}} onKeyDown={preventEnter}>
            <div>
              {
              returningUser ?
              <>
                <h4 style={{marginBottom: "1vh"}}>Username: {username}</h4>
                <button style={{marginLeft: "10px"}} onClick={changeName}>
                  Change Username
                </button>
                
              </>
              :
              <>
                <span>Enter a name to play: </span>
                <div style={{position: "relative", display: "inline"}}>
                  <input onChange={(e) => {setUsername(e.target.value.trim())}} type="text" placeholder="Name" spellCheck="false" required/>
                  <span className="focus-border"></span>
                </div>
              </>
              }
            </div> 
            <hr style={{border: "1px solid black"}}/>
            <div className="menu-option">
              <span>Join a friend, enter their lobby id: </span>
              <div>
                <div style={{position: "relative", display: "inline"}}>
                  <input onChange={(e) => { setJoinLobbyId(e.target.value.trim())}} type="text" placeholder="Lobby" spellCheck="false"/>
                  <span className="focus-border"></span>
                </div>
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
                <button id="random-game-button" className="button-disabled" disabled>Join Lobby</button>
                <span style={{backgroundColor: "#2EC4B6"}}>Coming Soon!</span>
              </span>
            </div>
            <div className="menu-option">
              <span>Create a new lobby and invite friends: 
                {
                username === "" ? 
                <>
                  <button onClick={() => showErrorMessage("Username required.")}>Create Lobby</button> 
                </> 
                :
                <Link className="lobby-button-link" to="/lobby">
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
          </div>    
          </>
          }
          <span className={errorMessage !== ""?"alert":""}>{errorMessage}</span>
      </div>
      
    )
}