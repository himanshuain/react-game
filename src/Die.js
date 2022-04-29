import React from "react";
import Tada from 'react-reveal/Tada';


export default function Die(props) {
    const styleDie =  {
    backgroundColor: props.isHeld ? "#59E391" : "white"
    }

    return(
        <Tada>
        <div 
        className="die-face" 
        style={styleDie}
        onClick={props.holdDice}
        >
            <Tada>
                <h2 className="die-num">{props.value}</h2>
            </Tada>
            
        </div>
        </Tada>
    )
}