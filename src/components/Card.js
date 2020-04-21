import React, { Component } from 'react';

class Card extends Component {

    render() {
        return (
            <span className="Card" style={{padding: "5px", width: "300px", height: "300px", backgroundColor: this.props.card.color, float: "left"}}>
                {/* Num: {this.props.num} | Type: {this.props.type} */}
                {console.log(this.props.card)}
            </span>
        );
    }
}

export default Card;
