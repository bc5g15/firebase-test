/*
This class creates the white grid lines and stores an array of points that represent the
physical centres of each grid square. This class will be used to get positions for ships
and projectiles for the game. The array of points is comparable to the game state that we
store for each game (position of ships in the game). THe game state and the array of
points will be used to calculate the visuals and the positions of the ships.
*/
import * as PIXI from 'pixi.js';
import * as util from './utility';
import { GLOBAL_WIDTH, GLOBAL_HEIGHT } from '../constants';

const LINE_WIDTH = 2;
const LINE_COLOR = 0xffffff;

export default class GameGrid {
  constructor(app, dimension) {
    this.dimension = dimension;
    this.app = app;

    // Map boardPosition -> PIXI.Point
    this.pointArray = [];

    // Build up point array
    this._calculatePoints();
  }

  // Calculates the PIXI.Points for a given board dimension
  _calculatePoints() {
    //function to calculate the physical center points for each square in the grid
    let squareX = GLOBAL_WIDTH / this.dimension;
    let squareY = GLOBAL_HEIGHT * 0.8 / this.dimension;
    let halfSquareX = GLOBAL_WIDTH / this.dimension / 2;
    let halfSquareY = GLOBAL_HEIGHT * 0.8 / this.dimension / 2;

    for (let i = 0; i < this.dimension; i++) {
      for (let j = 0; j < this.dimension; j++) {
        let point = new PIXI.Point(
          halfSquareX + squareX * j,
          halfSquareY + squareY * i
        );
        this.pointArray.push(point);
      }
    }
  }

  // Return the PIXI.Point (position) from the grid index
  getPointFromIndex(index) {
    return this.pointArray[index];
  }

  // Returns the closest grid square (in the form of an index to be used with the pointArray[]) to the point argument
  // this function is probably best put in the utilities script file.
  getIndexFromPoint(point) {
    let indexNum = -1;
    let minDist = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < this.pointArray.length; i++) {
      let dist = util.calculateDistance(point, [
        this.pointArray[i].x,
        this.pointArray[i].y
      ]);
      if (dist < minDist) {
        minDist = dist;
        indexNum = i;
      }
    }

    return indexNum;
  }

  drawCircles() {
    // Creates small circles at each point
    let circle = new PIXI.Graphics();

    this.pointArray.forEach(point => {
      circle
        .lineStyle(0)
        .beginFill(0xffffff, 0.2)
        .drawCircle(point.x, point.y, 3)
        .endFill();
    });

    this.app.stage.addChild(circle);
  }

  // Draws grid lines based on the dimensionality provided
  drawGridLines() {
    let line = new PIXI.Graphics();

    // Vertical lines
    for (let i = 1; i < this.dimension; i++) {
      line
        .lineStyle(LINE_WIDTH, LINE_COLOR, 0.1)
        .moveTo(GLOBAL_WIDTH * i / this.dimension, 0)
        .lineTo(GLOBAL_WIDTH * i / this.dimension, GLOBAL_HEIGHT * 0.8);

      this.app.stage.addChild(line);
    }

    // Horizontal lines
    for (let i = 0; i < this.dimension; i++) {
      line
        .lineStyle(LINE_WIDTH, LINE_COLOR, 0.1)
        .moveTo(0, GLOBAL_HEIGHT * 0.8 * i / this.dimension)
        .lineTo(GLOBAL_WIDTH, GLOBAL_HEIGHT * 0.8 * i / this.dimension);

      this.app.stage.addChild(line);
    }
  }

  //draws perimeter rectangle
  drawPerimeterLine() {
    let perimeter = new PIXI.Graphics();
    perimeter
      .lineStyle(5, 0x000000, 0.2)
      .drawRect(0, 0, GLOBAL_WIDTH, GLOBAL_HEIGHT * 0.8);

    this.app.stage.addChild(perimeter);
  }

  drawGrid() {
    this.drawPerimeterLine();
    this.drawGridLines();
  }
}

//number of lines of a grid is 2(n-1) where n is the dimension of the grid
// for a 3 by 3 grid, n = 3
