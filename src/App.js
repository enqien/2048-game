import { useState } from "react";
import "./App.css";

function init() {
  const random_square = Math.floor(Math.random() * 16);
  const to_return = Array(16).fill(null);
  to_return[random_square] = 2;
  // random_square = Math.floor(Math.random() * 16);
  // to_return[random_square] = 2;
  return to_return;
}
function App() {
  const [squares, setSquares] = useState(init());
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  function onReset() {
    setSquares(init());
    setScore(0);
  }

  function update(direction) {
    //left up can use the original order
    let increment_first = 0;
    let increment_second = 0;
    let initial = 0;

    if (direction === "up") {
      initial = 0;
      increment_first = 1;
      increment_second = -4;
    } else if (direction === "down") {
      initial = squares.length - 1;
      increment_first = -1;
      increment_second = 4;
    } else if (direction === "left") {
      initial = 0;
      increment_first = 1;
      increment_second = -1;
    } else if (direction === "right") {
      initial = squares.length - 1;
      increment_first = -1;
      increment_second = 1;
    }
    let next_squares = [...squares];

    for (
      let i = initial;
      i >= 0 && i < next_squares.length;
      i += increment_first
    ) {
      // console.log("i:" + i);
      if (next_squares[i] !== null) {
        let next_position = i;
        let first = 0;
        let last = squares.length - 1;

        if (direction === "left") {
          first = i - (i % 4);
          last = i + (3 - (i % 4));
        } else if (direction === "right") {
          first = i - (i % 4);
          last = i + (3 - (i % 4));
        }
        for (
          let j = i + increment_second;
          j >= first && j <= last;
          j += increment_second
        ) {
          // console.log("j:" + j);
          if (next_squares[j] === null) {
            next_position = j;
          } else {
            break;
          }
        }
        // console.log(next_position);
        // console.log(next_position + increment_second);
        // console.log(next_squares[next_position]);
        // console.log(next_squares[next_position + increment_second]);

        if (next_position !== i) {
          next_squares[next_position] = next_squares[i];
          next_squares[i] = null;
        }
        if (
          next_position + increment_second >= first &&
          next_position + increment_second <= last &&
          next_squares[next_position + increment_second] ===
            next_squares[next_position]
        ) {
          // console.log("merge");
          next_squares[next_position + increment_second] =
            next_squares[next_position] * 2;
          //important bug here, try to figure it out
          //how to make sure set best score after refreshing the value of score
          if (score + next_squares[next_position + increment_second] > best) {
            setBest(score + next_squares[next_position + increment_second]);
          }

          setScore(
            (score) => score + next_squares[next_position + increment_second]
          );
          next_squares[next_position] = null;
        }
        // console.log(next_position);
      }
    }
    if (!next_squares.includes(null)) {
      setSquares(next_squares);
      return;
    }
    let random_square = Math.floor(Math.random() * 16);
    while (true) {
      if (next_squares[random_square] === null) {
        break;
      }
      random_square = Math.floor(Math.random() * 16);
    }
    const random_num = Math.random();
    if (random_num < 0.5) {
      next_squares[random_square] = 2;
    } else {
      next_squares[random_square] = 4;
    }

    // console.log(next_squares);
    setSquares(next_squares);
  }

  function clickHandler(event) {
    update(event.target.id);
    // let random_square = Math.floor(Math.random() * 16);
    // while (true) {
    //   if (squares[random_square] === null) {
    //     break;
    //   }
    //   random_square = Math.floor(Math.random() * 16);
    // }
    // setSquares((prevSquares) => {
    //   prevSquares[random_square] = 2;
    //   return prevSquares;
    // });
  }

  return (
    <div className="container">
      <ScoreBoard onReset={onReset} score={score} best={best} />
      <Board squares={squares} />
      <Control clickHandler={clickHandler} />
    </div>
  );
}

export default App;

function Board(props) {
  return (
    <div className="board-grid">
      {props.squares.map((num, index) => {
        return <Square num={num} key={index} />;
      })}
    </div>
  );
}

function Square(props) {
  return (
    <div
      className={`grid ${
        props.num === 2
          ? "two"
          : props.num === 4
          ? "four"
          : props.num === 8
          ? "eight"
          : props.num === 16
          ? "sixteen"
          : props.num === 32
          ? "thirtytwo"
          : props.num === 64
          ? "sixtyfour"
          : props.num === 128
          ? "onetwoeight"
          : props.num
          ? "default"
          : ""
      }`}
    >
      {props.num}
    </div>
  );
}

function Control(props) {
  return (
    <div className="controls">
      <h1>Controls</h1>
      <button id="up" onClick={props.clickHandler}>
        Up
      </button>
      <button id="left" onClick={props.clickHandler}>
        Left
      </button>
      <button id="down" onClick={props.clickHandler}>
        Down
      </button>
      <button id="right" onClick={props.clickHandler}>
        Right
      </button>
    </div>
  );
}
// function button(props) {}

function ScoreBoard(props) {
  return (
    <div className="scoreboard">
      <h1>2048</h1>
      <div className="score">
        SCORE
        <h1>{props.score}</h1>
      </div>
      <div className="best">
        BEST<h1>{props.best}</h1>
      </div>
      <button onClick={props.onReset}>RESET</button>
    </div>
  );
}
