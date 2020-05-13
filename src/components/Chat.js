import React, {useState, useEffect} from 'react'
import firebase from '../firebase';
import './style/chat.css'//
export default function Popup(props) {

    function GetMessages() {
        const [messages, setMessages] = useState([]);
    
        useEffect(() => {
            let messagesRef = firebase.database().ref().child(`lobbies/${localStorage.getItem("gameId")}/messages`);
            messagesRef.on("value", (snapshot) => {       
                let newData = [];    
                if(snapshot.exists()) {
                    Object.keys(snapshot.val()).forEach((key) => {
                        newData.push({...snapshot.val()[key], key: key});
                    })
                }   
                setMessages(newData);
            })

            //disconnect on unmount
            return () => {
                clearInterval(refreshTime);
                messagesRef.off();    
            }

        }, [])
        return messages
    }

    //makes sure chat list is always scrolled to most recent message
    useEffect(() => {
        scrollToBottom();
    })

    const messages = GetMessages();
    
    const [messageText, setMessageText] = useState("");

    function addMessage(e) {
        if(messageText.trim() !== "") {
            let text = messageText;
            let messages = firebase.database().ref().child(`lobbies/${localStorage.getItem("gameId")}/messages`);
            let msgPost = messages.push()
            msgPost.set({
                message: text,
                userId: localStorage.getItem("userId")
            })
        }

        //clear value and avoid form submission
        document.getElementById("message_input").value = "";
        setMessageText("");
        e.preventDefault();        
    }

    function scrollToBottom() {
        let obj = document.querySelector(".messages");
        if(obj)
            obj.scrollTop = obj.scrollHeight;  
    }

    function refreshTime() {
        var dateString = new Date().toLocaleString("en-US", {timeZone: new window.Intl.DateTimeFormat().resolvedOptions().timeZone});
        var formattedString = dateString.replace(", ", " - ");
        if(document.querySelector(".time"))
            document.querySelector(".time").textContent = formattedString;
        else
            clearInterval(timeInterval)
    }
    let timeInterval = setInterval(refreshTime, 1000);
    

    return (
        <div className="chat-container">
            <span className="head-set"></span>
            <span className="home-button"></span>
            <div className="phone">
                <div className="status-bar">
                    <span className="time"/>
                    <span className="name">IGIF!</span>
                </div>
                <div className="group-name"><span>Group:</span>The Fam <span role="img" aria-label="fire">🔥</span></div>
                <ul className="messages">
                    {
                    messages.length ?
                    messages.map((msg) => (
                        <li className={msg.userId === localStorage.getItem("userId") ? "message messageSelf":"message messageOther"} key={msg.key}>
                            {
                                props.playerList[msg.userId] ?

                                <span style={{fontWeight: "bold"}}>
                                    {props.playerList[msg.userId]}
                                </span>
                                :
                                <span style={{fontStyle: "italic", color: "red"}}>
                                    {"Player left"}
                                </span>
                            }
                            : <span className="message-text">{msg.message}</span>
                        </li>
                    ))
                    :
                    <span style={{color: "white", fontWeight: "bold", marginTop: "10px"}}>No Messages</span>
                    }
                </ul>    
                <form className="text-area" onSubmit={(e) => {e.preventDefault()}}>
                        <input spellCheck="false" id="message_input" style={{marginRight: "5px"}} type="text" placeholder="Enter new message" autoComplete="off" required
                            onChange={(e) => { setMessageText(e.target.value) }} 
                        />
                        <button className="submit" onClick={addMessage}></button>
                </form>  
            </div>         
        </div>
    )
}
