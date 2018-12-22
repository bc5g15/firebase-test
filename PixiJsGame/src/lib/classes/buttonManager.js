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
    let dist = calculateDistance([myShip.positionExact[0], myShip.positionExact[1]], pos)

    if(canAfford(dist)){

        shoot(rotateTo(pos[0], pos[1], myShip.positionExact[0], myShip.positionExact[1]), {
            x: myShip.positionExact[0],
            y: myShip.positionExact[1]
        });       

        console.log("Score after Shot: " + score + ", Distance: " + dist);

    } else {        
        
        console.log("Not enough points to perform action!");
    }     
}

function buttonReleased(){
    button.texture = textureButton;
}