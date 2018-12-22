class Ship {
    constructor(app, id, position) {
        this.app = app;
        this.id = id;
        this.position = position; //coordinates
        this.positionExact = null;
        this.sprite = null;
    }

    initShip() {
        this.sprite = PIXI.Sprite.fromImage("../assets/Sprites/ship.png");
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
        console.log("this.position: " + this.position);

        if (!(this.position[0] === 0)) {
            // let x = this.position[0] - 1;
            // let y = this.position[1];

            // this.calculatePosition([x, y]);

            // this.position[0] = x;
            // this.position[1] = y;

            move(-1, 0);
        } else {
            console.log("Cant move left!");
        }
    }

    moveRight() {}

    moveUp() {}

    moveDown() {}

    move(x, y) {
        let x = this.position[0] + x;
        let y = this.position[1] + y;

        this.calculatePosition([x, y]);

        this.position[0] = x;
        this.position[1] = y;
    }
}
