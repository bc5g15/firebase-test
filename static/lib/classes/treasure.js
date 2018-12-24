class Treasure {
    constructor(app, position){
        this.app = app;
        this.position = position;
        this.sprite = null;
        this.coordinates = [];
    }

    init(){
        this.sprite = PIXI.Sprite.fromImage("static/assets/Sprites/treasure.png");
        this.sprite.scale.x = 0.5 / dimention
        this.sprite.scale.y = 0.5 / dimention
        this.sprite.anchor.set(0.5)
        this.calculatePosition(this.position)
    }

    calculatePosition(pos) {
        let x = pointArray[pos[0]].x;
        let y = pointArray[dimention * pos[1]].y;

        this.sprite.position.set(x, y);
        this.positionExact = [x, y];
    }

    calculateCoords(position){
        this.coordinates = indexToGridCoord(getGridIndex(pos));
    }

    collectTreasure(){
        app.stage.removeChild(this.sprite);

    }
}