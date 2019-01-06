/*
The button manager adds the "fire button to the game and runs the "shoot" function
to fire a missile from the players position to the target position.
*/

var button;
var buttonDown;

function initButtons() {

    //texture loading
    textureButton = new PIXI.Texture.fromImage(
        "static/assets/Sprites/buttonFire.png"
    );
    textureButtonDown = new PIXI.Texture.fromImage(
        "static/assets/Sprites/buttonFirePressed.png"
    );

    //creating button and changing settings
    button = new PIXI.Sprite(textureButton);
    button.buttonMode = true;
    button.interactive = true;
    button.anchor.set(0.5);
    button.x = globalWidth * 0.75;
    button.y = globalHeight * 0.9;
    button.on("pointerdown", buttonPressed);
    button.on("pointerup", buttonReleased);

    //adding button to the game container.
    app.stage.addChild(button);
}

function buttonPressed() {
    button.texture = textureButtonDown;

    let pos = getPositionOfGreenSquare();
   // let coords = getGridIndex(pos);
    let dist = calculateDistance(
        [myShip.positionExact[0], myShip.positionExact[1]],
        pos
    );

    //determines if the player can afford to shoot based on targets distance
    if (canAfford(dist)) {
        shoot(
            rotateTo(
                pos[0],
                pos[1],
                myShip.positionExact[0],
                myShip.positionExact[1]
            ),
            {
                x: myShip.positionExact[0],
                y: myShip.positionExact[1]
            }
        );

        console.log("Score after Shot: " + score + ", Distance: " + dist);
    } else {
        console.log("Not enough points to perform action!");
    }
}

function buttonReleased() {
    button.texture = textureButton;
}
