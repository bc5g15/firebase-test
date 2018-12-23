let frameCount = 0;

function shoot(rotation, startPosition) {

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

function checkForHit() {

    for (let m = 0; m < missiles.length; m++) {
        let target = missiles[m].target;
        let position = missiles[m].sprite.position;

        let distToTarget = calculateDistance(
            [target[0], target[1]],
            [position.x, position.y]
        );

        if (distToTarget < 20) {
            destroyMissile(m);
        }
    }
}

function destroyMissile(missile) {

    checkEnemyHit(missiles[missile].targetCoord);
    app.stage.removeChild(missiles[missile].sprite);    
    missiles.splice(missile, 1);
    explodeSound.play();
}
