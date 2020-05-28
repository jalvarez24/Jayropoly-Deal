import React, {useState, useEffect} from 'react';
import firebase from 'firebase';
import '../style/game.css';
import './style/game-area.css';
import { stat } from 'fs';

export default function GameArea({category, letter, roundStartTime, roundEndTime}) {

    const [roundTimerOn, setRoundTimerOn] = useState(true);
    const [roundEndTimerOn, setRoundEndTimerOn] = useState(true);
    const [gameTimerOn, setGameTimerOn] = useState(true);

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
            if (!start) {
                start = now;
                //protects if animation called while browser was in background
                self.duration = roundStartTime - Date.now();
            }
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
            }
        };
        
        self.frameReq = window.requestAnimationFrame(draw);
    }

    function RoundTimer(duration) {
        var self = this;
        this.duration = duration;
        this.running = false;
        this.ticker = document.querySelector('.countdown-game');
    }
    
    RoundTimer.prototype.start = function() {
        var self = this;
        var start = null;
        this.running = true;
        
        function draw(now) {  
            if (!start) {
                start = now;
                //protects if animation called while browser was in background
                self.duration = roundEndTime - Date.now();
            }

            var diff = now - start;

            if (diff <= self.duration) {
                if(self.ticker === null) {
                    self.ticker = document.querySelector('.countdown-game');
                }
                self.ticker.style.height = 100 - (diff/self.duration*100) + '%';          
                self.frameReq = window.requestAnimationFrame(draw);
            } 
            else {
                self.running = false;
                self.ticker.style.height = '0%';
            }
        };
        
        self.frameReq = window.requestAnimationFrame(draw);
    }

    useEffect(() => {
        if(typeof(roundStartTime) === "number"){
            if(roundStartTime > Date.now()){
                //before startingTime make sure timer element is on!
                setRoundTimerOn(true);
                // startTime();
            }
            else{
                console.log("roundStartTime else, val: " + roundStartTime);
                setRoundTimerOn(false);
            }
        }
    }, [roundStartTime])

    useEffect(() => {
        if(roundTimerOn) 
            startTime();
    }, [roundTimerOn])

    useEffect(() => {
        if(typeof(roundEndTime) === "number"){
            if(roundEndTime > Date.now()){
                console.log("startRoundTime triggered.")
                
                startRoundTime();
            }
            else{
                console.log("roundEndTime else")
                setGameTimerOn(false);
            }
        }
    }, [roundEndTime])

    function startTime() {
        var timer = new Timer((roundStartTime - Date.now()), document.getElementById('countdown'));
        timer.start();
    }

    function startRoundTime() {
        // setGameTimerOn(true);
        var roundTimer = new RoundTimer((roundEndTime - Date.now()));
        roundTimer.start();
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
                    {
                        roundEndTimerOn ? 
                        <div className="countdown-game"/>
                        :
                        null
                    }  
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