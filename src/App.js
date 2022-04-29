import React, { useEffect, useState } from "react";
import Die from "./Die";
import { nanoid } from 'nanoid';
import Tada from 'react-reveal/Tada';
import Confetti from "react-confetti";
import Chronometer from "./Time";

export default function App() {
  const [dice, setDice] = React.useState(allNewDice())
  const [count, setCount] = React.useState(0)
  const [winGame, setWinGame] = React.useState(false)
 

  React.useEffect(()=>{
    const firstDieValue = dice[0].value
    const winCondition = dice.every(die=> die.value === firstDieValue)
    const allDieHeld = dice.every(die => die.isHeld)
    if (winCondition && allDieHeld){
      setWinGame(true)
    }
    
  },
  [dice])

  
  function generateNewDie(){
  return {
    value: Math.ceil(Math.random() * 6), 
    isHeld: false,
    id: nanoid()  
  }}

  function holdDice(id){
  setDice(oldDice => oldDice.map(die => {
    return die.id === id ? {...die, isHeld: !die.isHeld }
      : die
   } 
   ))
}

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++){
      newDice.push(generateNewDie())
    }
    
    return newDice
  }
  

  function rollDice(){ 
    if(!winGame){
    setDice(oldDice => oldDice.map(die => 
      {
        return die.isHeld ? die
        : generateNewDie()
      }))
      setCount(preCount => preCount + 1)
  } else{
      setWinGame(false)
      setDice(allNewDice())
      setCount(0)
      
  }
}

  const diceElements = dice.map(die => 
    <Die 
    value={die.value} 
    key={die.id} 
    isHeld={die.isHeld} 
    holdDice={e => winGame ? e.preventDefault() : holdDice(die.id)}
    />
  )

  return (
     
      <main className="main">
      {winGame && <Confetti /> }
      
        <Tada>
          {winGame && <h1>You won the game</h1>}
        </Tada>
        <h1>Number of rolls: {count}</h1>
        <Chronometer />

        <div className="dice-container">
          {diceElements}
        </div>
        <button className="roll-dice" 
        onClick={rollDice}>{winGame ? 'Reset Game' : 'Rooooll'}</button>
        
      </main>
  );
}
