import React, {useEffect} from 'react';
import './style/instructions.css'

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
            } 
            else {
                navbar.classList.remove('sticky');
            }
        }
      }, []);

    function switchTab(e, target) {
        //highlight clicked button
        let oldActiveButton = document.querySelector('.active');
        oldActiveButton.classList.remove('active');
        e.target.classList.add('active');

        //display instructions-tab desired
        let oldActiveTab = document.querySelector('.instructions-tab');
        oldActiveTab.classList.remove('instructions-tab');
        oldActiveTab.classList.add('inactive-tab');
        
        let newActiveTab = document.querySelector(target);
        newActiveTab.classList.add('instructions-tab');
        newActiveTab.classList.remove('inactive-tab');

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    return(
        <div className="instructions-container">
            <div className="instructions-content">

                <div id="instructions-nav" className="instructions-nav">
                    <a onClick={(e) => {switchTab(e, '#howtoplay-tab')}} className="nav-button">how to play</a>
                    <a onClick={(e) => {switchTab(e, '#features-tab')}} className="nav-button">features</a>
                    <a onClick={(e) => {switchTab(e, '#developer-tab')}} className="nav-button">developer</a>
                </div>

                <div className="inactive-tab" id="howtoplay-tab">
                    <span className="instructions-label">how to play</span>
                    <div className="test-div">
                        Create a lobby or join a friend's lobby.
                    </div>
                    <div className="test-div">
                        The host can update the game settings before starting the game.
                    </div>
                    <div className="test-div">
                        On game start, rounds will start loading. After initial countdown, a random category
                        and letter will appear.
                    </div>
                    <div className="test-div">
                        The first answer submitted by any player will be voted on by other players to see if
                        point will be awarded. If majority votes yes, point awarded.
                        <br/>
                        If you are unable to come up with anything, click the 'Give Up' button. Point will be
                        awarded to the first to 'Give Up' when no one submit answer for the given Category and Letter.
                    </div>
                </div>

                <div className="inactive-tab" id="features-tab">
                    <span className="instructions-label">features</span>
                    <div className="test-div">
                        Create a lobby or join a friend's lobby.
                    </div>
                    <div className="test-div">
                        The host can update the game settings before starting the game.
                    </div>
                    <div className="test-div">
                        On game start, rounds will start loading. After initial countdown, a random category
                        and letter will appear.
                    </div>
                    <div className="test-div">
                        The first answer submitted by any player will be voted on by other players to see if
                        point will be awarded. If majority votes yes, point awarded.
                        <br/>
                        If you are unable to come up with anything, click the 'Give Up' button. Point will be
                        awarded to the first to 'Give Up' when no one submit answer for the given Category and Letter.
                    </div>
                </div>

                <div className="inactive-tab" id="developer-tab">
                    <span className="instructions-label">developer</span>
                    <div className="test-div">
                        Create a lobby or join a friend's lobby.
                    </div>
                    <div className="test-div">
                        The host can update the game settings before starting the game.
                    </div>
                    <div className="test-div">
                        On game start, rounds will start loading. After initial countdown, a random category
                        and letter will appear.
                    </div>
                    <div className="test-div">
                        The first answer submitted by any player will be voted on by other players to see if
                        point will be awarded. If majority votes yes, point awarded.
                        <br/>
                        If you are unable to come up with anything, click the 'Give Up' button. Point will be
                        awarded to the first to 'Give Up' when no one submit answer for the given Category and Letter.
                    </div>
                </div>

            </div>
        </div>
    )
}