import React, { useState } from 'react';
import cardList from '../cards.json'
import Card from './Card'

export default function AllCards() {

    const [cards] = useState(cardList.cards);

    return cards.map((card) => (
        <Card key={card.id} card={card}

        //reference cards need for rent to reference 
        //each half (each a property) individual props
        referenceCards={
            card.type === 'rent' ?
            {card1: cards[card.side1.id - 1], card2: cards[card.side2.id - 1]}:
            undefined
        }
        />
    ));
}