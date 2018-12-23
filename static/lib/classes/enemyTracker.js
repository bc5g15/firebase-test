/**
This keeps track of all the enemies, both active and destroyed for the current game. For the final game
the arrays will be sent with each update from the server.
*/

var enemyShips = [];
var destroyedShips = [];
var destroyedTexture = PIXI.Texture.fromImage("/assets/Sprites/shipDestroyed.png");

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

    /*
    enemyShips.forEach(enemy => {

        console.log((enemyShips[i].coordinates[0] === coord[0]) && (enemyShips[i].coordinates[1] === coord[1]));
        
        if(enemy.coordinates[0] === coord[0] && enemy.coordinates[1] === coord[1]){
            console.log("Target Hit!");
            enemy.sprite.texture = destroyedTexture;
            destroyedShips.push(enemy);
            enemyShips.pop(enemy);
        }
    });
    */




    // for(let i = 0; i < enemyShips.length; i++){

    //     console.log("X: " + enemyShips[i].coordinates[0]);
    //     console.log("Y: " + enemyShips[i].coordinates[1]);

    //     console.log("X COORD: " + coord[0]);
    //     console.log("Y COORD: " + coord[1]);
        
    // }

    // console.log("Length of enemyShips: " + enemyShips.length);
}

//destroys the ship and slowly makes it "sink into the waves"
//once the ship is invisible, the ship sprite is removed.
function updateDestroyedShips(){

    destroyedShips.forEach(enemy => {

        enemy.sprite.alpha -= 0.005;

        if(enemy.sprite.alpha < 0){
            app.stage.removeChild(enemy.sprite);          
        } 
    });
    //console.log("Number of destroyed ships: " + destroyedShips.length);
}