import React, {useState, useEffect} from 'react';
import '../style/game.css';
import './style/game-area.css';

export default function GameArea() {

    //seconds on timer
    const [time, setTime] = useState(3);

    //call API on component mount, do nothing with the response data
    //this is just to prevent possible cold boot
    useEffect(() => {
        async function coldBoot() {
            let url = 'https://us-central1-i-got-it-fam.cloudfunctions.net/getData';
            try{
                let data = await fetch(url);
                console.log("Cold boot success.");
            }
            catch(err) {
                console.log("Could not cold boot API: " + err);
            }
        }
    }, []);
    
    useEffect(() => {
        if(time === 0){ 
            //call cloud function to update database with new category letter
            apiCall();
        }
    }, [time]);

    async function apiCall() {
        let url = 'https://us-central1-i-got-it-fam.cloudfunctions.net/getData';
        
        try{
            let data = await fetch(url);
            data.json().then(data => {
                document.getElementById('categoryText').innerText = data.category;
                document.getElementById('letterText').innerText = data.letter;
            })
        } 
        catch(err) {
            console.log("Could not retrieve from API: " + err);
        }
    }

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
                self.els.seconds.textContent = "GO!";
                setTime(0);
                self.els.ticker.style.height = '0%';
            }
        };
        
        self.frameReq = window.requestAnimationFrame(draw);
    }

    function startTime() {
        var timer = new Timer(time * 1000, document.getElementById('countdown'));
        timer.start();
    }

    function resetTime(){
        setTime(3);
    }
    /////
    
    return (
        <div className="game-component">
            <div className="game-area-div">
                {
                time !== 0 ?
                <div className="countdown-container" onClick={startTime}>
                    <div className="countdown" id="countdown">
                        <div className="countdown-fill" id="ticker"></div>
                        <div className="countdown-digit" id="seconds">3</div>
                    </div>
                </div>
                :
                <div className="categories-container" onClick={resetTime}>
                    <div className="category">
                        <span style={{textDecoration: "underline"}}>Category:</span>
                        <span id="categoryText" className="category-text"></span>
                    </div>
                    <div className="letter">
                        <span style={{textDecoration: "underline"}}>Letter:</span>
                        <span id="letterText" className="letter-text"></span>
                    </div>
                </div>
                }
                

            </div>
        </div>
    )
}