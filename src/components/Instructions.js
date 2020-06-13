import React, {useEffect} from 'react';
import './style/instructions.css';
import createLobby from './gifs/createLobby.gif';
import joinFriend from './gifs/joinFriend.gif';
import updateSettings from './gifs/updateSettings.gif';
import startGame from './gifs/startGame.gif';
import chat from './gifs/chat.gif';
import devPic from '../images/devpic.jpg';
import github from '../images/github.png';
import globe from '../images/globe.png';
import reactlogo from '../images/reactlogo.png';
import firebaselogo from '../images/firebaselogo.png';

export default function Instructions() {

    useEffect(() => {

        let navButtonOne = document.querySelector('.nav-button');
        navButtonOne.classList.add('active');

        let tabOne = document.querySelector('.inactive-tab');
        tabOne.classList.add('instructions-tab');
        tabOne.classList.remove('inactive-tab');

        let navbar = document.getElementById('instructions-nav');
        let sticky = (window.innerHeight * .2);

        window.onscroll = () => {
            if (window.pageYOffset >= sticky) {
                navbar.classList.add('sticky');

                let allLabels = document.querySelectorAll('.instructions-label');
                for(let label of allLabels) {
                    label.classList.add('add-label-padding');
                }
            } 
            else {
                navbar.classList.remove('sticky');
                let allLabels = document.querySelectorAll('.instructions-label');
                for(let label of allLabels) {
                    label.classList.remove('add-label-padding');
                }
            }
        }
      }, []);

    function switchTab(e, target) {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        //highlight clicked button
        let oldActiveButton = document.querySelector('.active');
        oldActiveButton.classList.remove('active');
        e.target.classList.add('active');

        //display instructions-tab desired
        let oldActiveTab = document.querySelector('.instructions-tab');
        oldActiveTab.classList.remove('instructions-tab');
        oldActiveTab.classList.add('inactive-tab');
        
        let newActiveTab = document.querySelector(target);
        newActiveTab.classList.remove('inactive-tab');
        newActiveTab.classList.add('instructions-tab');
    }

    return(
        <div className="instructions-container">
            <div className="instructions-content">

                <div id="instructions-nav" className="instructions-nav">
                    <a onClick={(e) => {switchTab(e, '#summary-tab')}} className="nav-button">summary</a>
                    <a onClick={(e) => {switchTab(e, '#howtoplay-tab')}} className="nav-button">how to play</a>
                    <a onClick={(e) => {switchTab(e, '#features-tab')}} className="nav-button">features</a>
                    <a onClick={(e) => {switchTab(e, '#developer-tab')}} className="nav-button">developer</a>
                </div>

                <div className="inactive-tab" id="summary-tab">
                    <span className="instructions-label">summary</span>
                    <div className="instructions-section">
                        <div className="summary-div">
                            I GOT IT FAM is inspired by the classic board game Scattergories. Invite your friends
                            to play this real-time creative-thinking game. The objective of the game is to get the most
                            points by coming up with a word or term that fits the round's randomly generated category and
                            letter combination. Only the first answer is accepted so think fast!
                            <hr/>
                            Once someone answers, the other players vote on whether they want to give you a point for
                            your response. If at least half vote yes, point is awarded to the player that answered.
                            <hr/>
                            Can't think of anything? Hit the 'Give Up' button as quickly as you can. If no one else answers
                            and you were the first to give up, you get the point!
                        </div>
                    </div>
                </div>

                <div className="inactive-tab" id="howtoplay-tab">
                    <span className="instructions-label">how to play</span>
                    <div className="instructions-section">
                    <img className="gif" src={createLobby} alt="loading"/>
                        <span>
                            Create a lobby or join a friend's lobby.
                        </span>
                        
                    </div>
                    <div className="instructions-section">
                        <span>
                            Share lobby code to have friends join.
                        </span>
                        <img className="gif" src={joinFriend} alt="loading"/>
                    </div>
                    <div className="instructions-section">
                        <img className="gif" src={updateSettings} alt="loading"/>
                        <span>
                            The host can update the game settings before starting the game.
                        </span>
                    </div>
                    <div className="instructions-section">
                        <span>
                            On game start, rounds will start loading. After initial countdown, a random category
                            and letter will appear.
                        </span>
                        <img className="gif" src={startGame} alt="loading"/>
                    </div>
                    <div className="instructions-section">
                        <span>
                            The first answer submitted by any player will be voted on by other players to see if
                            point will be awarded. If majority votes yes, point awarded.
                            <br/>
                            If you are unable to come up with anything, click the 'Give Up' button. Point will be
                            awarded to the first to 'Give Up' when no one submits answer for the given Category and Letter.
                        </span>
                    </div>
                </div>

                <div className="inactive-tab" id="features-tab">
                    <span className="instructions-label">features</span>
                    <div className="instructions-section">
                        <span>
                            Real-time chat available at all times.
                        </span>
                        <img className="gif" src={chat} alt="loading"/>
                    </div>
                    <div className="instructions-section">
                        <span>
                            No need to sign up to play. Just use any username to go by
                            and the application generates a unique userId and is saved
                            as a cookie.
                        </span>
                        <img className="gif" src={createLobby} alt="loading"/>
                    </div>
                    <div className="instructions-section">
                        <span>
                            Front-End is built with React.js framework.
                        </span>
                        <img className="gif" src={reactlogo} alt="loading"/>
                    </div>
                    <div className="instructions-section">
                    <img className="gif" src={firebaselogo} alt="loading"/>
                        <span>
                            Back-End is built with Google Firebase tools: Google Real-time Database & 
                            Google Cloud Functions.
                        </span>
                    </div>
                </div>

                <div className="inactive-tab" id="developer-tab">
                    <span className="instructions-label">developer</span>
                    <div className="dev-section">
                        <img className="pic" src={devPic} alt="loading"/>
                        <div className="dev-info">
                            <span>
                                My name is Jayro and I am very passionate about software development.
                                Feel free to check out my project's source code as well as my portfolio below!
                                <div className="dev-links">
                                    <a href="https://github.com/jalvarez24/i-got-it-fam/" target="_blank">
                                        <img src={github} alt="loading"/>
                                    </a>
                                    <a href="https://jalvarez24.github.io/" target="_blank">
                                        <img src={globe} alt="loading"/>
                                    </a>
                                </div>
                            </span>   
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}