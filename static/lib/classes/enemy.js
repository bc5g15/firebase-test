/*
Enemy class that adds enemies to the game, each with their own health, position, and ID (specific to this game only,
and coordinates to say which coordinates the ship is in for the current game state)
*/

class Enemy {
    constructor(app, id, position) {
        this.app = app;
        this.id = id;
        this.position = position; //coordinates
        this.sprite = null;
        this.health = 1000;
        this.coordinates = [];
    }

    initEnemy() {
        this.sprite = PIXI.Sprite.fromImage("static/assets/Sprites/ship.png");
        this.sprite.scale.x = 1.5 / dimention;
        this.sprite.scale.y = 1.5 / dimention;

        this.sprite.anchor.set(0.5);
        this.sprite.rotation = Math.PI * 2 * Math.random();
        this.calculatePosition(this.position);
        
        app.stage.addChild(this.sprite);
        console.log("Enemy Coord: " + this.coordinates);
    }

    calculatePosition(pos) {
        let x = pointArray[pos[0]].x;
        let y = pointArray[dimention * pos[1]].y;

        this.sprite.position.set(x, y);
        this.calculateCoords([x, y]);
    }

    //takes a physical position (x=276.222, y= 655.77777) for example, and returns its coordinates.
    calculateCoords(pos){
        this.coordinates = indexToGridCoord(getGridIndex(pos));
    }
}
