/*
This class creates the white grid lines and stores an array of points that represent the
physical centres of each grid square. This class will be used to get positions for ships
and projectiles for the game. The array of points is comparable to the gamestate that we
store for each game (position of ships in the game). THe gamestate and the array of
points will be used to calculate the visuals and the positions of the ships.
*/

class GridDrawer {

    constructor(app, dimention, lineWidth) {

        this.dimention = dimention;
        this.width = lineWidth;
        this.app = app;
        this.colour = 0xffffff;

        this.points = [];   //this is the array of points that represents the centre of all squares in the grid
    }

    fill(){

        //draws the grid in its entirity
        this.drawGridLines();
        this.drawPerimeterLine();
        //this.calculatePoints();
    }

    calculatePoints() {

        //function to calculate the physical center points for each square in the grid
        let squareX = globalWidth / this.dimention;
        let squareY = globalHeight * 0.8 / this.dimention;
        let halfSquareX = (globalWidth / this.dimention)/2;
        let halfSquareY = (globalHeight * 0.8 / this.dimention)/2;
        
        for(let i = 0; i < this.dimention; i++){
            for(let j = 0; j < this.dimention; j++){                            
                let point = new PIXI.Point(halfSquareX + (squareX * j), halfSquareY + (squareY * i))
                pointArray.push(point);
            }
        }
    }

    drawCircles(){

        //creates small circles at each point
        let circle = new PIXI.Graphics();

        pointArray.forEach(point => {
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
                .moveTo((globalWidth * i) / this.dimention, 0)
                .lineTo((globalWidth * i) / this.dimention, globalHeight * 0.8)
                

            this.app.stage.addChild(line);
        }

        //add horizontal lines
        for (let i = 0; i < this.dimention; i++) {
            line.lineStyle(this.width, this.colour, 0.1)
                .moveTo(0, (globalHeight * 0.8 * i) / this.dimention)
                .lineTo(globalWidth, (globalHeight * 0.8 * i) / this.dimention);

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
            .drawRect(0, 0, globalWidth, globalHeight * 0.8);

        this.app.stage.addChild(perimeter);
    }
    
    getPointArray(){
        return this.points;
    }

    setPointsArray(newPoints){
        this.points = newPoints;
    }

    drawGrid() {
        this.drawPerimeterLine();
        this.drawGridLines();
        this.calculatePoints();
    }
}

//number of lines of a grid is 2(n-1) where n is the dimention of the grid
// for a 3 by 3 grid, n = 3
