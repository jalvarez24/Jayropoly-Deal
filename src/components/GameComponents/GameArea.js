import React, {useState, useEffect} from 'react';
import firebase from 'firebase';
import '../style/game.css';
import './style/game-area.css';

export default function GameArea({category, letter, roundEndTime}) {

    async function apiCall() {
        firebase.functions().useFunctionsEmulator('http://localhost:5001');
        // const getData = firebase.functions().httpsCallable('getData');
        // getData({lobbyId: localStorage.getItem('gameId')}).then(result => {
        // });
        const setRound = firebase.functions().httpsCallable('setRound');
        setRound({lobbyId: localStorage.getItem('gameId')}).then(res => {
            if(res.data.success) console.log("setRound successful!");
        });
    }

    const [roundTimerOn, setRoundTimerOn] = useState(true);

    /////
    function Timer(duration, element) {
        var self = this;
        this.duration = duration;
        this.element = element;
        this.running = false;
        
        this.els = {
            ticker: document.getElementById('ticker'),
            seconds: document.getElementById('seconds'),
        };
    }
    
    Timer.prototype.start = function() {
        var self = this;
        var start = null;
        this.running = true;
        var remainingSeconds = this.els.seconds.textContent = this.duration / 1000;
        
        function draw(now) {
            if (!start) start = now;
            var diff = now - start;
            var newSeconds = Math.ceil((self.duration - diff)/1000);
    
            if (diff <= self.duration) {
                self.els.ticker.style.height = 100 - (diff/self.duration*100) + '%';
                
                if (newSeconds != remainingSeconds) {
                    self.els.seconds.textContent = newSeconds;
                    remainingSeconds = newSeconds;
                }
                
                self.frameReq = window.requestAnimationFrame(draw);
            } else {
                self.running = false;
                self.els.ticker.style.height = '0%';
                setRoundTimerOn(false);
                // apiCall();
            }
        };
        
        self.frameReq = window.requestAnimationFrame(draw);
    }

    useEffect(() => {

        if(typeof(roundEndTime) === "number"){
            if(roundEndTime > Date.now()){
                startTime();
            }
            else{
                setRoundTimerOn(false);
            }
        }
    }, [roundEndTime])

    function startTime() {
        var timer = new Timer((roundEndTime - Date.now()), document.getElementById('countdown'));
        timer.start();
    }

    function resetTime(){
        // setTime(3);
    }
    
    return (
        <div className="game-component">
            <div className="game-area-div">
                {
                    
                roundTimerOn ?

                <div className="countdown-container">
                    <div className="countdown" id="countdown">
                        <div className="countdown-fill" id="ticker"/>
                        <div className="countdown-digit" id="seconds"/>
                    </div>
                </div>

                :

                <div className="categories-container">
                    <div className="category">
                        <span style={{textDecoration: "underline"}}>Category:</span>
                        <span id="categoryText" className="category-text">{category}</span>
                    </div>
                    <div className="letter">
                        <span style={{textDecoration: "underline"}}>Letter:</span>
                        <span id="letterText" className="letter-text">{letter}</span>
                    </div>
                </div>
                }             
            </div>
        </div>
    )
}