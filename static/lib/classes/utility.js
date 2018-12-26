//group of functions used by all "classes" used to make code a bit tidier and reduce
//code duplication.

function rotateTo(dx, dy, px, py) {
    var dist_Y = dy - py;
    var dist_X = dx - px;
    var angle = Math.atan2(dist_Y, dist_X);
    return angle;
}

function calculateDistance(point1, point2){

    return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2));
}

function canAfford(cost){
    
    let temp = score - cost;

    if(!(temp < 0)){
        score -= cost;
        return true;
    } else {
        return false;
    }    
}

//calculates the speed missiles should travel with. This needs to be improved so that
//it calculates the correct speed for missiles regardless of screen size and aspect 
//ratio
function calculateMissileSpeed(factor){

    let missileSpeedX = sizeGridSquareX / dimention;
    let missileSpeedY = sizeGridSquareY / dimention;

    return missileSpeedX/missileSpeedY * factor;
}

//returns the grid coordinate for a specific index for an array of a given dimentionality.
function indexToGridCoord(index){
    return [index % dimention,Math.floor(index / dimention)];
}