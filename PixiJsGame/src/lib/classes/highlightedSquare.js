var pointArray = [];
let oldIndex = 0;

let position = null;
let sizeX;
let sizeY;

//use these to calculate physics positioning of square
let squareX;
let squareY;

var squareSprite;
var squareSpriteGreen;
var indexClosest = 0;

function createSquare(dimention, array) {

    sizeX = (window.innerWidth / dimention) * 0.92;
    sizeY = ((window.innerHeight * 0.8) / dimention) * 0.9;

    pointArray = array;
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

function createGreenSquare(x, y){

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

    //return a physical point and set it as the position.
    let index = Math.ceil(Math.pow(dimention, 2) / 2) - 1;
    let x = pointArray[index].x;
    let y = pointArray[index].y;

    position = [x, y];
}

//moves square to a specific grid square using the index of a point in the pointArray
function moveSquare(index) {

    position = [pointArray[index].x, pointArray[index].y]
    squareSprite.position.set(position[0], position[1]);
}

function moveGreenSquare(index) {

    position = [pointArray[index].x, pointArray[index].y]
    squareSpriteGreen.position.set(position[0], position[1]);
}

function updateSquare(mouseposition){

    let x = mouseposition.x;
    let y = mouseposition.y;

    let minDist = Number.MAX_SAFE_INTEGER;
    indexClosest = -1;

    if(!(y > window.innerHeight * 0.8)){
        for(let i = 0; i < pointArray.length; i++){
            let dist = Math.sqrt(Math.pow(x - pointArray[i].x, 2) + Math.pow(y - pointArray[i].y, 2));
            if(dist < minDist){
                minDist = dist;
                indexClosest = i;            
            }
        }

        moveSquare(indexClosest);
    }
}

function getPositionOfCurrentSquare(){

    let x = pointArray[indexClosest].x;
    let y = pointArray[indexClosest].y;    
    return [x, y]
}

function getPositionOfGreenSquare(){

    let x = squareSpriteGreen.position.x
    let y = squareSpriteGreen.position.y;    
    return [x, y]
}

function getGridIndex(point){

    let x = point[0];
    let y = point[1];

    let minDist = Number.MAX_SAFE_INTEGER;
    indexClosest = -1;

    for(let i = 0; i < pointArray.length; i++){
        let dist = Math.sqrt(Math.pow(x - pointArray[i].x, 2) + Math.pow(y - pointArray[i].y, 2));
        if(dist < minDist){
            minDist = dist;
            indexClosest = i;            
        }
    }

    return indexClosest;
}

