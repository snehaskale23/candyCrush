import React, { useEffect } from "react";
import BlueCandy from './images/blue-candy.png';
import RedCandy from './images/red-candy.png';
import GreenCandy from './images/green-candy.png';
import PurpleCandy from './images/purple-candy.png';
import YellowCandy from './images/yellow-candy.png';
import OrangeCandy from './images/orange-candy.png';
import blank from "./images/blank.png";
import Score from "./components/Score";
import Title from "./images/title.png";

const width = 8;
const candyColors = [BlueCandy,RedCandy,GreenCandy,OrangeCandy,PurpleCandy,YellowCandy]


function App() {
  const [currentColorArrangement,setArrangement] = React.useState([]);
  const [squareBeingDragged,setSquareDrag] = React.useState(null);
  const [squareBeingReplaced,setSquareRep] = React.useState(null);
  const [score,setScore] = React.useState(0);

  function checkForColumnOf4(){
    for(let i=0;i<=39;i++){
      const colOf4 = [i,i+width,i+width+width,i+width+width+width];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;
      if(colOf4.every(square => currentColorArrangement[square] === decidedColor) && !isBlank){
        setScore((score)=> score+4)
        colOf4.forEach((square)=>{
          currentColorArrangement[square] = blank
        })
        return true
      }
    }
  }

  function checkForColumnOf3(){
    for(let i=0;i<=47;i++){
      const colOf3 = [i,i+width,i+width+width];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;
      if(colOf3.every(square => currentColorArrangement[square] === decidedColor) && !isBlank){
        setScore((score)=> score+3)
        colOf3.forEach((square)=>{
          currentColorArrangement[square] = blank
        })
        return true
      }
    }
  }

  function checkForRowOf4(){
    for(let i=0;i<64;i++){
      const rowOf4 = [i,i+1,i+2,i+3];
      const decidedColor = currentColorArrangement[i];
      const notValid = [6,7,14,15,22,23,30,31,38,39,46,47,54,55,63,64,5,13,21,29,37,45,53,62]
      if(notValid.includes(i)){
        continue;
      }
      const isBlank = currentColorArrangement[i] === blank;
      if(rowOf4.every(square => currentColorArrangement[square] === decidedColor) && !isBlank){
        setScore((score)=> score+4)
        rowOf4.forEach((square)=>{
          currentColorArrangement[square] = blank
        })
        return true
      }
    }
  }

  function checkForRowOf3(){
    for(let i=0;i<64;i++){
      const rowOf3 = [i,i+1,i+2];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;
      const notValid = [6,7,14,15,22,23,30,31,38,39,46,47,54,55,63,64]
      if(notValid.includes(i)){
        continue;
      }
      if(rowOf3.every(square => currentColorArrangement[square] === decidedColor) && !isBlank){
        setScore((score)=> score+3)
        rowOf3.forEach((square)=>{
          currentColorArrangement[square] = blank
        })
        return true
      }
    }
  }

  function moveIntoSquareBelow(){
    for(let i =0;i<=55;i++){
      const firstRow=[0,1,2,3,4,5,6,7]
      const isFirstRow = firstRow.includes(i)
      if(isFirstRow && currentColorArrangement[i] === blank){
        currentColorArrangement[i] = candyColors[Math.floor(Math.random()*candyColors.length)]
      }
      if(currentColorArrangement[i + width] === blank){
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i]=blank
      }
    }
  }

  function dragStart(e){
    setSquareDrag(e.target)
  }
  function dragDrop(e){
    setSquareRep(e.target)
  }
  function dragEnd(e){
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))

    currentColorArrangement[squareBeingReplacedId]=squareBeingDragged.getAttribute('src');
    currentColorArrangement[squareBeingDraggedId]=squareBeingReplaced.getAttribute('src');

    const validMoves=[squareBeingDraggedId-1,squareBeingDraggedId+1,squareBeingDraggedId-8,squareBeingDraggedId+8]
    const validMove = validMoves.includes(squareBeingReplacedId)

    const isRowOf4 = checkForRowOf4()
    const isColOf4 = checkForColumnOf4()
    const isColOf3 = checkForColumnOf3()
    const isRowOf3 = checkForRowOf3()

    if(squareBeingReplacedId && validMove && (isColOf3 || isRowOf3 || isColOf4 || isRowOf4)){
      setSquareDrag(null)
      setSquareRep(null)
    }else{
      currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
      currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
      setArrangement([...currentColorArrangement])
    }


  }

  function createBoard(){
    const randomColorArragement=[];
    for(let i=0;i<width*width;i++){
      const randomColor = candyColors[Math.floor(Math.random()*candyColors.length)];
      randomColorArragement.push(randomColor);
    }
    setArrangement(randomColorArragement);
  }

  useEffect(()=>{
    createBoard();
  },[])

  useEffect(()=>{
    const timer = setInterval(()=>{
      checkForRowOf4()
      checkForColumnOf4()
      checkForColumnOf3()
      checkForRowOf3()
      moveIntoSquareBelow()
      setArrangement([...currentColorArrangement])
    },50)
    return()=>clearInterval(timer)
  },[checkForColumnOf4,checkForRowOf4,checkForRowOf3,checkForColumnOf3,currentColorArrangement])

  return (
  <div className="super">
    <img  className="title" src={Title}/>
    <div className="app">
      <div className="game">
        {currentColorArrangement.map((tile,index)=>(
          <img 
          key={index} 
          data-id={index}
          src={tile} 
          alt={tile} 
          draggable='true' 
          onDragOver={e => e.preventDefault()} 
          onDragEnter={e => e.preventDefault()} 
          onDragLeave={e => e.preventDefault()} 
          onDrop={dragDrop}
          onDragEnd={dragEnd}
          onDragStart={dragStart}
          />
        ))} 
      </div>
      <Score score={score}/>
    </div>
  </div>
  );
}

export default App;
