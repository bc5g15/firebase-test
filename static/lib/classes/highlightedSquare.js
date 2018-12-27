/*
A short statement regarding how the game calculates physical positions and coordinates.
The points array in this class is used globally. This array simply stores the physical 
coordinate eg (x = 123.333, y = 656.888) for the centre of each grid square. These 
physical coordinate values are used to position sprites, determine targets for missiles 
etc. However as passing exact points around is messy, the game predominantly positions 
enemies, ships and missile targets based on the INDEX OF A SPECIFIC POINT. For example, 
a grid of 9 * 9 has 81 squares, so the index of the last square is 80. Regarding this, a
ship is positioned at a specific index, and then renders the sprite in the location based
upon the values at that index in the point array. Eg pointArray[80].x and pointArray[80].y 
gives the physical x and y coordinates to render a ship sprite. In other cases it is useful
to know the equivlent coordinate value of the index or position. In short, the game uses the
index of targets to make the game more managable.
*/

var pointArray = [];
let oldIndex = 0;

let position = null;
let sizeX;
let sizeY;

//use these to calculate physics positioning of square
let squareX;
let squareY;

//variables for the red and green square sprites.
var squareSprite;
var squareSpriteGreen;

//important variable, stores the current closest square (represented by an index in the pointArray)
var indexClosest = 0;

//creates the red square texture and sprite
function createSquare(dimention) {
    sizeX = (globalWidth / dimention) * 0.92;
    sizeY = ((globalHeight * 0.8) / dimention) * 0.9;

    calcStartPos();

    let square = new PIXI.Graphics();
    square.beginFill(0xff0000, 0.4);
    square.drawRect(0, 0, sizeX, sizeY);
    square.endFill();

    let squareTexture = square.generateCanvasTexture();
    squareSprite = new PIXI.Sprite(squareTexture);
    squareSprite.anchor.set(0.5);
    squareSprite.position.set(position[0], position[1]);

    app.stage.addChild(squareSprite);
}

//creates the green square texture and sprite
function createGreenSquare(x, y) {
    let squareGreen = new PIXI.Graphics();
    squareGreen.beginFill(0x00ff00, 0.3);
    squareGreen.drawRect(0, 0, sizeX, sizeY);
    squareGreen.endFill();

    let squareTextureGreen = squareGreen.generateCanvasTexture();
    squareSpriteGreen = new PIXI.Sprite(squareTextureGreen);
    squareSpriteGreen.anchor.set(0.5);
    squareSpriteGreen.position.set(x, y);

    app.stage.addChild(squareSpriteGreen);
}

//calculates starting position for red square
function calcStartPos() {
    
    let index = Math.ceil(Math.pow(dimention, 2) / 2) - 1;
    let x = pointArray[index].x;
    let y = pointArray[index].y;

    //return a physical point and set it as the position.
    position = [x, y];
}

//moves red square to a specific grid square using the index of a point in the pointArray
function moveSquare(index) {

    position = [pointArray[index].x, pointArray[index].y];
    squareSprite.position.set(position[0], position[1]);
}

//moves green square to a specific grid square using the index of a point in the pointArray
//as this square represents the current "target" square for missiles, it logs the target coordinate
function moveGreenSquare(index) {

    position = [pointArray[index].x, pointArray[index].y];
    squareSpriteGreen.position.set(position[0], position[1]);
    console.log("Current Target: " + indexToGridCoord(index));
}

//calculates the square that the intex of the mouse is closest to. This is used to move the red
//square across the grid.
function updateSquare(mouseposition) {
    let x = mouseposition.x;
    let y = mouseposition.y;

    let minDist = Number.MAX_SAFE_INTEGER;
    indexClosest = -1;

    if (!(y > globalHeight * 0.8 || x > globalWidth)) {
        for (let i = 0; i < pointArray.length; i++) {
            let dist = Math.sqrt(
                Math.pow(x - pointArray[i].x, 2) +
                    Math.pow(y - pointArray[i].y, 2)
            );
            if (dist < minDist) {
                minDist = dist;
                indexClosest = i;
            }
        }
        moveSquare(indexClosest);
    }
}

//returns the physical position of the red square
function getPositionOfCurrentSquare() {
    let x = pointArray[indexClosest].x;
    let y = pointArray[indexClosest].y;
    return [x, y];
}

//returns the physical position of the green square
function getPositionOfGreenSquare() {
    let x = squareSpriteGreen.position.x;
    let y = squareSpriteGreen.position.y;
    return [x, y];
}

//returns the closest grid square (in the form of an index to be used with the pointArray[]) to the point argument
//this function is probably best put in the utilities script file.
function getGridIndex(point) {
    let x = point[0];
    let y = point[1];

    let minDist = Number.MAX_SAFE_INTEGER;
    indexClosest = -1;

    for (let i = 0; i < pointArray.length; i++) {
        let dist = Math.sqrt(
            Math.pow(x - pointArray[i].x, 2) + Math.pow(y - pointArray[i].y, 2)
        );
        if (dist < minDist) {
            minDist = dist;
            indexClosest = i;
        }
    }

    return indexClosest;
}
