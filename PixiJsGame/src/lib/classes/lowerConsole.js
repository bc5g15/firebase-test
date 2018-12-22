var lowerConsole;

function initLowerConsole() {
    lowerConsole = new PIXI.Graphics();
    lowerConsole.beginFill(0xd3d3d3, 0.55);
    lowerConsole.lineStyle(0, 0x000000, 0.5);
    lowerConsole.drawRect(0, globalHeight * 0.8, globalWidth, globalHeight);

    app.stage.addChild(lowerConsole);

    initButtons();
}
