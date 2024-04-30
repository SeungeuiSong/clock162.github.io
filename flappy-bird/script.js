let canvas; 

let playButton;
let restartButton;
let gameThemeButton;

let themeButtonClickCount = 0;

let canvasWidth;
let canvasHeight;

const birdWidth = 42;
const birdHeight = 32;

const DIRECTIONS = {
    UP: 1,
    DOWN: -1,
    MIDDLE: 0,
    LEFT: -2,
    RIGHT: 2
}

let gravity = 2;

const birdXvelocity = 1;
const birdYvelocity = 60;

let birdMidImg;
let birdUpImg;
let birdDownImg;

let bird;

const pipeWidth = 75;
const pipeHeight = 175;

let backgroundSpeed = 2;
let gameBackgroundImg;
let backgroundXPosition = 0;
let backgroundDupXPosition;


let pipeSpeed = backgroundSpeed;
let pipeDownImg;
let pipeUpImg;

let gameOverImg;

const minPipeHeight = 125;

let availablePipes = 1;
let upPipes = [];
let downPipes = [];

let pipesGapMin = 200;
let pipesGapMax = 325;

let timeToRenderPipe = 4000; // 4 second

let score = 0;
let gameOver = false;

let isGamePaused = true;
let restartgame = false;


window.onload = () => {
    canvas = document.getElementById('game-board');

    if(window.innerWidth < 768) {
        canvasWidth = window.innerWidth;
        // 128 represents the value of the header and footer height
        // combined
        canvasHeight = window.innerHeight - 128;
    } else {
        canvasWidth = 700;
        canvasHeight = 550;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    backgroundDupXPosition = canvas.width;

    bird = {
        x: (canvasWidth / 2 - birdWidth / 2),
        y: (canvasHeight / 2 - birdHeight / 2),
        direction: DIRECTIONS.MIDDLE,
        xVelocity: birdXvelocity,
        yVelocity: birdYvelocity,
        width: birdWidth,
        height: birdHeight
    };

    context = canvas.getContext('2d');

    playButton = document.getElementById('play-button');
    restartButton = document.getElementById('restart');
    gameThemeButton = document.getElementById('game-theme');
    themeButton = document.getElementById('theme-button');

    // Loading the required images 
    gameBackgroundImg = new Image();
    gameBackgroundImg.src = './assets/background-day.png';

    birdUpImg = new Image();
    birdUpImg.src = './assets/yellowbird-upflap.png';

    birdMidImg = new Image();
    birdMidImg.src = './assets/yellowbird-midflap.png';

    birdDownImg = new Image();
    birdDownImg.src = './assets/yellowbird-downflap.png';

    pipeDownImg = new Image();
    pipeDownImg.src = './assets/pipe-green.png';

    pipeUpImg = new Image();
    pipeUpImg.src = './assets/pipe-green-top.png';

    gameOverImg = new Image();
    gameOverImg.src = './assets/gameover.png';

    setInterval(createPipe, timeToRenderPipe);

    requestAnimationFrame(gameLoop);

    // Listening for events
    canvas.addEventListener("click", handleJump);
    document.addEventListener("keyup", handleJump);

    playButton.addEventListener("click", (e) => {
        if(e.target.id === "play-button") {
            isGamePaused = false;
            playButton.className = 'fa fa-pause';
            playButton.setAttribute('id', 'pause-button');
        } else {
            isGamePaused = true;
            playButton.className = 'fa fa-play';
            playButton.setAttribute('id', 'play-button');
        }
    });

    themeButton.addEventListener("click", (e) => {
        if(e.target.className === "fa fa-moon-o") {
            themeButton.className = 'fa fa-sun-o';
        } else {
            themeButton.className = 'fa fa-moon-o';
        }
    });

    restartButton.addEventListener("click", resetGame);

    gameThemeButton.addEventListener("click", (e) => {
        themeButtonClickCount++;

        if(themeButtonClickCount % 2 !== 0) {
            gameBackgroundImg.src = './assets/background-night.png';
            document.body.style.background = "#294b46";
            gameThemeButton.style.opacity = ".8";
        } else {
            gameBackgroundImg.src = './assets/background-day.png';
            document.body.style.background = "#E8F8F5";
            gameThemeButton.style.opacity = "1";
        }
    });

}


function gameLoop() {
    if(gameOver) {
        // On game over, Display game over image in the middle of the screen
        context.drawImage(gameOverImg, canvas.width / 2 - 175, canvas.height / 2 - 75/2, 350, 75);
        return;
    }

    // Clean the screen before drawing the new frame
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Update background positions to make bird move 
    // If the game is pause, stop moving the background
    if(!isGamePaused) {
        backgroundXPosition -= backgroundSpeed;
        backgroundDupXPosition -= backgroundSpeed;
    }

    // Reset background position when it moves out of view
    if (backgroundXPosition <= -canvas.width) {
        backgroundXPosition = canvas.width - 1 + backgroundDupXPosition;
    }

    if (backgroundDupXPosition <= -canvas.width) {
        backgroundDupXPosition = canvas.width - 1 + backgroundXPosition;
    }

    context.drawImage(gameBackgroundImg, backgroundXPosition, 0, canvas.width, canvas.height);
    context.drawImage(gameBackgroundImg, backgroundDupXPosition, 0, canvas.width, canvas.height);

    // Drawing the tunnels
    for(let i = 0; i < upPipes.length; i++) {
        let topPipe = upPipes[i];
        let bottomPipe = downPipes[i];

        // Stop moving the pipe when the game is paused
        if(!isGamePaused) {
            topPipe.x -= topPipe.speed;
            bottomPipe.x -= bottomPipe.speed;
        }

        // Check for collision with each pipe
        if (detectCollision(bird, topPipe) || detectCollision(bird, bottomPipe)) {
            gameOver = true;
        }

        // If the bird passed either the top or bottom pipe
        // increase the game score by 1
        if(!topPipe.passedByBird && bird.x > topPipe.x + topPipe.width) {
            topPipe.passedByBird = true;
            score += 1;
        } else if(!downPipes.passedByBird && bird.x > downPipes.x + downPipes.width) {
            downPipes.passedByBird = true;
            score += 1;
        }

        // If the pipe went off screen remove it from the list
        // else draw it on the screen
        if(topPipe.x + pipeWidth < 0) {
            upPipes.shift();
        } else {
            drawPipe(pipeDownImg, bottomPipe);
        }

        // If the pipe went off screen remove it from the list
        // else draw it on the screen
        if(topPipe.x + pipeWidth < 0) {
            downPipes.shift();
        } else {
            drawPipe(pipeUpImg, topPipe);
        }
    }

    // Drawing the bird in the game loop
    if(bird.y + bird.height < canvas.height) {
        if(!isGamePaused) {
            bird.y += gravity;
        }

        // If the bird jumped change bird image to up, middle then down
        // flap 
        if(bird.direction === DIRECTIONS.UP) {
            drawBird(birdMidImg);
            bird.direction = DIRECTIONS.MIDDLE;

            drawBird(birdUpImg);
            bird.direction = DIRECTIONS.DOWN;
        } else {
            drawBird(birdDownImg);
            bird.direction = DIRECTIONS.DOWN;
        }

    } else {
        // If the bird went off the bottom of the screen
        // reset height to land bird on ground and set gameOver to true
        bird.y = canvas.height - bird.height;
        drawBird(birdMidImg);
        bird.direction = DIRECTIONS.MIDDLE;
        gameOver = true;
    }

    // Displays the score in the top left corner of the canvas
    context.fillStyle = "White";
    context.font = '1.75rem "Concert One", sans-serif';
    context.fillText(`score: ${score}`, 10, 45);

    // Writing the game title on the top right corner
    // Displays the score in the top left corner of the canvas
    context.fillStyle = "#DC7633";
    context.font = '1.75rem "Concert One", sans-serif';
    context.fillText(`Flappy Bird`, canvas.width - 150, 45);

    if(isGamePaused) {
        // If game is paused display the "Press Play..." messsage
        // in the middle of the screen
        context.fillStyle = "White";
        context.font = '2.125rem "Concert One", sans-serif';
        context.fillText("Press play...", canvas.width / 2 - 75, canvas.height / 2 + 50);
    }

    requestAnimationFrame(gameLoop);
}

// Draws a bird on the screen
// birdType is the bird image type: flap up, flap middle, flap down
function drawBird(birdType) {
    context.drawImage(birdType, bird.x, bird.y, bird.width, bird.height);
}

// Draws a pipe on the screen
function drawPipe(pipeType, pipe) {
    context.drawImage(pipeType, pipe.x, pipe.y, pipe.width, pipe.height);
}

// Generate a random integer number within a range
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Creates pipes for the game. Returns two pipes. 
// One on top of the other separated by a gap
function createPipe() {
    if(isGamePaused) {
        return;
    }

    let gap = getRandomInt(pipesGapMin, pipesGapMax);
    let topPipeHeight  = getRandomInt(minPipeHeight, canvas.height - gap);
    let bottomPipeHeight = canvas.height - gap - topPipeHeight;

    // The the bottom pipe to be minPipeHeight
    if(bottomPipeHeight < minPipeHeight) {
        bottomPipeHeight = minPipeHeight;
    }
    
    // Creates the pipe to be placed on top
    let topPipe = {
        x: canvasWidth,
        y: 0,
        position: DIRECTIONS.DOWN,
        passedByBird: false,
        speed: pipeSpeed,
        width: pipeWidth,
        height: topPipeHeight
    };

    upPipes.push(topPipe);

    // Creates the pipe to be place at the bottom
    let downPipe = {
        x: canvasWidth,
        y: canvasHeight - bottomPipeHeight,
        position: DIRECTIONS.UP,
        passedByBird: false,
        speed: pipeSpeed,
        width: pipeWidth,
        height: bottomPipeHeight
    };

    downPipes.push(downPipe);
}

// Makes the bird jump
function handleJump(e) {
    if(gameOver || isGamePaused) {
        return;
    }


    if(e.target.id === "game-board" || e.code === "Space") {
        let bound = bird.y - bird.yVelocity;

        // While the bird new bound does not exceed the top screen
        // increase the bird's height to simulate jump
        if(bound > 0) {
            bird.y -= bird.yVelocity;
            drawBird(birdDownImg);
            bird.direction = DIRECTIONS.UP;
        }
        
    }
}

// Detects case of collision between bird and pipes
function detectCollision(flappyBird, pipe) {
    // Calculate the coordinates of the bird
    let birdLeft = flappyBird.x;
    let birdRight = bird.x + flappyBird.width;
    let birdTop = flappyBird.y;
    let birdBottom = flappyBird.y + flappyBird.height;

    // Calculate the coordinates of the pipe
    let pipeLeft = pipe.x;
    let pipeRight = pipe.x + pipe.width;
    let pipeTop = pipe.y;
    let pipeBottom = pipe.y + pipe.height;

    // Check for collision by comparing the items bounds
    if (
        birdRight > pipeLeft &&
        birdLeft < pipeRight &&
        birdBottom > pipeTop &&
        birdTop < pipeBottom
    ) {
        return true;
    } else {
        return false;
    }
}


// Resetting the game states for a new game
function resetGame() {
    bird = {
        x: (canvasWidth / 2 - birdWidth / 2),
        y: (canvasHeight / 2 - birdHeight / 2),
        direction: DIRECTIONS.MIDDLE,
        xVelocity: birdXvelocity,
        yVelocity: birdYvelocity,
        width: birdWidth,
        height: birdHeight
    };

    backgroundXPosition = 0;
    backgroundDupXPosition = canvas.width;

    upPipes = [];
    downPipes = [];

    pipesGapMin = 200;
    pipesGapMax = 325;

    timeToRenderPipe = 4000; // 4 second

    score = 0;

    isGamePaused = true;
    restartgame = false;

    // Resetting the Play button in case switched to Pause button
    playButton.setAttribute('id', 'play-button');
    playButton.className = 'fa fa-play';

    // Restart the Game, it the player lost
    if(gameOver) {
        gameOver = false;
        requestAnimationFrame(gameLoop);
    }
}