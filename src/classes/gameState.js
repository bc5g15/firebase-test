/*
Upon deciding how the server will send data to the client, the gamestate will be initialized and dealt with
here. This will recieve new gamestates.
*/

var entireGameState = [];

function gameSetup(id, gameState) {
  /*
    This method is called by the networking class to provide the gamestate for the game
    This method SHOULD PROVIDE THE FOLLOWING 

    - AN ID for the player (this id is used to send position updates to the server)
    - THE GAMESTATE (a list of all the ships ids and their positions, and a positive integer representing the dimention of the whole game grid)
    - The gamestate will be of the form ([ [4548, [1,3]], [1764, [7,6]]], 7)
    - This example gamestate shows two ships of id 4548 and 1764 with the coordinates in which
    they exist in the game.
    - The number represents the grid size,ie a 7 represents a 7x7 game state. This dimention is very important
    and determines the whole size of the "board" the players can move in
    */

  console.log('Getting Game State from server');
}

function treasureSetup(treasureArrayFromServer) {
  /**
    This function is called by the networking class and provides an array of treasure locations, an example being
    [[1,1],[2,2],[3,3],[4,4]]. This specifies 4 treasure chests at (1,1), (2,2) etc. 
    */

  treasureArray = treasureArrayFromServer;
}
