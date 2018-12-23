class Ocean {
    constructor(app) {
        this.app = app;
        this.count = 0;
        this.tilingSprite = null;
    }

    init() {
        var texture = Texture.fromImage("../assets/Textures/water.jpg");
        this.tilingSprite = new PIXI.extras.TilingSprite(
            texture,
            this.app.screen.width * 1.5,
            this.app.screen.height * 1.5
        );

        this.tilingSprite.anchor.set(0.25, 0.25);
        this.app.stage.addChild(this.tilingSprite);
    }

    update(delta) {
        this.count += delta / 100;

        this.tilingSprite.tileScale.x = 1 + Math.sin(this.count) / 100;
        this.tilingSprite.tileScale.y = 1 + Math.cos(this.count) / 100;
        this.tilingSprite.position.x -= Math.sin(this.count) / 100;
        this.tilingSprite.position.y += Math.cos(this.count) / 100;
    }
}
