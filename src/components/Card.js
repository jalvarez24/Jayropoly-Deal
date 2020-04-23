import React from 'react';

const Card = (props) => {

    return (
        <div className="Card" style={{margin: "10px", padding: "10px", width: "130px", height: "180px", backgroundColor: props.card.color, float: "left", border: "1px solid black"}}>        
            {props.card.id}
            <hr/>
            {props.card.type}
            <hr/>
            {props.card.type === "rent" &&               
                <>
                    
                    <div style={{color: props.referenceCards.card1.color, fontWeight: "bold"}}>
                        side1 id: {props.card.side1.id}
                    </div>
                    <div style={{color: props.referenceCards.card2.color, fontWeight: "bold"}}>
                        side2 id: {props.card.side2.id}
                    </div>
                </>
            }
            
            {props.card.type === "money" && 
                <>
                    <span>
                        ${props.card.value}
                    </span>
                </>
            }
        </div>
    );
}

export default Card;
