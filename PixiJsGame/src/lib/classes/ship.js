class Ship {

    constructor(x, y, id, app) {

        
        this.x = x;
        this.y = y;
        this.id = id;
        this.app = app;

    }

    init(){

        
    }

    getId() {
        return this.id;
    }

    getXy() {
        return [this.x, this.y];
    }

    setX(xValue) {
        this.x = xValue;
    }

    setY(yValue) {
        this.y = yValue;
    }

    setId(newId){
        this.id = newId
    }
}
