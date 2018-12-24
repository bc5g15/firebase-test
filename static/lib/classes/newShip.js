/* 
This class keeps track of the state of the players ship (SPECIFICALLY NOT USED FOR ENEMY SHIPS)
This class us used to rotate the ship and move it around the map.
*/

class NewShip {
    constructor(app, id, position) {
        this.app = app;
        this.id = id;
        this.position = position; //coordinates
        this.positionExact = null; //exact coordinates
        this.sprite = null;
    }

    initShip() {
        this.sprite = PIXI.Sprite.fromImage("static/assets/Sprites/ship.png");
        this.sprite.scale.x = 1.5 / dimention;
        this.sprite.scale.y = 1.5 / dimention;
        this.sprite.anchor.set(0.5);
        this.calculatePosition(this.position);

        app.stage.addChild(this.sprite);
    }

    calculatePosition(pos) {
        let x = pointArray[pos[0]].x;
        let y = pointArray[dimention * pos[1]].y;

        this.sprite.position.set(x, y);
        this.positionExact = [x, y];
    }

    moveLeft() {
        if (!(this.position[0] === 0)) { 
            this.moveGeneral(-1, 0);
        } else {
            console.log("Cant move left!");
        }
    }

    moveRight() {
        if (!(this.position[0] === (dimention - 1))) { 
            this.moveGeneral(1, 0);
        } else {
            console.log("Cant move right!");
        }
    }

    moveUp() {
        if (!(this.position[1] === 0)) { 
            this.moveGeneral(0, -1);
        } else {
            console.log("Cant move up!");
        }
    }

    moveDown() {
        if (!(this.position[1] === (dimention - 1))) { 
            this.moveGeneral(0, 1);
        } else {
            console.log("Cant move down!");
        }
    }

    moveGeneral(newx, newy) {

        let x = this.position[0] + newx;
        let y = this.position[1] + newy;

        //create message using the jQuery
        let params = {
            id: id,
            x: x,
            y: y
        }

        $.post('/game/move', params)

        // this.calculatePosition([x, y]);
        //
        // this.position[0] = x;
        // this.position[1] = y;
        //
        // console.log("New Position: " + this.position + ", Score: " + score);
    }

    /*
    A new method that sets the position of a ship on the grid
     */
    setPosition(newx, newy) {

        this.calculatePosition([newx, newy]);

        this.position[0] = newx;
        this.position[1] = newy;
    }
}
