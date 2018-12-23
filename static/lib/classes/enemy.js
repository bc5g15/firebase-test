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

    calculateCoords(pos){
        this.coordinates = indexToGridCoord(getGridIndex(pos));
    }
}
