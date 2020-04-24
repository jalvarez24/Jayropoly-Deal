import React, { Component } from 'react'

export default class Popup extends Component {
    state = {
        messages: [
            {
                user: "joe",
                msg: "Welcome to the game."
            },
            {
                user: "alex",
                msg: "thx fam"
            },
            {
                user: "joe",
                msg: "No problem."
            }
        ],
        messageText: ""
    };

    addMessage = (e) => {
        e.preventDefault();   
        let text = this.state.messageText;
        this.setState({ 
            messages: [
                ...this.state.messages, 
                {
                    user: "newUsername",
                    msg: text
                }
            ]
        })
        //clear field
        document.getElementById("message_text").value = "";
    }

    render() {
        return (
            <div>
                <h3>Chat List:</h3>
                <div>
                    <ul style={{listStyleType: "none", padding: 0, margin: 0}}>
                        {this.state.messages.map((message) => (
                            <li>{message.user}: {message.msg}</li>
                        ))}
                    </ul>
                </div>
                <form>
                    <input id="message_text" type="text" placeholder="Enter new message"
                        onChange={(e) => {this.setState({messageText: e.target.value}) }}
                    />
                    <button onClick={this.addMessage}>Send Message</button>
                    <input type="reset" text="Clear"></input>
                </form>
                
            </div>
        )
    }
}
