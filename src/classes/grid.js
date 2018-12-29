/*
This class creates the white grid lines and stores an array of points that represent the
physical centres of each grid square. This class will be used to get positions for ships
and projectiles for the game. The array of points is comparable to the game state that we
store for each game (position of ships in the game). THe game state and the array of
points will be used to calculate the visuals and the positions of the ships.
*/
import * as PIXI from 'pixi.js';
import { GLOBAL_WIDTH, GLOBAL_HEIGHT } from '../constants';

export default class GridDrawer {
  constructor(app, gameBoard, lineWidth) {
    this.gameBoard = gameBoard;
    this.width = lineWidth;
    this.app = app;
    this.colour = 0xffffff;

    this.points = []; //this is the array of points that represents the centre of all squares in the grid
  }

  fill() {
    //draws the grid in its entirety
    this.drawGridLines();
    this.drawPerimeterLine();
    //this.calculatePoints();
  }

  calculatePoints() {
    //function to calculate the physical center points for each square in the grid
    let squareX = GLOBAL_WIDTH / this.gameBoard.dimension;
    let squareY = GLOBAL_HEIGHT * 0.8 / this.gameBoard.dimension;
    let halfSquareX = GLOBAL_WIDTH / this.gameBoard.dimension / 2;
    let halfSquareY = GLOBAL_HEIGHT * 0.8 / this.gameBoard.dimension / 2;

    for (let i = 0; i < this.gameBoard.dimension; i++) {
      for (let j = 0; j < this.gameBoard.dimension; j++) {
        let point = new PIXI.Point(
          halfSquareX + squareX * j,
          halfSquareY + squareY * i
        );
        this.gameBoard.squareHighlighter.pointArray.push(point);
      }
    }
  }

  drawCircles() {
    //creates small circles at each point
    let circle = new PIXI.Graphics();

    this.gameBoard.squareHighlighter.pointArray.forEach(point => {
      circle
        .lineStyle(0)
        .beginFill(0xffffff, 0.2)
        .drawCircle(point.x, point.y, 3)
        .endFill();
    });

    this.app.stage.addChild(circle);
  }

  //draws grid lines based on the dimensionality provided
  drawGridLines() {
    let gridLines = [];
    let line = new PIXI.Graphics();

    for (let i = 1; i < this.gameBoard.dimension; i++) {
      line
        .lineStyle(this.width, this.colour, 0.1)
        .moveTo(GLOBAL_WIDTH * i / this.gameBoard.dimension, 0)
        .lineTo(
          GLOBAL_WIDTH * i / this.gameBoard.dimension,
          GLOBAL_HEIGHT * 0.8
        );

      this.app.stage.addChild(line);
    }

    //add horizontal lines
    for (let i = 0; i < this.gameBoard.dimension; i++) {
      line
        .lineStyle(this.width, this.colour, 0.1)
        .moveTo(0, GLOBAL_HEIGHT * 0.8 * i / this.gameBoard.dimension)
        .lineTo(
          GLOBAL_WIDTH,
          GLOBAL_HEIGHT * 0.8 * i / this.gameBoard.dimension
        );

      this.app.stage.addChild(line);
    }

    gridLines.forEach(line => {
      this.app.stage.addChild(line);
    });
  }

  //draws perimeter rectangle
  drawPerimeterLine() {
    let perimeter = new PIXI.Graphics();
    perimeter
      .lineStyle(5, 0x000000, 0.2)
      .drawRect(0, 0, GLOBAL_WIDTH, GLOBAL_HEIGHT * 0.8);

    this.app.stage.addChild(perimeter);
  }

  getPointArray() {
    return this.points;
  }

  setPointsArray(newPoints) {
    this.points = newPoints;
  }

  drawGrid() {
    this.drawPerimeterLine();
    this.drawGridLines();
    this.calculatePoints();
  }
}

//number of lines of a grid is 2(n-1) where n is the dimension of the grid
// for a 3 by 3 grid, n = 3
