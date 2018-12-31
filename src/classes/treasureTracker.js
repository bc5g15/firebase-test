import Treasure from './treasure';

export function loadTreasure(gameBoard, treasureLocations) {
  //treasureLocations is an array of coordinates for the treasures
  treasureLocations.forEach(location => {
    let coord = [location[0], location[1]];
    //console.log("Treasure Coordinate: " + coord);
    let treasure = new Treasure(gameBoard.app, gameBoard, coord);
    gameBoard.treasureArray.push(treasure);
  });

  gameBoard.treasureArray.forEach(chest => {
    chest.initTreasure();
  });
}

export function checkCollectedTreasure(gameBoard, position) {
  gameBoard.treasureArray.forEach(chest => {
    let x = position[0];
    let y = position[1];

    let sx = chest.coordinates[0];
    let sy = chest.coordinates[1];

    if (x === sx && y === sy) {
      console.log('Treasure Collected');
      chest.collectTreasure();
      gameBoard.treasureArray.splice(chest, 1);
      addTreasureToScore(gameBoard);
    }
  });
}

export function addTreasureToScore(gameBoard) {
  gameBoard.score += 200;
  console.log('Treasure score: ' + gameBoard.score);
}
