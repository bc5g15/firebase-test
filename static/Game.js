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
    backgroundColor: 0x000000
});

//currently the dimention represents the grid dimention, this will be retrieved from the server in the actual final product
let dimention = 9;
var mouseposition = app.renderer.plugins.interaction.mouse.global;

//initializing variables to be used in the game
var gameState = testGameState();
let myShip;
// Allow for multiple ships
let ships = {};
var missileSpeed = 1;
var missileSpeedFactor = 4;
var costOfMovement = 0;
var treasureArray = [];

var testTreasureLocations = [[1,1],[2,2],[3,3],[4,4]];

//var start;  //timing stuff, check the missile controller

//initialize grid class to draw grid
var grid = new GridDrawer(app, dimention, 2, globalWidth, app.height);

//initializes ocean and fog of war classes
var ocean = null;
var fog = null;
var fogMask = new PIXI.Graphics();

//initializes variables regarding the player
id = 000;
score = 20000;
health = 1000;
missiles = [];
missileCount = 0;

var sizeGridSquareX;
var sizeGridSquareY;

let state = {};
let myid;

function updateFullGameState(newState)
{
    let tiles = newState.tiles;
    console.log(tiles);
    for(let x=0; x<tiles.length; x++) {
        let tile = tiles[x];
        console.log(tile);
        if(!(tile.type in ships))
        {
            ships[tile.type] = new NewShip(app, tile.type, [tile.col, tile.row]);
            ships[tile.type].initShip();
            if (tile.type === state.me) {
                console.log("Restting myself");
                myShip = ships[tile.type];
                createGreenSquare(myShip.sprite.position.x, myShip.sprite.position.y);
            }
        }
    }
}

function updateSingleShip(newState)
{
    let newShip = new NewShip(app, newState.type, [newState.col, newState.row]);
    ships[newState.type] = newShip;
    newShip.initShip();
    if (newState.type === state.me) {
        console.log("Resetting myself");
        myShip = newShip;
        createGreenSquare(myShip.sprite.position.x, myShip.sprite.position.y);
    }
}

function moveShip(newState)
{
    ships[newState.type].setPosition(newState.col, newState.row);
}

function initGame(gameKey, me, token, channelId, initialMessage)
{
    console.log("Insert the game creation code here!");
    state = {
        gameKey: gameKey,
        me: me,
        started: false
    }

    myid = me;

    let channel = null;

    let handlers = {};

    function onMessage(newState)
    {
        console.log("New Message");
        console.log(newState.token);

        if(newState.token in handlers)
        {
            handlers[newState.token](newState);
        } else {
            console.log("Unrecognised token: " + newState.token);
        }
        return;
    }

    function startGame() {
        console.log("Opening Game");
        console.log("Who am I?");
        console.log(state.me);
        handlers["open"] = (newState) => {
            if(!state.started) {
                state.started = true;

                //Add the new handlers
                handlers["move"] = moveShip;
                handlers["new_user"] = updateSingleShip;
                handlers["position"] = updateFullGameState;
                $.post("/game/join");

            }
        };
        init();
        $.post('/game/open');
    }

    function refreshUsers(newState)
    {
        let userStr = "";
        for(let x = 0; x<newState.users.length; x++)
        {
            userStr += newState.users[x].name + "<br>";
        }
        $("#users").html(userStr);
    }

    function onOpened() {
        console.log("Opening Lobby");
        handlers["add-user"] = joinLobby;
        handlers["new-user"] = refreshUsers;
        $.post('/game/lobby/open');
    }

    function joinLobby() {

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
    grid.calculatePoints();

    //creates ship
    // myShip = new Ship(app, [0, 0]);
    // Need to pass the positional parameters from
    // the initial state
    // Declare shipbuilding code in the listener
    // myShip = new NewShip(app, state.gameKey, [0,0]);
    // ships[state.gameKey] = myShip;
    // myShip.initShip();

    //calculate missile speed in utility function
    missileSpeed = calculateMissileSpeed(missileSpeedFactor);

    //create green square to start around the ship
    // createGreenSquare(myShip.sprite.position.x, myShip.sprite.position.y);

    //loads enemy ships from gamestate data
    // loadEnemies();

    //initialises button and other data to display
    initLowerConsole();
    // loadEnemies();

    //create fog of
    //fog = new FogOfWar(app);
    //fog.init();

    //renders the grid lines and the circles ontop of the fog
    grid.drawGrid();
    grid.drawCircles();
    // myShip.render();

    //load treasure based on array of coordinates;
    // loadTreasure(testTreasureLocations);

    //create squares
    createSquare(dimention);

    //create green square to start around the ship
    // createGreenSquare(myShip.sprite.position.x, myShip.sprite.position.y);

    //calculate missile speed in utility function
    missileSpeed = calculateMissileSpeed(missileSpeedFactor);

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
