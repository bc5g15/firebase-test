function loadTreasure(treasureLocations){
    //treasureLocations is an array of coordinates for the treasures
    treasureLocations.forEach(location => {
        let coord = [location[0], location[1]];
        console.log("Treasure Coordinate: " + coord);
        treasure = new Treasure(app, coord);
        treasureArray.push(treasure)
    });

    treasureArray.forEach(chest => {
        chest.initTreasure();
    });
}

function checkCollectedTreasure(position){
    treasureArray.forEach(chest => {

        let x = position[0];
        let y = position[1];

        let sx = chest.coordinates[0];
        let sy = chest.coordinates[1];

        if(x === sx && y === sy){
            console.log("Treasure Collected");
            chest.collectTreasure();
            treasureArray.splice(chest, 1);
            addTreasureToScore();
        }
    }); 
}

function addTreasureToScore(){
    score += 200;
    console.log("Treasure score: " + score);
}