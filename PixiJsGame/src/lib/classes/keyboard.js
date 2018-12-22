function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    //The `downHandler`
    key.downHandler = event => {
        if (event.key === key.value) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
            event.preventDefault();
        }
    };

    //The `upHandler`
    key.upHandler = event => {
        if (event.key === key.value) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
            event.preventDefault();
        }
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener("keydown", downListener, false);
    window.addEventListener("keyup", upListener, false);

    // Detach event listeners
    key.unsubscribe = () => {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
    };

    return key;
}

function keyboardInit() {
    let left = keyboard("ArrowLeft"),
        up = keyboard("ArrowUp"),
        right = keyboard("ArrowRight"),
        down = keyboard("ArrowDown");

    left.press = () => {
        myShip.sprite.rotation = -Math.PI / 2;
        if (canAfford(costOfMovement)) {
            myShip.moveLeft();
        } else {
            console.log("Cannot afford to move");
        }

    };

    right.press = () => {
        myShip.sprite.rotation = Math.PI / 2;
        if (canAfford(costOfMovement)) {
            myShip.moveRight();
        } else {
            console.log("Cannot afford to move");
        }
    };

    up.press = () => {
        myShip.sprite.rotation = 0;
        if (canAfford(costOfMovement)) {
            myShip.moveUp();
        } else {
            console.log("Cannot afford to move");
        }
    };

    down.press = () => {
        myShip.sprite.rotation = Math.PI;
        if (canAfford(costOfMovement)) {
            myShip.moveDown();
        } else {
            console.log("Cannot afford to move");
        }
    };

    app.stage.on("mousedown", function(e) {
        if (!(mouseposition.y > window.innerHeight * 0.8)) {
            let pos = getPositionOfCurrentSquare();
            moveGreenSquare(getGridIndex(pos));
        }
    });
}

//taken from https://github.com/kittykatattack/learningPixi#keyboard
//can change later
