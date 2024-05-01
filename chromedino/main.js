var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

var dino = {
    x : 10,
    y : 500,
    width : 50,
    height : 50,
    draw(){
        var img = (timer < 1000) ? img1 : img5; 
        ctx.fillRect(this.x, this.y,this.width, this.height); 
        ctx.drawImage(img,this.x,this.y,this.width, this.height);   
    }
}
var gameover = {
    x : 350,
    y : 300,
    width : 200,
    height : 100,
    draw(){
        ctx.fillRect(this.x, this.y,this.width, this.height); 
        ctx.drawImage(img6,this.x,this.y,this.width, this.height);   
    }
}
var ground = {
    x : 10,
    y : 550,
    width : 900,
    height : 60,
    draw(){
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.x, this.y,this.width, this.height); 
    }
}
var img1 = new Image();
img1.src = './assets/dino.png';
var img2 = new Image();
img2.src = './assets/cactus.png';
var img3 = new Image();
img3.src = './assets/cloud.png';
var img4 = new Image();
img4.src = './assets/otherdino.png';
var img5 = new Image();
img5.src = './assets/runningdino.png';
var img6 = new Image();
img6.src = './assets/GameOver.png';
class Cactus {
    constructor(){
        this.x = 900;
        this.y = 500;
        this.width = 50;
        this.height = 50;
    }
    draw(){
        ctx.fillRect(this.x, this.y,this.width, this.height);     
        ctx.drawImage(img2,this.x,this.y,this.width, this.height);    
    }
}

class Cloud {
    constructor(){
        this.x= 900;
        this.y= 200;
        this.width= 60;
        this.height= 30;
    }
    draw(){
        ctx.fillRect(this.x, this.y,this.width, this.height); 
        ctx.drawImage(img3,this.x,this.y,this.width, this.height);  
    }
}
class Otherdino {
    constructor(){
        this.x= 900;
        this.y= 200;
        this.width= 60;
        this.height= 30;
    }
    draw(){
        ctx.fillRect(this.x, this.y,this.width, this.height); 
        ctx.drawImage(img4,this.x,this.y,this.width, this.height);  
    }
}
var timer = 0;
var gameTime = 0;
var obstackle=false;
var countAfterobstackle=0;
var cactusmultiple = [];
var backgroundmultiple =[];
var jumptimer = 0;
var animaition;
var ifOnTheGround=true;
var gamespeed=1;

function game(){
    animaition = requestAnimationFrame(game);
    timer ++;
    gameTime = timer/100;
    countAfterobstackle ++;
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
    if(Math.random() > 0.995 ){
        var cloud = new Cloud();
        backgroundmultiple.push(cloud);
    }
    if(Math.random() < 0.0019){
        var otherdino = new Otherdino();
        backgroundmultiple.push(otherdino);

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
    dino.draw();
    ground.draw();
}

game();

function colision(dino, cactus){
    var a = cactus.x - (dino.x+ dino.width);
    var b = cactus.y - (dino.y+ dino.height);
    if (a<0 && b<0){
        ctx.clearRect(0,0, canvas.width, canvas.height);
        gameover.draw();
        cancelAnimationFrame(animaition);
    }
}

var jump = false;
document.addEventListener('keydown',function(e){
    if (e.code ==='Space'&&ifOnTheGround ===true){
        jump = true;
        ifOnTheGround=false;
    }
})
