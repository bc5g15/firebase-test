/*
The missile controller is used to maintain a store and track all the missiles the user has fired
This is where the shoot function is called when the fire button is pressed. Each missile has a sprite
to render the missile. It also contains the target which is the physical x and y coordinates for the
green square (remember the green square represents the current target location). The misisle object 
stores a targetCoord variable which is the coordinates of the target (ie [3,6] for example. This is 
mainly used for console logging and displaying data to the user). The target varable is an array of
the physical x and y coordinates that the missile is attempting to hit. Every frame, the updateMissile() 
function is called by the game loop. This updates the position of the missle. Each missile checks if 
it has hit its target. It calculates the distance of the missile to the current target using the 
physical x and y coordinates. If the distance is less than 20px, the missile has hit its target square
and is destroyed by calling the destroyMissile() function. Upon destruction, checks to see if an enemy
exist in the square it is destroyed in. The function checkEnemyHit() which is in the enemy tracker is 
called passing the target coordinates as an argument. 
*/

let frameCount = 0;

function shoot(rotation, startPosition) {

    //creates missile and stores it in the array of missiles.
    let target = getPositionOfGreenSquare();

    var missile = {
        sprite: new PIXI.Sprite.fromImage("static/assets/Sprites/missile.png"),
        targetCoord: indexToGridCoord(getGridIndex(target)), 
        target: [target[0], target[1]]
    };

    console.log("Missile Coord: " + missile.targetCoord)

    missile.sprite.position.x = startPosition.x;
    missile.sprite.position.y = startPosition.y;
    missile.sprite.rotation = rotation;
    missile.sprite.scale.x = 0.75;
    missile.sprite.scale.y = 0.75;
    missile.sprite.anchor.set(0.5);

    app.stage.addChild(missile.sprite);
    missiles.push(missile);

    //start = new Date().getTime();

    launchSound.play();
}

//run every tick, updates missile positions and checks for hits
function updateMissiles() {

    frameCount++;
    missileCount += 0.005;
    for (var len = missiles.length - 1; len >= 0; len--) {
        var m = missiles[len].sprite;
        m.position.x += Math.cos(m.rotation) * missileSpeed;
        m.position.y += Math.sin(m.rotation) * missileSpeed;
    }

    checkForHit();
}

//checks for hits by calculating the physcial distance to target. threshould variable is used
//to determine the distance required to determine a hit
function checkForHit() {

    let threshould = 20;

    for (let m = 0; m < missiles.length; m++) {
        let target = missiles[m].target;
        let position = missiles[m].sprite.position;

        let distToTarget = calculateDistance(
            [target[0], target[1]],
            [position.x, position.y]
        );

        if (distToTarget < threshould) {
            destroyMissile(m);
        }
    }
}

//checks if an enemy exists at destruction location. Removes missile from missile array and stage
function destroyMissile(missile) {

    checkEnemyHit(missiles[missile].targetCoord);
    app.stage.removeChild(missiles[missile].sprite);    
    missiles.splice(missile, 1);
    explodeSound.play();
}
