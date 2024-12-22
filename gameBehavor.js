// Game of 21 - Casino Edition
// Created by Michael Reynolds
// Last Updated: 2024-12-21

// Game state variables
let myTotal = 0;
let dealerTotal = 0;
let isSoundOn = true;
let gameInProgress = false;
let playerCards = [];
let dealerCards = [];

// Initialize audio elements after DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAudio();
});

// Function to initialize audio elements
function initializeAudio() {
    // Initialize audio elements
    window.backgroundMusic = document.getElementById('backgroundMusic');
    window.cardSound = document.getElementById('cardSound');
    window.winSound = document.getElementById('winSound');
    window.loseSound = document.getElementById('loseSound');

    // Set initial volumes
    if (backgroundMusic) {
        backgroundMusic.volume = 0.3;
    }
    if (cardSound) {
        cardSound.volume = 0.5;
    }
    if (winSound) {
        winSound.volume = 0.5;
    }
    if (loseSound) {
        loseSound.volume = 0.5;
    }

    // Add error handling for audio loading
    const audioElements = [backgroundMusic, cardSound, winSound, loseSound];
    audioElements.forEach(audio => {
        if (audio) {
            audio.addEventListener('error', function() {
                console.error('Error loading audio:', audio.src);
            });
        }
    });

    // Try to load and play background music
    if (backgroundMusic) {
        backgroundMusic.load();
        const playPromise = backgroundMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Auto-play prevented:", error);
                // Update UI to show sound is off
                const soundControl = document.getElementById('soundControl');
                if (soundControl) {
                    soundControl.textContent = '';
                    isSoundOn = false;
                }
            });
        }
    }
}

// Function to toggle sound
function toggleSound() {
    isSoundOn = !isSoundOn;
    const soundControl = document.getElementById('soundControl');
    
    if (isSoundOn) {
        soundControl.textContent = '';
        if (backgroundMusic) {
            const playPromise = backgroundMusic.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Playback prevented:", error);
                });
            }
        }
    } else {
        soundControl.textContent = '';
        if (backgroundMusic) {
            backgroundMusic.pause();
        }
    }
}

// Function to play sound effects with error handling
function playSound(sound) {
    if (isSoundOn && sound) {
        sound.currentTime = 0;
        const playPromise = sound.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Sound effect playback prevented:", error);
            });
        }
    }
}

// Function to get a random card
function getCard() {
    const card = Math.floor(Math.random() * 11) + 1;
    playSound(cardSound);
    return card;
}

// Function to format cards for display
function formatCards(cards) {
    return cards.join(' + ');
}

// Function to check for blackjack
function checkBlackjack(total) {
    return total === 21;
}

// Function to update the game display
function updateScreen() {
    let gameDisplay = `
        <h1>Casino Royale - Game of 21</h1>
        <div class="score">
            <p>Your Cards: ${formatCards(playerCards)} = ${myTotal}</p>
            <p>Dealer Cards: ${formatCards(dealerCards)} = ${dealerTotal}</p>
        </div>
    `;

    // Check game state and display appropriate message
    if (myTotal > 21) {
        gameDisplay += "<p class='winning-message' style='color: red'>Bust! You went over 21!</p>";
        playSound(loseSound);
        gameInProgress = false;
    }
    else if (dealerTotal > 21) {
        gameDisplay += "<p class='winning-message' style='color: #00ff00'>Dealer Bust! You win!</p>";
        playSound(winSound);
        gameInProgress = false;
    }
    else if (checkBlackjack(myTotal)) {
        gameDisplay += "<p class='winning-message' style='color: #00ff00'>Blackjack! You win!</p>";
        playSound(winSound);
        gameInProgress = false;
    }
    else if (checkBlackjack(dealerTotal)) {
        gameDisplay += "<p class='winning-message' style='color: red'>Dealer Blackjack! House wins!</p>";
        playSound(loseSound);
        gameInProgress = false;
    }

    // Update the display
    document.getElementById("gameArea").innerHTML = gameDisplay;
}

// Function for player's hit action
function hitMe() {
    if (!gameInProgress) return;
    
    const newCard = getCard();
    playerCards.push(newCard);
    myTotal += newCard;
    
    if (dealerTotal < 17) {
        const dealerCard = getCard();
        dealerCards.push(dealerCard);
        dealerTotal += dealerCard;
    }

    updateScreen();
}

// Function for player's stay action
function stay() {
    if (!gameInProgress) return;
    
    while (dealerTotal < 17) {
        const dealerCard = getCard();
        dealerCards.push(dealerCard);
        dealerTotal += dealerCard;
    }

    let gameDisplay = `
        <h1>Game Over!</h1>
        <div class="score">
            <p>Your Cards: ${formatCards(playerCards)} = ${myTotal}</p>
            <p>Dealer Cards: ${formatCards(dealerCards)} = ${dealerTotal}</p>
        </div>
    `;

    if (dealerTotal > 21 || myTotal > dealerTotal) {
        gameDisplay += "<p class='winning-message' style='color: #00ff00'>Congratulations! You win!</p>";
        playSound(winSound);
    }
    else if (myTotal < dealerTotal) {
        gameDisplay += "<p class='winning-message' style='color: red'>House wins!</p>";
        playSound(loseSound);
    }
    else {
        gameDisplay += "<p class='winning-message'>It's a tie!</p>";
    }

    gameInProgress = false;
    document.getElementById("gameArea").innerHTML = gameDisplay;
}

// Function to start a new game
function newGame() {
    // Reset game state
    myTotal = 0;
    dealerTotal = 0;
    playerCards = [];
    dealerCards = [];
    gameInProgress = true;

    // Deal initial cards
    for (let i = 0; i < 2; i++) {
        const playerCard = getCard();
        playerCards.push(playerCard);
        myTotal += playerCard;
    }
    
    const dealerCard = getCard();
    dealerCards.push(dealerCard);
    dealerTotal = dealerCard;

    // Start background music if sound is on
    if (isSoundOn && backgroundMusic.paused) {
        const playPromise = backgroundMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Playback prevented:", error);
            });
        }
    }

    updateScreen();
}

// Initialize the game when the page loads
window.onload = function() {
    newGame();
};