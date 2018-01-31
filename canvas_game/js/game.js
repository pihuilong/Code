//create canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

//prepare images
//Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function(){
    bgReady = true;
}
bgImage.src = "images/background.png";
//Hero Image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function(){
    heroReady = true;
}
heroImage.src = "images/hero.png";
//Monster Image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function(){
    monsterReady = true;
}
monsterImage.src = "images/monster.png";

//game objects
var hero = {
    speed : 256   // movement in pixels per second
}
var monster = {};
var monsterCaught = 0;

//handle keyboard controls
var keysDown = {};
addEventListener("keydown",function(e){
    keysDown[e.keyCode] = true;
},false);
addEventListener("keyup",function(e){
    delete keysDown[e.keyCode];
},false);

//reset the game when the player catches a monster
var reset = function(){
    //throw the monster somewhere on the screen randomly
    monster.x = 32 + (Math.random()*(canvas.width - 64));
    monster.y = 32 + (Math.random()*(canvas.height - 64));
};

//update objects
var update = function(modifier){
    if(38 in keysDown){  //player holding up
        if(hero.y<=0){
            hero.y=0;
        }else{
            hero.y -= hero.speed * modifier;
        }
    }
    if(40 in keysDown){ //player holding down
        if(hero.y>=canvas.height-32){
            hero.y=canvas.height-32;
        }else{
            hero.y += hero.speed * modifier;
        }
    }
    if(37 in keysDown){ //player holding left
        if(hero.x<=0){
            hero.x=0
        }else{
            hero.x -= hero.speed * modifier;
        }
    }
    if(39 in keysDown){ //player holding right
        if(hero.x>=canvas.width-32){
            hero.x=canvas.width-32;
        }else{
            hero.x += hero.speed * modifier;
        }
    }
    //Are they touching?
    if(
        hero.x <= (monster.x + 31)
        && monster.x <= (hero.x + 31)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ){
        ++monsterCaught;
        reset();
    }
};

//draw everything
var render = function(){
    if(bgReady){
        ctx.drawImage(bgImage,0,0);
    }
    if(heroReady){
        ctx.drawImage(heroImage,hero.x,hero.y);
    }
    if(monsterReady){
        ctx.drawImage(monsterImage,monster.x,monster.y);
    }
    //score
    ctx.fillStyle = "rgb(250,250,250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Goblins caught: " + monsterCaught , 32,32);
};

//the main game loop
var main = function(){
    var now = Date.now();
    var delta = now - then;
    update(delta/1000);
    render();
    then=now;
    requestAnimationFrame(main);
}

//compatible for different browers
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

//start
var then = Date.now();
hero.x = canvas.width/2;
hero.y = canvas.height/2;
reset();
main();