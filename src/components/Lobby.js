import React, { Component } from 'react'
import Popup from './Popup'

export default class Lobby extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lobbyId: "lobbyId1",
            players: props.players
        }
    }


    render() {
        return (
            <div id="lobby">
                <div style={{backgroundColor: "lightgrey"}}>
                    <h3>Invite Yours Friends! They can join lobby with code: </h3>
                    <h2>{this.state.lobbyId}</h2>
                </div>
                <h3>Players in Lobby</h3>
                <div>
                    <ul style={{listStyleType: "none", padding: 0, margin: 0}}>
                        {this.state.players.map((player) => (
                            <li key={player.id}>Player: {player.name}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <button id="start-game-button" disabled={this.state.players.length < 2}>
                        Start Game
                    </button>
                </div>
                <Popup />
            </div>
        )
    }
}
