var moveEnum = {

    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};

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

function keyboardInit(){

    let left = keyboard("ArrowLeft"),
        up = keyboard("ArrowUp"),
        right = keyboard("ArrowRight"),
        down = keyboard("ArrowDown");

    left.press = () => {
        ship.rotation -= Math.PI/2;
    };

    right.press = () => {
        ship.rotation += Math.PI/2
    };

    up.press = () => {
        console.log("up pressed");
        let pos = getPositionOfGreenSquare();
        shoot(rotateTo(pos[0], pos[1], ship.x, ship.y), {
            x: window.innerWidth / 2,
            y: (window.innerHeight * 0.8) / 2
        });  
    };

    down.press = () => {
        console.log("down pressed");
    };
}

//taken from https://github.com/kittykatattack/learningPixi#keyboard
//can change later
