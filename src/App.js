import React from 'react';
import './App.css';

import Grid from "./components/grid"
import Buttons from './components/buttons'

class App extends React.Component {

  constructor() {
    super();
    this.speed = 300;
    this.rows = 30;
    this.cols = 50;

    this.state = {
      generation: 0,
      gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false)),
    }
  }

  selectBox = (row, col) => {
    let gridCopy = arrayClone(this.state.gridFull);
    gridCopy[row][col] = !gridCopy[row][col];
    this.setState({
      gridFull: gridCopy,
    });
  }

  seed = () => {
    let gridCopy = arrayClone(this.state.gridFull);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (Math.floor(Math.random() * 4) === 1) {
          gridCopy[i][j] = true;
        }
      }
    }
    this.setState({
      gridFull: gridCopy,
    });
  }

  slow = () => {
    console.log("Hello");
    this.speed += 100;
    this.playButton();
  }

  fast = () => {
    this.speed -= 100;
    this.playButton();
  }

  clear = () => {
    let grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    this.setState({
      gridFull: grid, 
      generation: 0,
    });
  }

  gridSize = (size) => {
    console.log(size);
    switch(size) {
      case "1":
        this.cols = 20;
        this.rows = 10;
      break;
      case "2":
        this.cols = 50;
        this.rows = 30;
      break;
      default:
        this.cols = 70;
        this.rows = 50;

    }
    this.clear();
  }

  playButton = () => {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.play, this.speed);
  }

  pauseButton = () => {
    clearInterval(this.intervalId);
  }

  play = () => {
    let g = this.state.gridFull;
    let g2 = arrayClone(this.state.gridFull);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let count = 0;
        if ((i > 0) && g[i-1][j]) count++;
        if ((j > 0) && g[i][j - 1]) count++;
        if ((i < this.rows - 1) && g[i+1][j]) count++;
        if ((j < this.cols - 1) && g[i][j+1]) count++;
        if ((i > 0 && j > 0) && g[i-1][j-1]) count++;
        if ((i < this.rows - 1 && j < this.cols -1 ) && g[i+1][j+1]) count++;
        if ((i < this.rows - 1 && j > 0) && g[i+1][j-1]) count++;
        if ((i > 0 && j < this.cols - 1) && g[i-1][j+1]) count++;
        if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
        if (!g[i][j] && count === 3) g2[i][j] = true;
      }
    }
    this.setState({
      gridFull: g2,
      generation: this.state.generation + 1,
    })
  }

  componentDidMount() {
    this.seed();
    this.playButton();
  }

  render() {
    return (
      <div className="App">
        <h1>The Game of Life</h1>
        <Buttons
          play={this.playButton}
          pause={this.pauseButton}
          slow={this.slow}
          fast={this.fast}
          clear={this.clear}
          gridSize={this.gridSize}
          seed={this.seed}
        />
        <Grid
          gridFull={this.state.gridFull}
          rows = {this.rows}
          cols = {this.cols}
          selectBox={this.selectBox}
        />
        <h2>Generations: {this.state.generation}</h2>
      </div>
    );
  }
  
}

const arrayClone = (arr) => {
  return JSON.parse(JSON.stringify(arr));
};

export default App;
