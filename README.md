# clock162 report

## CDG(Chrome Dino Game)
We designed a Chrome Dino Game with 'Canvas' and '2D'. CDG has the option of two different screen sizes. If window.innerWidth is greater than 1000, it's for desktop mode. Other screen sizes refer to mobile mode. To play the mobile and computer versions of the game, CDG allows players to use click and space for jumping motion. Also, each game speed will increase every 10 seconds for not losing a game. Computer play mode has a wider game size than mobile mode for comfortable play. And the smaller size of the game will help mobile users see on the phone. To give more life to dinosaurs and pterosaurs, we set up two images to look like running dinosaurs and flying pterosaurs. Dinosaurs and pterosaurs are in the loop for checking colition, but the cloud is in another loop since it doesn't need to pass through colition.

## Flappy Bird Game

To implement the game, we decided that we would take advantage of the HTML
canvas tag which allows for a more flexible and dynamic implementation of
games. The game is comprised of three main object data types for the
representation of the bird, the pipes at the top, and the pipes at the bottom of the
game screen. 

### Game functions
When the window gets first loaded, the `onload` function initializes the the
images to be rendered to the screen as well as the screen size and the event
listeners of the game.

On the `gameLoop` function resides the logic for rendering the images to the
screen.

The `drawBird and drawPipe` take care of drawing the bird and pipes to the
screen. 'getRandomInt' generates a random number within a range. This is used to
generate the pipes in different sizes.

`createPipe` creates two pipes. One to be held on top of the screen and the
other at the bottom of the screen.

`handleJump` takes care of making the bird jump in case of a `space` key press
or click or tap on the screen.

`detectCollision` function detects the collision of the bird and the pipes
based on the pixel box surrounding them.

`resetGame` reset the game states to prepare for a new game. In this function
all variables are set to their initial states.


## Hangman

This game was refactored from the following [GitHub
repo GPL License](https://github.com/BelalAnan/GameStation/tree/main). The code on that
repo contained a lot of repeated and hard-coded code. We want to find a way to
take advantage of function to allow for a more dynamic approach. That approach
would make the game development more comprehensible with well-defined
functions and allow for the addition of features with more ease.


### Our implementation
In our implementation, the only hard-coded statements are the constant. To
allow for more dynamism, the `hangmanword` variable could be initialized with 
fetched data from an API. 

On `window load`, the event listeners as well as the keyboard and word to be
guessed is initialized.

`createKeyboard` function allows for the dynamic creation of a keyboard for the
user the utilize. 

`createWordDisplay` creates the word to be guessed and displays the missing spaces
which are represented as underscore "_". 

`checkLetter` check is the letter pressed from the key is a valid guess. If the
guess is valid the letters appear on the missing spaces and the key-pressed
border is colored green. Otherwise, the key-pressed border is colored red to
indicate a wrong guess.

`setCategory`, sets the category theme of the game(Themes: `Computer
Architechture`, `Software Engineering`, and `Web Programming`).

`cleanWordDisplay` and `cleanKeyBoard` respectively clean the placeholder for the word to be
guessed for a potential next-word guess as well as the keyboard.

On a correct guess, `setNextGame` updates the game state for the next word to
be guessed. Lastly, `resetGame`, resets the game states to start a new game.

With those functions' implementations, it makes it easy for developers to
understand the code implementation, and also allows for ease of features
implementation.

**<u>Note:</u>** The games were developed for computer science students as
the target audience. Hence, the reason why we chose topics like computer architecture,
software engineering, and web programming as topics for the hangman game.

