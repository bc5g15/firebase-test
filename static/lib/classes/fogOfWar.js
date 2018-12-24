/*
This class will be used to prevent the player from seeing ships on the map
that are not in the ships 'cone of sight', a 90 degree view of the grid
directly ahead of the ship. This class can be used to increase difficulty
for the early parts of the game, or for the whole game.
*/

class FogOfWar {

    constructor(app){
        this.app = app;
        this.tilingSprite = null;
    }

    init(rotation, position){
        var texture = Texture.fromImage("/static/assets/Textures/fog.jpg");
        this.tilingSprite = new PIXI.extras.TilingSprite(
            texture,
            this.app.screen.width,
            this.app.screen.height * 0.8
        );

        this.tilingSprite.anchor.set(0, 0);
        this.app.stage.addChild(this.tilingSprite);
    }

    updateFog(rotation, position){}

    dissipate(){}

    accumulate(){

    }
}