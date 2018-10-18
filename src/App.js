import React from 'react';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'




// SQUARE-----------------------------------------------------------------------


function SquareM(props) {

  const iconStyleMine = {
    fontSize: "30px",
    backgroundColor: "#e2b5b1",
  }

  const iconStyleFlag = {
    fontSize: "30px",
  }

// disable buttons when GameOver ---
let disableClick = props.onClick;
if (props.gameOver === true) {disableClick = function(){return}};

// return the Squares ---

if (!props.clicked && !props.flagged ) {
  return <button
            className="squareM"
            onClick={disableClick}
            onContextMenu={props.onContextMenu}
          />
}

else if (props.flagged) {
  return <button
            className="squareM"
            style={iconStyleFlag}
            onClick={disableClick}
            onContextMenu={props.onContextMenu}
          >
            <FontAwesomeIcon icon="flag-checkered"/>
          </button>
}

else  if (props.type === "mine") {
  return <button
            className="squareMClicked"
            style={iconStyleMine}
            onClick={disableClick}
            onContextMenu={props.onContextMenu}
          >
            <FontAwesomeIcon icon="bomb"/>
          </button>
}

else {
  return <button
            className="squareMClicked"
            onClick={disableClick}
            onContextMenu={props.onContextMenu}
          >
            {props.type}
          </button>
}

}

// BOARD COMPONENT--------------------------------------------------------------

class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gameData : [],
      clicked : Array(64).fill(false),
      gameOver : false,
      flagged : Array(64).fill(false),
      won: false,
      minesFlagged: 0,
      numberOfMines: 8,
    }
  }

componentWillMount(){
  // Empty the board ---
  let squaresData = [];
  for (let i = 0; i < 64; i++) {
    squaresData.push(0);
  };

// Put random Mines ---
  for (let i = 0; i<= this.state.numberOfMines; i++) {
    let randomMine = Math.floor((Math.random() * 63) + 1);
    squaresData[randomMine] = "mine";
  };

// calculating the number neighbors ----

for (let j = 0; j<64; j++) {
  let counter = 0;

  if (squaresData[j] !== "mine" && (j+1) % 8 !== 0 && squaresData[j+1] === "mine")  {
    counter += 1;
    squaresData[j] = counter;
  }

  if (j !== 0 && j % 8 !== 0 && squaresData[j] !== "mine" && squaresData[j-1] === "mine")  {
    counter += 1;
    squaresData[j] = counter;
  }

  if (j >= 7 && (j+1) % 8 !== 0 && squaresData[j] !== "mine" && squaresData[j-7] === "mine")  {
    counter += 1;
    squaresData[j] = counter;
  }

  if (j >= 8 && squaresData[j] !== "mine" && squaresData[j-8] === "mine")  {
    counter += 1;
    squaresData[j] = counter;
  }

  if (j >= 9 && j % 8 !== 0 && squaresData[j] !== "mine" && squaresData[j-9] === "mine")  {
    counter += 1;
    squaresData[j] = counter;
  }
  if (j <= 54 && (j+1) % 8 !== 0 && squaresData[j] !== "mine" && squaresData[j+9] === "mine")  {
    counter += 1;
    squaresData[j] = counter;
  }
  if (j <= 55 && squaresData[j] !== "mine" && squaresData[j+8] === "mine")  {
    counter += 1;
    squaresData[j] = counter;
  }
  if ( j <= 56 && (j % 8 !== 0) &&  squaresData[j] !== "mine" && squaresData[j+7] === "mine")  {
      counter += 1;
      squaresData[j] = counter;
    }
}

// set the game data in component's state ---
this.setState({gameData : squaresData});
}

// the reset funtion ---
reset(){
this.setState({
  gameData : [],
  clicked : Array(64).fill(false),
  gameOver : false,
  flagged : Array(64).fill(false),
  won: false,
  minesFlagged: 0,
});
this.componentWillMount();
}

// Click on Square ---
handleClickMS(i) {
  // return if square already clicked
  if (this.state.clicked[i]) {return};
  // otherwise mark square as clicked
  let clickedTemp = this.state.clicked.slice();
  clickedTemp[i] = true;
  this.setState({clicked: clickedTemp});

  // check if gameover and if so, set the state
  if (this.state.gameData[i] === "mine" && this.state.flagged[i] === false) {
    this.setState({gameOver: true})
  };
  // check if won and if so, set the state
  if(this.state.minesFlagged === 3) {
    this.setState({won: true})
  };
}

// handle rightclick to flag the squares
onContextMenu(event, y){
  event.preventDefault();
  let flaggedTemp = this.state.flagged.slice();
  if (flaggedTemp[y] === false) {
    flaggedTemp[y] = true
  } else {
    flaggedTemp[y] = false
  }
  this.setState({flagged: flaggedTemp});
  // check if won
  if (this.state.gameData[y] === "mine") {
    this.setState({minesFlagged: this.state.minesFlagged+1})
  };
  if(this.state.minesFlagged === this.state.numberOfMines) {
    this.setState({won: true})
  };
}

// return the single squares
renderSquareM(){
let squaresDivs = this.state.gameData.map((x,y) => {
  return (
          <div
            key={Math.random() + 1}
          >
            <SquareM
              type={x}
              clicked={this.state.clicked[y]}
              gameOver={this.state.gameOver}
              flagged={this.state.flagged[y]}
              onClick={() => this.handleClickMS(y)}
              onContextMenu={(event) => this.onContextMenu(event, y)}
            />
          </div>
        );
      }
)
  return squaresDivs;
}


 // render the main board component ------

  render() {
    return (!this.state.gameOver && !this.state.won) ?
      ( <div>
          <div className="title">Find Minesweeper instructions <a href="http://www.freeminesweeper.org/help/minehelpinstructions.html">here</a></div>
          <div className="boardM"> {this.renderSquareM()} </div>
          <button className="my-button" onClick={() => this.reset()} >Reset</button>
        </div>)
      :
      ( <div>
          <div className="boardM"> {this.renderSquareM()} </div>
          <Modal onClick={() => this.reset()} result={this.state.won}/>
          <button className="my-button" onClick={() => this.reset()}>Reset</button>
        </div>)
  }
}

// RESULT MODAL -------------------------------------------------------------
class Modal extends React.Component {

  render() {

    return  this.props.result === false ?
        (
        <div className="greyOverlay">
              <div className="modal" >
                <FontAwesomeIcon icon="frown"  />
                  <button className="my-button" onClick={this.props.onClick}>
                    Try Again
                  </button>
              </div>
            </div>
          )
          :
          (
            <div className="greyOverlay">
                    <div className="modal" >
                      <FontAwesomeIcon icon="smile"  />
                        <button className="my-button" onClick={this.props.onClick}>
                          once more
                        </button>
                    </div>
                  </div>
          );
        }
}

// GAME COMPONENT---------------------------------------------------------------

class Minesweeper extends React.Component {
  render() {
   return <Board/>
  }
}



export default Minesweeper
