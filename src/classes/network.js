/* 
This class will be used to send and receive updates from the server, im not sure
how, hopefully the people doing the backed will know. This class calls methods
in the game state class. This enables this allows the networking and server
communication to be abstracted away from the game and its operations.
*/

export function requestGameState() {
  /*
    
    This function will send a request to the server and return the most up to date
    array for the game

    */
}

export function updatePosition(id, position) {
  /* this will send a position to the server to update the location of a players
ship in the game.
*/
}
