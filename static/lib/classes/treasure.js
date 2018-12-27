class Treasure {
    constructor(app, coordinates){
        this.app = app;
        this.position = null;;
        this.sprite = null;
        this.coordinates = coordinates;
    }

    initTreasure(){
        this.sprite = PIXI.Sprite.fromImage("static/assets/Sprites/treasure.png");
        this.sprite.scale.x = 1.5 / dimention;
        this.sprite.scale.y = 1.5 / dimention;
        this.sprite.anchor.set(0.5);
        this.calculatePosition(this.coordinates);

        app.stage.addChild(this.sprite);
    }

    calculatePosition(coord) {

        let x = pointArray[coord[0]].x;
        let y = pointArray[dimention * coord[1]].y;

        this.sprite.position.set(x, y);
        this.positionExact = [x, y];
    }

    calculateCoords(pos){
        this.coordinates = indexToGridCoord(getGridIndex(pos));
    }

    collectTreasure(){
        app.stage.removeChild(this.sprite);
    }
}