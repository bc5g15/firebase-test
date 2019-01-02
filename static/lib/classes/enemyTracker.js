/**
This keeps track of all the enemies, both active and destroyed for the current game. For the final game
the arrays will be sent with each update from the server.
*/

//var enemyShips = [];
var destroyedShips = [];
var destroyedTexture = PIXI.Texture.fromImage("static/assets/Sprites/shipDestroyed.png");

function loadEnemies(){

    //enemy has form of [id, [x, y]] where [x, y] is the index of the gamestate array
    //enemy ships have constructor Enemy(app, id, position)
    gameState.forEach(ship => {
        iteratedshipindex = gameState.indexOf(ship)
        gameState.forEach(othership => {
            if(!(gameState.indexOf(othership) === iteratedshipindex)){
                ship.enemyShips.push(othership); //For each player ship in the game, all of the other player ships
                //are added to the ship's enemyShips array to indicate how many enemies there are to destroy
            }
        })
        //enemy = new Enemy(app, ship[0], ship[1]);
    });

    //initialises an enemy class for each enemy. Not working with NPC enemies at the moment
    //enemyShips.forEach(enemy => {
        //enemy.initEnemy();
    //});
}

//if there exists an enemy ship at the provided coordinates, the enemy is destroyed.
function checkEnemyHit(coord){
    
    //This currently is quite buggy for some reason, ie not detecting hits and not fully removing sprites
    //Uncomment block to test hit detection.
    gameState.forEach(ship => {
        if(ship.coordinates[0] === coord[0] && ship.coordinates[1] === coord[1] && ship.hitpoints > 0){
            console.log("Target Hit!");
            if(ship.hitpoints === 1){
                ship.hitpoints = 0;
                ship.sprite.texture = destroyedTexture;
                ship.sprite.alpha = 0.65;
                destroyedShips.push(ship);

            }else{
                ship.hitpoints = ship.hitpoints - 1;
            }
            $.post('/game/hit');
        }else{
            ship.enemyShips.forEach(enemy => {
                if(enemy.coordinates[0] === coord[0] && enemy.coordinates[1] === coord[1] && enemy.hitpoints > 0) {
                    ship.enemyShips.splice(ship.enemyShips.indexOf(enemy), 1);
                }
            })
        }
    });
    console.log("Length of destroyed ships: " + destroyedShips.length);
}

//destroys the ship and slowly makes it "sink into the waves"
//once the ship is invisible, the ship sprite is removed.
function updateDestroyedShips(){

    destroyedShips.forEach(ship => {
        //console.log(enemy);
        ship.sprite.alpha -= 0.005;

        if(ship.sprite.alpha < 0){
            app.stage.removeChild(ship.sprite);
        } 
    });
}

//FIX BUG WITH DESTROYING ENEMIES AND THEIR FADING 