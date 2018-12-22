var enemyShips = [];
var destroyedShips = [];
var destroyedTexture = PIXI.Texture.fromImage("../assets/Sprites/shipDestroyed.png");

function loadEnemies(){

    //enemy has form of [id, [x, y]] where [x, y] is the index of the gamestate array
    //enemy ships have constructor Enemy(app, id, position)
    gameState.forEach(ship => {
        enemy = new Enemy(app, ship[0], ship[1]);
        enemyShips.push(enemy);
    });

    enemyShips.forEach(enemy => {
        enemy.initEnemy();
    });
}

function checkEnemyHit(coord){

    // enemyShips.forEach(enemy => {

            //console.log((enemyShips[i].coordinates[0] === coord[0]) && (enemyShips[i].coordinates[1] === coord[1]));
        
    //     // if(enemy.coordinates[0] === coord[0] && enemy.coordinates[1] === coord[1]){
    //     //     console.log("Target Hit!");
    //     //     enemy.sprite.texture = destroyedTexture;
    //     //     destroyedShips.push(enemy);
    //     //     enemyShips.pop(enemy);
    //     // }
    // });

    for(let i = 0; i < enemyShips.length; i++){

        console.log("X: " + enemyShips[i].coordinates[0]);
        console.log("Y: " + enemyShips[i].coordinates[1]);

        console.log("X COORD: " + coord[0]);
        console.log("Y COORD: " + coord[1]);
        
    }

    console.log("Length of enemyShips: " + enemyShips.length);
}

function updateDestroyedShips(){

    destroyedShips.forEach(enemy => {

        enemy.sprite.alpha -= 0.005;

        if(enemy.sprite.alpha < 0){
            app.stage.removeChild(enemy.sprite);
            destroyedShips.pop(enemy);            
        } 
    });
    //console.log("Number of destroyed ships: " + destroyedShips.length);
}