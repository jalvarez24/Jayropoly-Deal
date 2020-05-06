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

    return (
        <>
            <h3 style={{marginTop: "1vh", marginBottom: "1vh"}}>Fam Chat:</h3>
            <nav style={{textAlign: "center"}}>
            <ul className="messages">
                {
                messages.length ?
                messages.map((msg) => (
                    <li className={msg.userId === localStorage.getItem("userId") ? "messageSelf":"messageOther"} key={msg.key}>
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
                        : {msg.message}
                    </li>
                ))
                :
                <span style={{color: "white", fontWeight: "bold"}}>No Messages</span>
                }
            </ul>    
            </nav>      
            <form onSubmit={(e) => {e.preventDefault()}}>
                <div style={{paddingTop: "10px"}}>
                    <input id="message_input" style={{marginRight: "5px"}} type="text" placeholder="Enter new message" autoComplete="off" required
                        onChange={(e) => { setMessageText(e.target.value) }}
                    />
                    <button onClick={addMessage}>Send Message</button>
                </div>
            </form> 
            
        </>
    )
}
