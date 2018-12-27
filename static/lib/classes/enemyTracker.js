/**
This keeps track of all the enemies, both active and destroyed for the current game. For the final game
the arrays will be sent with each update from the server.
*/

var enemyShips = [];
var destroyedShips = [];
var destroyedTexture = PIXI.Texture.fromImage("static/assets/Sprites/shipDestroyed.png");

function loadEnemies(){

    //enemy has form of [id, [x, y]] where [x, y] is the index of the gamestate array
    //enemy ships have constructor Enemy(app, id, position)
    gameState.forEach(ship => {
        enemy = new Enemy(app, ship[0], ship[1]);
        enemyShips.push(enemy);
    });

    //initialises an enemy class for each enemy.
    enemyShips.forEach(enemy => {
        enemy.initEnemy();
    });
}

//if there exists an enemy ship at the provided coordinates, the enemy is destroyed.
function checkEnemyHit(coord){
    
    //This currently is quite buggy for some reason, ie not detecting hits and not fully removing sprites
    //Uncomment block to test hit detection.
    enemyShips.forEach(enemy => {  

        if(enemy.coordinates[0] === coord[0] && enemy.coordinates[1] === coord[1]){

            console.log("Target Hit!");
            enemy.sprite.texture = destroyedTexture;
            enemy.sprite.alpha = 0.65;
            destroyedShips.push(enemy);
            enemyShips.splice(enemyShips.indexOf(enemy), 1);
        }       
    });
    console.log("Length of destroyed ships: " + destroyedShips.length);
}

//destroys the ship and slowly makes it "sink into the waves"
//once the ship is invisible, the ship sprite is removed.
function updateDestroyedShips(){

    destroyedShips.forEach(enemy => {
        //console.log(enemy);
        enemy.sprite.alpha -= 0.005;

        if(enemy.sprite.alpha < 0){
            app.stage.removeChild(enemy.sprite);          
        } 
    });
}

//FIX BUG WITH DESTROYING ENEMIES AND THEIR FADING 