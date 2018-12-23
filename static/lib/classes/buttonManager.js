var button;
var buttonDown;

function initButtons() {

    textureButton = new PIXI.Texture.fromImage(
        "static/assets/Sprites/buttonFire.png"
    );
    textureButtonDown = new PIXI.Texture.fromImage(
        "static/assets/Sprites/buttonFirePressed.png"
    );

    button = new PIXI.Sprite(textureButton);
    button.buttonMode = true;
    button.interactive = true;
    button.anchor.set(0.5);
    button.x = globalWidth * 0.75;
    button.y = globalHeight * 0.9;
    button.on("pointerdown", buttonPressed);
    button.on("pointerup", buttonReleased);

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
