import React, {useState, useEffect} from 'react';
import firebase from '../firebase';
import Modal from 'react-modal'
import './style/settings.css';
import gear from '../images/gear.png';

Modal.setAppElement('#root');

export default function Settings({hostId, scoreTarget, roundTime, countdownTime, setRedirect}) {

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [inGame, setInGame] = useState(localStorage.getItem('inGame'));

    function endGame() {
        //update the database, delete entire instance of the lobby
        let gameRef = firebase.database().ref().child(`lobbies/${localStorage.getItem('gameId')}`);
    
        gameRef.once("value")
          .then((snapshot) =>{
            if(snapshot.exists()) gameRef.remove();          
            else {
              console.log("Unable to end lobby.");
              return;
            }
          });  
      }
    
      function exitGame() {
        let playerListRef = firebase.database().ref().child(`lobbies/${localStorage.getItem('gameId')}/players`);
    
        playerListRef.once("value")
            .then(function(snapshot) {
              if(snapshot.exists()) playerListRef.child(localStorage.getItem("userId")).remove();          
            });   
        //update localStorage
        localStorage.removeItem("inLobby");
        localStorage.removeItem("inGame");
        localStorage.removeItem("gameId");
               
        //redirect back '/' (home)
        setRedirect('/');
      }

    async function updateInput(e) {
        //don't allow access if game has started || client is not host
        if(inGame === 'true' || localStorage.getItem('userId') !== hostId)
            return

        let id = e.currentTarget.id;
        let html = e.currentTarget.querySelector('span').innerHTML;

        let gameRef = await firebase.database().ref().child(`lobbies/${localStorage.getItem("gameId")}`);

        gameRef.once('value')
        .then((snapshot) => {
            if(id === 'scoreTargetInput') {
                if(html === '+' && scoreTarget < 20){
                    gameRef.child('scoreTarget').set(
                        snapshot.child('scoreTarget').val() + 1
                    )
                }
                else if(html === '-' && scoreTarget > 3) {
                    gameRef.child('scoreTarget').set(
                        snapshot.child('scoreTarget').val() - 1
                    )
                }

            }
            else if(id === 'roundTimeInput') {
                if(html === '+' && roundTime < 15){
                    gameRef.child('roundTime').set(
                        snapshot.child('roundTime').val() + 1
                    )
                }
                else if(html === '-' && roundTime > 5) {
                    gameRef.child('roundTime').set(
                        snapshot.child('roundTime').val() - 1
                    )
                }
            }
            else if(id === 'countdownTimeInput') {
                if(html === '+' && countdownTime < 8){
                    gameRef.child('countdownTime').set(
                        snapshot.child('countdownTime').val() + 1
                    )
                }
                else if(html === '-' && countdownTime > 3) {
                    gameRef.child('countdownTime').set(
                        snapshot.child('countdownTime').val() - 1
                    )
                }
            }
        })
    }

    return (
        <>
            {/* <button className = "settings-container" onClick={() => {setModalIsOpen(true)}} style={{display: modalIsOpen ? "none" : null}}>
                <div className="settings-bar"/>
                <div className="settings-bar"/>
                <div className="settings-bar"/>
            </button> */}

            <button className = "settings-container" onClick={() => {setModalIsOpen(true)}} style={{display: modalIsOpen ? "none" : null}}>
                <img src={gear} alt="loading"></img>
            </button>

            <Modal 
            className="modal-content-style"
            isOpen={modalIsOpen}
            onRequestClose={() => {setModalIsOpen(false)}}
            >
                <div className="modal-content-container">
                    <div className="menu-div">
                        <span className="menu-label">Menu</span>
                        <div className="menu-buttons-div">
                            {
                                localStorage.getItem('userId') === hostId ?
                                <button onClick={endGame}>End Game</button>
                                :
                                <button onClick={exitGame}>Leave Game</button>
                            }
                        </div>
                    </div>
                    <div className="settings-div">
                        <span className="settings-label">Game Settings</span>
                        <span style={{textDecoration: "underline"}}>Note: Only host can update game settings from lobby.</span>
                        <div className="settings-content-div">
                            <div className="settings-item">
                                <span className="settings-item-label">Score Target:</span>
                                <div className="number-input">
                                    <div className={scoreTarget > 3 ? "update-input" : "update-input input-max"} onClick={(e) => {updateInput(e)}} id='scoreTargetInput'>
                                        <span>-</span>
                                    </div>
                                    <div className="input-value">{scoreTarget}</div>
                                    <div className={scoreTarget < 20 ? "update-input" : "update-input input-max"} onClick={(e) => {updateInput(e)}} id='scoreTargetInput'>
                                        <span>+</span>
                                    </div>
                                </div>
                            </div>
                            <div className="settings-item">
                                <span className="settings-item-label">Round Time:</span>
                                <div className="number-input">
                                    <div className={roundTime > 5 ? "update-input" : "update-input input-max"} onClick={(e) => {updateInput(e)}} id='roundTimeInput'>
                                        <span>-</span>
                                    </div>
                                    <div className="input-value">{roundTime}</div>
                                    <div className={roundTime < 15 ? "update-input" : "update-input input-max"} onClick={(e) => {updateInput(e)}} id='roundTimeInput'>
                                        <span>+</span>
                                    </div>
                                </div>
                            </div>
                            <div className="settings-item">
                                <span className="settings-item-label">Countdown Time:</span>
                                <div className="number-input">
                                    <div className={countdownTime > 3 ? "update-input" : "update-input input-max"} onClick={(e) => {updateInput(e)}} id='countdownTimeInput'>
                                        <span>-</span>
                                    </div>
                                    <div className="input-value">{countdownTime}</div>
                                    <div className={countdownTime < 8 ? "update-input" : "update-input input-max"} onClick={(e) => {updateInput(e)}} id='countdownTimeInput'>
                                        <span>+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    
                </div>
                <div className="close-button" onClick={() => {setModalIsOpen(false)}}>X</div>
            </Modal>
        </>
    );
}