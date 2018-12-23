let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Texture = PIXI.Texture;

var globalWidth = 800;
var globalHeight = 960;

var app = new PIXI.Application({
    width: globalWidth, // default: 800
    height: globalHeight, // default: 600
    antialias: true, // default: false
    transparent: false, // default: false
    resolution: 1, // default: 1
    backgroundColor: 0x00ffff
});

let dimention = 9;
var mouseposition = app.renderer.plugins.interaction.mouse.global;

var gameState = testGameState();
var myShip;
var missileSpeed = 1;
var missileSpeedFactor = 4;
var costOfMovement = 0;

//var start;  //timing stuff, check the missile controller

var grid = new GridDrawer(app, dimention, 2, globalWidth, app.height);

var ocean = null;


id = 000;
score = 20000;
health = 1000;
missiles = [];
missileCount = 0;

var sizeGridSquareX;
var sizeGridSquareY;

init();

function init() {
    //setting up the view to render to
    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.autoResize = true;
    //app.renderer.resize(window.innerWidth, window.innerHeight);
    app.stage.interactive = true;
    document.body.appendChild(app.view);


    sizeGridSquareX = globalWidth / dimention;
    sizeGridSquareY = (globalHeight * 0.8) / dimention;

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
    grid = new GridDrawer(app, dimention, 2, globalWidth, globalHeight);
    grid.drawGrid();

    //initialises button and other data to display
    initLowerConsole();

    //create squares
    createSquare(dimention, grid.getPointArray());

    //creates ship
    myShip = new Ship(app, [0, 0]);
    myShip.initShip();

    //calculate missile speed in utility function
    missileSpeed = calculateMissileSpeed(missileSpeedFactor);

    //create green square to start around the ship
    createGreenSquare(myShip.sprite.position.x, myShip.sprite.position.y);

    //loads enemy ships from gamestate data
    loadEnemies();

    //adds gameLoop function to update with the PIXI.js ticker (set to 60 fps)
    app.ticker.add(delta => gameLoop(delta));

}

//main game loop
function gameLoop(delta) {
    ocean.update(delta);
    updateMissiles(delta);
    updateSquare(mouseposition);
    updateDestroyedShips();
}
