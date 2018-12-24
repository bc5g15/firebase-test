/*
This class is the entry point for the enmtire game and sets up the neccessary pixi.js app boiler plate stuff
as well as the neccessary classes and functions for the remainder of the game.
*/

let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Texture = PIXI.Texture;

//variables to set size of game view
var globalWidth = 800;
var globalHeight = 960;

//initialize new pixi application
var app = new PIXI.Application({
    width: globalWidth, // default: 800
    height: globalHeight, // default: 600
    antialias: true, // default: false
    transparent: false, // default: false
    resolution: 1, // default: 1
    backgroundColor: 0x00ffff
});

//currently the dimention represents the grid dimention, this will be retrieved from the server in the actual final product
let dimention = 9;
var mouseposition = app.renderer.plugins.interaction.mouse.global;

//initializing variables to be used in the game
var gameState = testGameState();
var myShip;
var missileSpeed = 1;
var missileSpeedFactor = 4;
var costOfMovement = 0;

//var start;  //timing stuff, check the missile controller

//initialize grid class to draw grid
var grid = new GridDrawer(app, dimention, 2, globalWidth, app.height);

//initializes ocean class
var ocean = null;

//initializes variables regarding the player
id = 000;
score = 20000;
health = 1000;
missiles = [];
missileCount = 0;

var sizeGridSquareX;
var sizeGridSquareY;

let state = {}

function initGame(gameKey, me, token, channelId, initialMessage)
{
    console.log("Insert the game creation code here!");
    state = {
        gameKey: gameKey,
        me: me
    }

    let channel = null;

    function onMessage(newState)
    {
        console.log("New Message");
        if (newState.token === "open")
        {
            init()
        }
        else if(newState.token === "move")
        {
            console.log("Got Move Response");
            console.log(newState);
            console.log(newState.tiles);
            console.log(newState.tiles[0]);
            let tile = newState.tiles[0];
            console.log(tile.row);
            console.log(tile.col);
            myShip.setPosition(tile.col, tile.row)

        }
    }

    function onOpened() {
        console.log("Opening Game");
        $.post('/game/open');
    }

    function openChannel() {
        // [START auth_login]
        // sign into Firebase with the token passed from the server
        firebase.auth().signInWithCustomToken(token).catch(
            function(error){
                console.log('Login Failed: ', error.code);
                console.log('Error message: ', error.message);
            });
        // [END auth_login]
        console.log("Logged in")
        // [START add_listener]
        channel = firebase.database().ref('channels/' + channelId);
        // add a listener to the path that fires any time the
        // value of the data changes
        channel.on('value', function(data) {
            // console.log("Something happened!");
            // console.log(data.val());
            onMessage(data.val());
        });
        // [END add_listener]
        onOpened();
    }

    function initialize() {
        // Always include the gamekey in our requests
        $.ajaxPrefilter(function(opts) {
          if (opts.url.indexOf('?') > 0)
            opts.url += '&g=' + state.gameKey;
          else
            opts.url += '?g=' + state.gameKey;
        });

        openChannel();

        onMessage(initialMessage)
    }

    setTimeout(initialize, 100);
}

//initializes the game
// init();

/*
This init function starts by setting some stuff for pixi.js, boilerplate stuff
and adding the game to the document. It loads sounds and caches missile assets
and initializes the keyboard listeners, grid , ocean, lower console, ship, enemies
and a few other things. Lastly, the app.ticker adds specific functions into pixi's
inbuilt ticker. This is set to 60fps. The gameLoop() function is added to the ticker
so that the gameLoop function is run 60 times per second.
*/

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
    loader.add("missileSprite", "static/assets/Sprites/missile.png");
    explodeSound = new sound("static/assets/Sounds/explode.mp3");
    launchSound = new sound("static/assets/Sounds/launch.mp3");

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
    // myShip = new Ship(app, [0, 0]);
    myShip = new NewShip(app, state.gameKey, [0,0]);
    myShip.initShip();

    //calculate missile speed in utility function
    missileSpeed = calculateMissileSpeed(missileSpeedFactor);

    //create green square to start around the ship
    createGreenSquare(myShip.sprite.position.x, myShip.sprite.position.y);

    //loads enemy ships from gamestate data
    // loadEnemies();

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
