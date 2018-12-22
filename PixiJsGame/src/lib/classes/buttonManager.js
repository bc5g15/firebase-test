var button;
var buttonDown;

function initButtons(){

    textureButton = new PIXI.Texture.fromImage('../assets/Sprites/buttonFire.png');
    textureButtonDown = new PIXI.Texture.fromImage('../assets/Sprites/buttonFirePressed.png');

    button = new PIXI.Sprite(textureButton);
    button.buttonMode = true;
    button.interactive = true;    
    button.anchor.set(0.5);
    button.x = window.innerWidth * 0.75;
    button.y = window.innerHeight * 0.9;
    button.on('pointerdown', buttonPressed);
    button.on('pointerup', buttonReleased);

    app.stage.addChild(button);
    console.log("Button added");
}

function buttonPressed(){

    button.texture = textureButtonDown;
    let pos = getPositionOfGreenSquare();
    shoot(rotateTo(pos[0], pos[1], ship.x, ship.y), {
        x: window.innerWidth / 2,
        y: (window.innerHeight * 0.8) / 2
    });      
}

function buttonReleased(){
    button.texture = textureButton;
}