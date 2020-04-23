import React, { Component } from 'react';
import Card from './Card'

class AllCards extends Component {

    render() {
        return this.props.cards.map((card) => (
            <Card key={card.id} card={card} 

            //reference cards need for rent to reference 
            //each half (each a property) individual props
            referenceCards={card.type === 'rent' ?
                                {card1: this.props.cards[card.side1.id - 1],
                                card2: this.props.cards[card.side2.id - 1]}:
                                undefined}
            />
        ));
    }

}

export default AllCards;
