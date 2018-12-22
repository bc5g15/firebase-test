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

let dimention = 7;
var mouseposition = app.renderer.plugins.interaction.mouse.global;
var ship;
var explodeSound;
var launchSound;

var grid = new GridDrawer(app, dimention, 2, window.innerWidth, window.innerHeight);

ocean = null;
gameState = "Remember to do gamestate stuff";

id = "Insert ID";
score = 0;
health = 1000;
missiles = [];
missileSpeed = 4;
missileCount = 0;

init();

function init() {

    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.autoResize = true;
    app.renderer.resize(window.innerWidth, window.innerHeight);
    app.stage.interactive = true;
    document.body.appendChild(app.view);

    grid = new GridDrawer(app, dimention, 2, window.innerWidth, window.innerHeight);

    loader.add("missileSprite", "../assets/Sprites/missile.png");

    keyboardInit();

    ocean = new Ocean(app);
    ocean.init();

    ship = PIXI.Sprite.fromImage("../assets/Sprites/ship.png");
    ship.scale.x = 0.25;
    ship.scale.y = 0.25;
    ship.anchor.set(0.5);
    ship.position.set(window.innerWidth / 2, (innerHeight * 0.8) / 2);

    app.stage.addChild(ship);
    app.ticker.add(delta => gameLoop(delta));

    //dealing with grids and squares;
    drawGrid();
    createSquare(dimention, grid.getPointArray());
    initLowerConsole();

    app.stage.on("mousedown", function(e) {

        if(!(mouseposition.y > window.innerHeight * 0.8)){      
            
            let pos = getPositionOfCurrentSquare();
            moveGreenSquare(getGridIndex(pos));
        }

    });

    explodeSound = new sound("../assets/Sounds/explode.mp3");
    launchSound = new sound("../assets/Sounds/launch.mp3");


}

function drawGrid() {
    grid.drawPerimeterLine();
    grid.drawGridLines();
    grid.calculatePoints();
}

//main game loop
function gameLoop(delta) {
    ocean.update(delta);
    updateMissiles(delta);
    updateSquare(mouseposition);
}
