//creates the sounds used by the misisles

var launch;
var explode;

var explodeSound;
var launchSound;

function sound(src){

    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);

    this.play = function(){
        this.sound.cloneNode(true).play();
    }

    this.stop = function(){
        this.sound.pause();
    }
}

function launch(){
    launch.play();
}

function explode(){
    explode.play();
}