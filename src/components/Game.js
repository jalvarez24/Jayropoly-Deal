import React, {useState, useEffect, useContext} from 'react'
import Player from './Player';
import firebase from '../firebase';
import Chat from './Chat'
import './style/game.css'
import {Redirect} from 'react-router-dom';
import GameArea from './GameComponents/GameArea';
import GameControl from './GameComponents/GameControl';
import GamePlayers from './GameComponents/PlayerScores';
import Modal from 'react-modal';


export default function Game(props) {
    const [gameId] = useState(localStorage.getItem("gameId"));

    const [redirect, setRedirect] = useState(() => {

        let game = localStorage.getItem("inGame");
        let lobby = localStorage.getItem("inLobby");
        
        if(game && game !== "false"){
            return null;
        }
        else if (lobby && lobby === "true") return '/lobby';
        return '/';
    });

    function GetPlayerList() {
        const [playerList, setPlayerList] = useState({});
        const [hostId, setHostId] = useState("");
      
        useEffect(() => {
          let gameRef =  firebase.database().ref().child(`lobbies/${localStorage.getItem("gameId")}`);
          gameRef.on("value", (snapshot) => {
            if(!snapshot.exists()) {
              localStorage.removeItem("gameId");
              localStorage.removeItem("inLobby");
              localStorage.removeItem("inGame");
              setRedirect("/");
            }
            else{
              setHostId(snapshot.child('hostId').val());
              let newList = {};
              snapshot.child('players').forEach((player)=> {
                newList[player.key] = player.child('name').val();  
              })
              setPlayerList(newList);
            }
          })
    
          //disconnect on unmount
          return () => {
            gameRef.off();
          }
    
        }, []);
      
        return {playerList, hostId};
      }
    
      const {playerList, hostId} = GetPlayerList();

      // 
      const [modalIsOpen, setModalIsOpen] = React.useState(false);

      function openModal() {
        setModalIsOpen(true);
      }

      function afterOpenModal() {
        // references are now sync'd and can be accessed.
      }

      function closeModal(){
        setModalIsOpen(false);
      }

      const customStyles = {
        content : {
          top                   : '50%',
          left                  : '50%',
          right                 : 'auto',
          bottom                : 'auto',
          marginRight           : '-50%',
          transform             : 'translate(-50%, -50%)'
        }
      };

    return(
        redirect?
        <Redirect to={redirect}/>
        :
        <div className="game-container">
          <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
          >
            <div style={{width: "60vw", height: "60vh"}}>
              <span>
                Player X Answered:
              </span>
              Apples
            </div>
          </Modal>

            <div className="game-left">
                <div className="game-left-top">
                    <div className="game-area-container">
                        <GameArea />
                    </div>
                    <div onClick={openModal} className="game-players-container">
                        <GamePlayers />
                    </div>
                </div>
                <div className="game-left-bottom">
                        <GameControl />
                </div>
            </div>
            <div className="game-right">
                <Chat gameId={gameId} playerList={playerList}/>
            </div>
        </div>
    )
}