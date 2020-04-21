import React, { Component } from 'react';
import Card from './Card'

class AllCards extends Component {

    render() {
        return this.props.cards.map((card) => (
            <Card key={card.id} card={card} />
        ));
    }

}

export default AllCards;
