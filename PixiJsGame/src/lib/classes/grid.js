/*

This class creates the white grid lines and stores an array of points that represent the
physical centres of each grid square. This class will be used to get positions for ships
and projectiles for the game. The array of points is comparable to the gamestate that we
store for each game (position of ships in the game). THe gamestate and the array of
points will be used to calculate the visuals and the positions of the ships.

*/

class GridDrawer {

    constructor(app, dimention, lineWidth, windowWidth, windowHeight) {

        this.dimention = dimention;
        this.width = lineWidth;
        this.innerWidth = windowWidth;
        this.innerHeight = windowHeight;
        this.app = app;
        this.colour = 0xffffff;

        this.points = [];   //this is the array of points that represents the centre of all squares in the grid
    }

    fill(){

        this.drawGridLines();
        this.drawPerimeterLine();
        this.calculatePoints();
    }

    calculatePoints() {

        let squareX = innerWidth / this.dimention;
        let squareY = innerHeight * 0.8 / this.dimention;
        let halfSquareX = (innerWidth / this.dimention)/2;
        let halfSquareY = (innerHeight * 0.8 / this.dimention)/2;
        
        // let point = new PIXI.Point(halfSquare, (innerHeight * 0.8 / this.dimention)/2)
        // console.log(point);

        for(let i = 0; i < this.dimention; i++){
            for(let j = 0; j < this.dimention; j++){                            
                let point = new PIXI.Point(halfSquareX + (squareX * j), halfSquareY + (squareY * i))
                this.points.push(point);
            }
        }

        let circle = new PIXI.Graphics();

        this.points.forEach(point => {
            circle.lineStyle(0)
                  .beginFill(0xFFFFFF, 0.2)
                  .drawCircle(point.x, point.y, 3)
                  .endFill();
        });
        
        this.app.stage.addChild(circle);
        
    }

    //draws gridlines based on the dimentionality provided
    drawGridLines() {
        let gridLines = [];
        let line = new PIXI.Graphics();
        
        for (let i = 1; i < this.dimention; i++) {
            line.lineStyle(this.width, this.colour, 0.1)
                .moveTo((innerWidth * i) / this.dimention, 0)
                .lineTo((innerWidth * i) / this.dimention, innerHeight * 0.8)
                

            this.app.stage.addChild(line);
        }

        //add horizontal lines
        for (let i = 0; i < this.dimention; i++) {
            line.lineStyle(this.width, this.colour, 0.1)
                .moveTo(0, (innerHeight * 0.8 * i) / this.dimention)
                .lineTo(innerWidth, (innerHeight * 0.8 * i) / this.dimention);

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
            .drawRect(0, 0, innerWidth, innerHeight * 0.8);

        this.app.stage.addChild(perimeter);
    }
    
    getPointArray(){
        return this.points;
    }

    setPointsArray(newPoints){
        this.points = newPoints;
    }
}

//number of lines of a grid is 2(n-1) where n is the dimention of the grid
// for a 3 by 3 grid, n = 3
