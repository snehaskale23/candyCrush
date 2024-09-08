import React from "react";

function Score(props){
    return <div className="score playwrite-cu-xyz">
        <h1>Score</h1>
        <h2 >{props.score}</h2>
    </div>
}

export default Score;