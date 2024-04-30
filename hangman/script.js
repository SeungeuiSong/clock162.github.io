const hangmanWords = [
    {
        'category': "Computer Architecture",
        'words': ["Pipelining", "memory", "cache", "Cores", "registers"],
        'hints': ["Dishwasher Chaining", "Container", "Fast memory", "Allows for multitasks", "Temporary storage locations"]
    },
    {
        'category': "Software Engineering",
        'words': ["algorithm", "Clean Code", "variable", "debugging", "testing"],
        'hints': ["Step-by-step process", "Good Practice", "Container for storing data", "Need Pestiside", "Unit overwatch"]
    },
    {
        'category': "Web Programming",
        'words': ["javascript", "html", "css", "class tag", "Database"],
        'hints': ["Web Language", "Skeleton", "Nice view", "Grouping", "Fridge"]
    }
];

const digitalKeyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

const cheeringWords = ["Good job!", "Good guess", "Keep going!", "Seems like you went to Dr. Posnett's class"];

let characterImageIndex = 0;
let characterImages = ["./assets/1.png","./assets/2.png","./assets/3.png",
                        "./assets/4.png","./assets/5.png","./assets/6.png",
                        "./assets/7.png"
                    ];

let topicSelection;
let currentWordIndex = 0;
let currentWordMap = new Map();

let correctGuess = 0;

let selectionTag;
let hangmanImgTag;
let scoreDiv;
let streakDiv;
let modelTag;
let gameOverDiv;
let playAgainButton;


let score = 0;
let streak = 0;
let currentCategory = 0;
let categoriesCompleted = [];


window.onload = () => {
    // Gather all necessary tags for interactiveness
    selectionTag = document.getElementById('selection-tag');

    scoreDiv = document.getElementById('score');
    streakDiv = document.getElementById('streak');

    hangmanImgTag = document.getElementById('hangman-img');
    modelTag = document.getElementById('hide-modal');
    gameOverDiv = document.getElementById('hide-game-over');

    const nextGuess = document.getElementById("next-button");

    // Display the keyboard on the screen
    createKeyboard(digitalKeyboard);

    // Creates and displays the words to be guessed on the screen
    createWordDisplay(hangmanWords[currentCategory].words[currentWordIndex].split(" "));

    // Change the category when user changes option in select tag
    selectionTag.addEventListener("change", setCategory);

    // Setup the game for next word set to guess if current guess
    // was guessed right 
    nextGuess.addEventListener('click', setNextGame);
}


// Create and display keyboard on screen
function createKeyboard(layout) {
    const keyboardContainer = document.getElementById('keyboard');

    layout.forEach(row => {
        const rowElement = document.createElement('div');
        rowElement.classList.add('keyboard-row');

        row.forEach(key => {
            const keyElement = document.createElement('button');
            keyElement.classList.add('keyboard-key');
            keyElement.textContent = key;

            // Event to handle clicks of a key
            keyElement.addEventListener('click', (event) => {
                checkLetter(event, key);
            });

            rowElement.appendChild(keyElement);
        });
        keyboardContainer.appendChild(rowElement);
    });
}

// Checks if a letter was guess corretly
function checkLetter(event, letter) {
    // if key is disable, it means the user already clicked it
    if(event.target.disabled) {
        return;
    } else {
        event.target.disabled = true;
    }

    // If a guess was correct display the letter on the screen
    if(currentWordMap.has(letter)) {
        // Make border of key green for correctly guessed letter
        event.target.classList.add('green-letter');

        let targetIds = currentWordMap.get(letter);

        for(let i = 0; i < targetIds.length; i++) {
            const targetLetterdiv = document.getElementById(targetIds[i]);
            
            // for each valid targetIds, display the letters
            if(targetLetterdiv) {
                correctGuess--;

                // iF all letters were guessed correctly, display 
                // modal message and "next" button for next set
                if(correctGuess === 0) {
                    modelTag.setAttribute('id', 'display-modal');

                    const modelMessageDiv = document.getElementById('modal-styling');
                    
                    let index = Math.floor(Math.random() * (cheeringWords.length));
                    
                    // Display a cheering word to the palyer for encouragement
                    modelMessageDiv.innerHTML = cheeringWords[index];
                    
                    score++;
                    streak++;
                    
                    scoreDiv.innerText = `Score: ${score}`;
                    streakDiv.innerText = `Streak: ${streak}/5`;
                }

                targetLetterdiv.innerText = letter;
            }
        }
        
    } else {
        // Make border of key red for incorrectly guessed letter
        event.target.classList.add('red-letter');
        characterImageIndex += 1

        // If the index of the characterImages array is out of bound
        // set it to last index. This is also indicative of a "Game Over"
        if(characterImageIndex > characterImages.length) {
            characterImageIndex = characterImages.length - 1;
        }

        // Display the correct hangman image
        hangmanImgTag.src = characterImages[characterImageIndex];

        // If reached last image index, the game is over
        if(characterImageIndex == characterImages.length - 1) {
            gameOverDiv.setAttribute('id', 'show-game-over');

            playAgainButton = document.getElementById('play-again');
            playAgainButton.addEventListener("click", resetGame);
        }
        
    }
}


// Create a set words to be displayed to the user
function createWordDisplay(words) {
    const wordDisplayTag = document.getElementById('word-display');

    currentWordMap.clear();

    words.forEach((word, index) => {
        const wordDiv = document.createElement('div');
        wordDiv.classList.add('word');
        correctGuess += word.length;

        for(let i = 0; i < word.length; i++) {
            let letter = word[i].toUpperCase();

            const letterDiv = document.createElement('div');
            letterDiv.classList.add('letter');

            let letterId = `w${index}-${i}` ;

            letterDiv.setAttribute('id', letterId);
            letterDiv.textContent = "";

            if(!currentWordMap.has(letter)) {
                currentWordMap.set(letter, [letterId]);
            } else {
                const it = currentWordMap.get(letter)
                
                it.push(letterId);
                currentWordMap.set(letter, it);
            }

            wordDiv.appendChild(letterDiv);
        }

        wordDisplayTag.appendChild(wordDiv);
    });
}

// Set the current category to the selected option from select tag
// And set the states to the corresponding category
function setCategory(event) {
    currentCategory = event.target.value;
    currentWordIndex = 0;

    characterImageIndex = 0;
    hangmanImgTag.src = characterImages[characterImageIndex++]; 

    cleanKeyBoard();
    cleanWordDisplay();

    createWordDisplay(hangmanWords[currentCategory]
        .words[currentWordIndex].split(" "));
}

// Clean the guess words from the screen to display the next set
function cleanWordDisplay() {
    const wordDisplayTag = document.getElementById('word-display');
    const wordsDiv = wordDisplayTag.getElementsByClassName('word');
    const wordsElements = Array.from(wordsDiv);

    wordsElements.forEach(el => {
        el.remove();
    });
}

// Cleans the key border to regular color for new game
// Removes the green and red color boder from the keys
// and enable the keys
function cleanKeyBoard() {
    const buttons = document.querySelectorAll('.keyboard-key');

    buttons.forEach(button => {
        if (button.disabled) {
            button.classList.remove('red-letter');
            button.classList.remove('green-letter');
            button.disabled = false;
        }
    });
}


// Sets the current game state to the next
function setNextGame() {
    // Set initial state for hangman image
    characterImageIndex = 0;
    hangmanImgTag.src = characterImages[characterImageIndex];

    // Clean the board and keys
    cleanKeyBoard();
    cleanWordDisplay();

    currentWordIndex++;

    // Get the next word to guess
    const wordSetSize = hangmanWords[currentCategory].words.length;

    // If reached the end of current game category, set 
    // the category to the next one. Else move onto the 
    // next set of words
    if(currentWordIndex >= wordSetSize) {
        categoriesCompleted.push(currentCategory);

        // If player played all categories, reset the game
        if(categoriesCompleted.length === 3) {
            resetGame();
            return;
        }
        
        // Update the current category to a new category
        for(let i = 0; i < allCategories.length; i++) {
            if(!categoriesCompleted.includes(allCategories[i])) {
                currentCategory = allCategories[i];
                currentWordIndex = 0;
                selectionTag.value = currentCategory;
            
                streak = 0;
                streakDiv.innerText = `Streak: ${streak}/5`;
            }
        }
    }

    // Get the next set of word to create and displays on the screen
    const newWordSet = hangmanWords[currentCategory].words[currentWordIndex].split(' ');
    
    createWordDisplay(newWordSet);
    // Hide the message model which contains the words of encouragement
    modelTag.setAttribute('id', 'hide-modal');
}

// Reset the game states
function resetGame() {
    gameOverDiv.setAttribute('id', 'hide-game-over')

    cleanWordDisplay();
    cleanKeyBoard();

    characterImageIndex = 0;
    hangmanImgTag.src = characterImages[characterImageIndex++]; 

    currentWordMap.clear();

    score = 0;
    streak = 0;
    correctGuess = 0;
    currentCategory = 0;
    currentWordIndex = 0;

    categoriesCompleted = [currentCategory];

    createWordDisplay(hangmanWords[currentCategory].words[currentWordIndex].split(" "));
}