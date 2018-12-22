let frameCount = 0;

function shoot(rotation, startPosition) {
    let target = getPositionOfGreenSquare();

    var missile = {
        sprite: new PIXI.Sprite.fromImage("../assets/Sprites/missile.png"),

        target: [target[0], target[1]]
    };

    missile.sprite.position.x = startPosition.x;
    missile.sprite.position.y = startPosition.y;
    missile.sprite.rotation = rotation;
    missile.sprite.scale.x = 0.75;
    missile.sprite.scale.y = 0.75;
    missile.sprite.anchor.set(0.5);

    app.stage.addChild(missile.sprite);
    missiles.push(missile);

    launchSound.play();
}

function updateMissiles() {
    frameCount++;
    missileCount += 0.005;
    for (var len = missiles.length - 1; len >= 0; len--) {
        var m = missiles[len].sprite;
        m.position.x += Math.cos(m.rotation) * missileSpeed;
        m.position.y += Math.sin(m.rotation) * missileSpeed;
        //m.scale.x = 0.66 + Math.sin(missileCount)/2;
        //m.scale.y = 0.66 + Math.sin(missileCount)/2;
    }

    //only check for hits every 1/10th frame
    if (frameCount > 3) {
        frameCount = 0;
        checkForHit();
    }
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
            destroyMissile(m, distToTarget);
        }
    }
}

function destroyMissile(missile, dist) {

    // let location = [
    //     missiles[missile].sprite.position.x,
    //     missiles[missile].sprite.position.y
    // ];

    app.stage.removeChild(missiles[missile].sprite);
    missiles.splice(missile, 1);
    console.log("Target Destroyed! Distance to target: " + dist);
    explodeSound.play();
}
