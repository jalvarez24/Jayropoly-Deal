import React, {useState, useEffect} from 'react'
import firebase from '../firebase';

function UseMessages() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        let messagesRef =  firebase.database().ref().child(`lobbies/${localStorage.getItem("gameId")}/messages`);
        messagesRef.on("value", (snapshot) => {       
            let newData = [];    
            if(snapshot.exists()) {
                Object.keys(snapshot.val()).map((key) => {
                    newData.push({...snapshot.val()[key], key: key});
                })
            }
            setMessages(newData);
        })    
    }, [])

    return messages
}

export default function Popup(props) {
    const messages = UseMessages();
    
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

    return (
        <div style={{backgroundColor: "lightblue", padding: "20px", width: "300px", textAlign: "center"}}>
            <h3>Chat:</h3>
            {
                messages.length ?
                <ul style={{listStyleType: "none", margin: 0,padding: 0, height:"200px", width: "300px", overflowX: "scroll", backgroundColor: "aqua"}}>
                    {messages.map((msg) => (
                        <li key={msg.key}>
                            <span style={{fontWeight: "bold"}}>{props.playerList[msg.userId]}</span>: {msg.message}
                        </li>
                    ))}
                </ul>
                :
                <span>No Messages</span>
            }
            <form onSubmit={(e) => {e.preventDefault()}}>
                <div style={{paddingTop: "10px"}}>
                    <input id="message_input" style={{marginRight: "5px"}} type="text" placeholder="Enter new message" autoComplete="off" required
                        onChange={(e) => { setMessageText(e.target.value) }}
                    />
                    <button onClick={addMessage}>Send Message</button>
                </div>
            </form>
            
        </div>
    )
}
