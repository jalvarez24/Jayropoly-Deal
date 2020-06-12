import React, {useState} from 'react';
import firebase from '../firebase';
import Modal from 'react-modal'
import './style/settings.css';

Modal.setAppElement('#root');
console.log(Modal.defaultStyles);
// Modal.defaultStyles.content.left = "50%";

export default function Settings({scoreTarget, roundTime, countdownTime}) {

    const [modalIsOpen, setModalIsOpen] = useState(true);

    const [inGame, setInGame] = useState(localStorage.getItem('inGame'));

    return (
        <>
            <button className = "settings-container" onClick={() => {setModalIsOpen(true)}} style={{display: modalIsOpen ? "none" : null}}>
                <div className="settings-bar"/>
                <div className="settings-bar"/>
                <div className="settings-bar"/>
            </button>

            <Modal 
            className="modal-content-style"
            isOpen={modalIsOpen}
            onRequestClose={() => {setModalIsOpen(false)}}
            >
                <div className="modal-content-container">
                    {/* {
                        inGame === "true" ?
                        <h1>In game!</h1>
                        :
                        <h1>In lobby!</h1>
                    } */}
                    <div className="menu-div">
                        <span className="menu-label">Menu</span>
                        <div className="menu-buttons-div">
                            <button>Leave Game</button>
                            <button>End Game</button>
                        </div>
                    </div>
                    <div className="settings-div">
                        <span className="settings-label">Game Settings</span>
                        <div className="settings-content-div">
                            <div className="settings-item">
                                <span className="settings-item-label">Score Target:</span>
                                <div className="number-input">
                                    <div className="update-input">
                                        <span>-</span>
                                    </div>
                                    <div className="input-value">{scoreTarget}</div>
                                    <div className="update-input">
                                        <span>+</span>
                                    </div>
                                </div>
                            </div>
                            <div className="settings-item">
                                <span className="settings-item-label">Round Time:</span>
                                <div className="number-input">
                                    <div className="update-input">
                                        <span>-</span>
                                    </div>
                                    <div className="input-value">{roundTime}</div>
                                    <div className="update-input">
                                        <span>+</span>
                                    </div>
                                </div>
                            </div>
                            <div className="settings-item">
                                <span className="settings-item-label">Countdown Time:</span>
                                <div className="number-input">
                                    <div className="update-input">
                                        <span>-</span>
                                    </div>
                                    <div className="input-value">{countdownTime}</div>
                                    <div className="update-input">
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