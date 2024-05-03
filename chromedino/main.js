var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


window.onload = () => {
    if(window.innerWidth < 1000) {
        canvas.width = 500;
        canvas.height = 600;
    } 
    else {
        canvas.width = 900;
        canvas.height = 600;
    }
}

var dino = {
    x : 10,
    y : 500,
    width : 50,
    height : 50,
    draw(){
        if(dino.y!==500)
            imgRunning.src = './assets/Dino/DinoJump.png';
        else    
            imgRunning.src = (timer%24 <12) ? './assets/Dino/DinoRun1.png' : './assets/Dino/DinoRun2.png';

        ctx.drawImage(imgRunning,this.x,this.y,this.width, this.height);   
    }
}

var firstground = {
    x : 10,
    y : 510,
    width : 900,
    height : 60,
    draw(){
        if(this.x ===-890){

            this.x = 910;
        }
        ctx.drawImage(groundimg,this.x,this.y,this.width, this.height);  
    }
}
var secondground = {
    x : 910,
    y : 510,
    width : 900,
    height : 60,
    draw(){
        if(this.x ===-890)
            this.x=910;
        ctx.drawImage(groundimg,this.x,this.y,this.width, this.height);  
    }
}

var gameover = {
    
    x: (window.innerWidth < 1000) ? 150 : 300,
    y: 300,
    width : 200,
    height : 100,
    draw(){
        ctx.drawImage(img6,this.x,this.y,this.width, this.height);   
    }
}
var imgRunning = new Image();
var cloudimg = new Image();
var cactus = new Image();
var cloudimg = new Image();
var groundimg = new Image();
groundimg.src = './assets/other/Track.png';

var otherdinoimg = new Image();
var img5 = new Image();
img5.src = './assets/runningdino.png';
var img6 = new Image();
img6.src = './assets/GameOver.png';
class Cactus {
    constructor(){
        if(timer>1000){
            if(Math.random() > 0.7 ){
                this.x = 900;
                this.y = 500;
                this.width = 50;
                this.height = 80;
                cactus.src = './assets/Cactus/LargeCactus3.png';
                
            }
            else if(Math.random() > 0.4 ){
                this.x = 900;
                this.y = 500;
                this.width = 40;
                this.height = 80;
                cactus.src = './assets/Cactus/LargeCactus2.png';
            }
            else{
                this.x = 900;
                this.y = 500;
                this.width = 30;
                this.height = 80;
                cactus.src = './assets/Cactus/LargeCactus1.png';
            }
        }
        else {
            if(Math.random() > 0.7 ){
                this.x = 900;
                this.y = 500;
                this.width = 50;
                this.height = 60;
                cactus.src = './assets/Cactus/SmallCactus3.png';
            }
            else if(Math.random() > 0.4 ){
                this.x = 900;
                this.y = 500;
                this.width = 40;
                this.height = 60;
                cactus.src = './assets/Cactus/SmallCactus2.png';
            }
            else{
                this.x = 900;
                this.y = 500;
                this.width = 30;
                this.height = 60;
                cactus.src = './assets/Cactus/SmallCactus1.png';
            }
        }
    }
    draw(){    
        ctx.drawImage(cactus,this.x,this.y,this.width, this.height);    
    }
}

class Cloud {
    constructor(){
        this.x= 900;
        this.y= 200;
        this.width= 60;
        this.height= 60;
            cloudimg.src = './assets/Other/Cloud.png';

        }
    draw(){
        ctx.drawImage(cloudimg,this.x,this.y,this.width, this.height);  
    }
}
class Otherdino {
    constructor(){
        this.x= 900;
        this.y= 400;
        this.width= 60;
        this.height= 30;
    }
    draw(){
        otherdinoimg.src = (timer%12 <6) ? './assets/Bird/Bird1.png' : './assets/Bird/Bird2.png';
        ctx.drawImage(otherdinoimg,this.x,this.y,this.width, this.height);  
    }
}
var timer = 0;
var gameTime = 0;
var obstackle=false;
var countAfterobstackle=0;
var cactusmultiple = [];
var backgroundmultiple =[];
var otherdinolist = [];
var jumptimer = 0;
var animaition;
var ifOnTheGround=true;
var gamespeed=1;

function game(){
    animaition = requestAnimationFrame(game);
    timer ++;
    gameTime = timer/100;
    countAfterobstackle ++;
    firstground.x -= 3*gamespeed;
    secondground.x -= 3*gamespeed;
    updateTimerDisplay();

    ctx.clearRect(0,0, canvas.width, canvas.height);
    if(timer %1000===0){
        gamespeed++;
    }
    if(countAfterobstackle === 2*gamespeed){ obstackle =true;}

    if(Math.random() < 0.01 &&obstackle ===true){
        var cactus = new Cactus();
        cactusmultiple.push(cactus);
        obstackle =false;
    }
    cactusmultiple.forEach((a, i, o)=>{
        if(a.x <0){
            o.splice(i,1);
        }
        colision(dino,a);
        a.x-=6*gamespeed;
        a.draw();
        countAfterobstackle = 0;
    })
    
    
    if(Math.random() > 0.992&&obstackle ===true){
        var otherdino = new Otherdino();
        otherdinolist.push(otherdino);
        obstackle =false;
    }
    
    otherdinolist.forEach((a, i, o)=>{
        if(a.x <0){
            o.splice(i,1);
        }
        otherdinoColision(dino,a);
        a.x-=6*gamespeed;
        a.draw();
        countAfterobstackle = 0;
    })
    if(Math.random() > 0.995 ){
        var cloud = new Cloud();
        backgroundmultiple.push(cloud);
    }
    
    backgroundmultiple.forEach((a, i, o)=>{
        if(a.x <0){
            o.splice(i,1);
        }
        a.x-=6*gamespeed;
        a.draw();
    })
    if(jump === true){
        dino.y -=4;
        jumptimer ++;
    }
    if (jumptimer > 30){
        jump = false;
        jumptimer=0;
    }
    if ( jump === false){
        if(dino.y <500)
        dino.y +=4;
    }
    if(dino.y === 500){
        ifOnTheGround=true;
    }
    firstground.draw();
    secondground.draw();
    dino.draw();
}

game();
function colision(dino, obstackle){
    var a = obstackle.x - (dino.x+ dino.width);
    var b = obstackle.y - (dino.y+ dino.height);
    if (a<0 && b<0){
        ctx.clearRect(0,0, canvas.width, canvas.height);
        gameover.draw();
        cancelAnimationFrame(animaition);
    }
}

function otherdinoColision(dino, obstackle){
    var a = obstackle.x - (dino.x+ dino.width);
    var b =dino.y- (obstackle.y+obstackle.height);
    if (a<0 && b<0){
        ctx.clearRect(0,0, canvas.width, canvas.height);
        gameover.draw();
        cancelAnimationFrame(animaition);
    }
}
function restartGame() {
    gamespeed = 1;
    dino.x = 10;
    dino.y = 500;
    timer = 0;
    gameTime = 0;
    obstackle = false;
    countAfterobstackle = 0;
    cactusmultiple = [];
    backgroundmultiple = [];
    jumptimer = 0;
    animaition;
    ifOnTheGround = true;
    cancelAnimationFrame(animaition);
    game();
}

function updateTimerDisplay() {
    document.getElementById('timerDisplay').innerText = "Timer: " + gameTime +"s";
    setTimeout(updateTimerDisplay, 100);
}

var jump = false;
document.addEventListener('keydown',function(e){
    if (e.code ==='Space'&&ifOnTheGround ===true){
        jump = true;
        ifOnTheGround=false;
    }
})
