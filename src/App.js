import React, { useEffect, useState } from "react";
import Die from "./Die";
import { nanoid } from 'nanoid';
import Tada from 'react-reveal/Tada';
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = React.useState(allNewDice())
  const [count, setCount] = React.useState(0)
  const [winGame, setWinGame] = React.useState(false)
  const [time, setTime] = useState(
    {
      seconds: 0,
      minutes: 0,
      hours: 0
    }
  );
  const [isActive, setIsActive] = useState(true);

  React.useEffect(()=>{
    const firstDieValue = dice[0].value
    const winCondition = dice.every(die=> die.value === firstDieValue)
    const allDieHeld = dice.every(die => die.isHeld)
    if (winCondition && allDieHeld){
      setWinGame(true)
      toggle()
    } 
  },
  [dice])
  

  function toggle() {
    setIsActive(!isActive);
  }

  function reset() {
    setTime(
    {
      seconds: 0,
      minutes: 0,
      hours: 0
    }
    );
    setIsActive(true);
  }

  useEffect(() => {
    let interval = null;
    let nSeconds = time.seconds;
    let nMinutes = time.minutes;
    let nHours = time.hours;

    if (isActive) {
      interval = setInterval(() => {
        nSeconds++;

        if (nSeconds > 59) {
          nMinutes++;
          nSeconds = 0;
        }
        if (nMinutes > 59) {
          nHours++;
          nMinutes = 0;
        }
        if (nHours > 24) {
          nHours = 0;
        }

        setTime( {
          seconds: nSeconds,
          minutes: nMinutes, 
          hours: nHours
        });
      }, 1000);
    } 
    else if (!isActive && time.seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

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
  } 
  else
  {
    reset()
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

        <h3>Number of rolls: {count}</h3>

        <Tada>
          <div className="time">
            <p>
            {`
              ${time.hours < 10 ? '0' + time.hours : time.hours} :
              ${time.minutes < 10 ? '0' + time.minutes : time.minutes} :
              ${time.seconds < 10 ? '0' + time.seconds : time.seconds}
            `}
            </p>
          </div>
        </Tada>

        <div className="dice-container">
          {diceElements}
        </div>
        
        <button className="roll-dice" 
        onClick={rollDice}>{winGame ? 'Reset Game' : 'Roll'}
        </button>
    
      </main>
  );
}
