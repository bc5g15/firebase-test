let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Texture = PIXI.Texture;

const log = console.log;

app = new PIXI.Application({
    width: 800, // default: 800
    height: 600, // default: 600
    antialias: true, // default: false
    transparent: false, // default: false
    resolution: 1, // default: 1
    backgroundColor: 0x00ffff
});

let dimention = 9;
var mouseposition = app.renderer.plugins.interaction.mouse.global;

var myShip;
var enemyShips = [];

var costOfMovement = 0;

var grid = new GridDrawer(
    app,
    dimention,
    2,
    window.innerWidth,
    window.innerHeight
);

ocean = null;
gameState = "Remember to do gamestate stuff";

id = "Insert ID";
score = 1000;
health = 1000;
missiles = [];
missileSpeed = sizeGridSquareX;
missileCount = 0;

var sizeGridSquareX = innerWidth / this.dimention;
var sizeGridSquareY = (innerHeight * 0.8) / this.dimention;

init();

function init() {
    //setting up the view to render to
    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.autoResize = true;
    app.renderer.resize(window.innerWidth, window.innerHeight);
    app.stage.interactive = true;
    document.body.appendChild(app.view);

    //caching sprite and loading sounds
    loader.add("missileSprite", "../assets/Sprites/missile.png");
    explodeSound = new sound("../assets/Sounds/explode.mp3");
    launchSound = new sound("../assets/Sounds/launch.mp3");

    //initialse keyboard input
    keyboardInit();

    //visuals
    ocean = new Ocean(app);
    ocean.init();

    ///dealing with grids and squares;
    grid = new GridDrawer(
        app,
        dimention,
        2,
        window.innerWidth,
        window.innerHeight
    );
    grid.drawGrid();

    initLowerConsole();

    //create squares
    createSquare(dimention, grid.getPointArray());

    //creates ship
    myShip = new Ship(app, 1, [4, 4]);
    myShip.initShip();

    createGreenSquare(myShip.sprite.position.x, myShip.sprite.position.y);
    //adds gameLoop function to update with the PIXI.js ticker (set to 60 fps)
    app.ticker.add(delta => gameLoop(delta));
}

//main game loop
function gameLoop(delta) {
    ocean.update(delta);
    updateMissiles(delta);
    updateSquare(mouseposition);
}
