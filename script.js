let deck = []; // Declare the deck globally
let deckValue = [];
let playerHand = [];
let playerValue = [];
let dealerHand = [];
let dealerValue = [];
let betAmount = 0;
let bank = 500;

// Function to initialize the deck
function initializeDeck() {
    deck = [
        '2H', '2D', '2C', '2S',
        '3H', '3D', '3C', '3S',
        '4H', '4D', '4C', '4S',
        '5H', '5D', '5C', '5S',
        '6H', '6D', '6C', '6S',
        '7H', '7D', '7C', '7S',
        '8H', '8D', '8C', '8S',
        '9H', '9D', '9C', '9S',
        'JH', 'QD', 'KC', 'QS',
        'JH', 'JD', 'JC', 'JS',
        'QH', 'QD', 'QC', 'QS',
        'KH', 'KD', 'KC', 'KS',
        'AH', 'AD', 'AC', 'AS'
    ];

    deckValue = [
        '2', '2', '2', '2',
        '3', '3', '3', '3',
        '4', '4', '4', '4',
        '5', '5', '5', '5',
        '6', '6', '6', '6',
        '7', '7', '7', '7',
        '8', '8', '8', '8',
        '9', '9', '9', '9',
        'J', 'Q', 'K', 'A',
        'J', 'J', 'J', 'J',
        'Q', 'Q', 'Q', 'Q',
        'K', 'K', 'K', 'K',
        'A', 'A', 'A', 'A'
    ];
    alert("The deck has been shuffled!");
}

// Shuffle Decks
function shuffleDeck(array1, array2) {
    if (array1.length !== array2.length) {
        throw new Error("Both arrays must have the same length.");
    }

    // Create an array of indices
    const indices = Array.from({ length: array1.length }, (_, i) => i);

    // Shuffle the indices
    for (let i = indices.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[randomIndex]] = [indices[randomIndex], indices[i]];
    }

    // Rearrange both arrays based on the shuffled indices
    const shuffledArray1 = indices.map(i => array1[i]);
    const shuffledArray2 = indices.map(i => array2[i]);

    deck = shuffledArray1
    deckValue = shuffledArray2
}

// Function to deal a card
function dealCard(hand1, hand2) {
    if (deck.length === 0) {
        initializeDeck();
        shuffleDeck(deck, deckValue);
    }

    const card1 = deck.shift();
    hand1.push(card1);
    
    const card2 = deckValue.shift();
    hand2.push(card2);
}

function calculateScore(hand) {
    let score = 0;
    let aces = 0;

    for (const card of hand) {
        const cardValue = card.length === 2 ? card[0] : card.slice(0, 2); // Get the card value (e.g., '2', 'J', 'A', '10')

        if (['J', 'Q', 'K'].includes(cardValue)) {
            score += 10; // Face cards are worth 10 points
        } else if (cardValue === 'A') {
            aces += 1; // Count the Ace
            score += 11; // Initially count Ace as 11
        } else {
            score += parseInt(cardValue); // Add the numeric value of the card
        }
    }

    // Adjust for Aces if score exceeds 21
    while (score > 21 && aces > 0) {
        score -= 10; // Count one Ace as 1 instead of 11
        aces -= 1; // Reduce the count of Aces
    }

    return score; // Return the final score
}

// Function to check for Blackjack
function checkForBlackjack(hand) {
    return hand.length === 2 && calculateScore(hand) === 21;
}

// Function to reset the game
function resetGame() {
    // Show the bet input and start button
    document.getElementById('all-in').style.display = 'inline-block';
    document.getElementById('bet-input').style.display = 'inline-block';
    document.getElementById('start-button').style.display = 'inline-block';

    disableButtons()

    // Clear hands and results
    playerHand = [];
    dealerHand = [];
    document.getElementById('bet-display').innerText = '';
    document.getElementById('result').innerText = '';
    document.getElementById('dealer-cards').innerHTML = '';
    document.getElementById('player-cards').innerHTML = '';
}

function startGame() {
    betAmount = parseFloat(document.getElementById('bet-input').value);
    if (isNaN(betAmount) || betAmount <= 0) {
        alert('Please enter a valid bet amount.');
        return;
    }

    if (betAmount > bank) {
        alert("You don't have this much money");
        return;
    }

    if (bank === 0) {
        alert('You have run out of money.');
    }

    // Hide the bet input and start button
    document.getElementById('all-in').style.display = 'none';
    document.getElementById('bet-input').style.display = 'none';
    document.getElementById('start-button').style.display = 'none';

    disableButtons();

    // Show the bet amount
    document.getElementById('bet-display').innerText = `You bet: $${betAmount}`;

    // Shuffle the deck
    shuffleDeck(deck, deckValue);

    playerHand = [];
    dealerHand = [];
    dealCard(playerHand, playerValue);
    dealCard(dealerHand, dealerValue);
    dealCard(playerHand, playerValue);
    dealCard(dealerHand, dealerValue);
    revealCards();
    setupDealerCards();

    enableButtons();
}

function displayResult() {
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);
    let resultMessage = '';

    if (playerScore > 21) {
        resultMessage = 'You busted! Dealer wins.';
        subtractMoney(betAmount);
    } else if (dealerScore > 21) {
        resultMessage = 'Dealer busted! You win!';
        addMoney(betAmount * 0.993); // 0.7% house advantage
    } else if (playerScore === dealerScore) {
        resultMessage = 'It\'s a tie!';
    } else if (playerScore > dealerScore) {
        resultMessage = 'You win!';
        addMoney(betAmount * 0.993); // 0.7% house advantage
    } else {
        resultMessage = 'Dealer wins!';
        subtractMoney(betAmount);
    }

    disableButtons();

    document.getElementById('result').innerText = resultMessage;

    setTimeout(resetGame, 3000); // Adjust the delay as needed
}

function revealCards() {
    const playerCardsDiv = document.getElementById('player-cards');

    // Wipe the divs clean afterward
    while (playerCardsDiv.firstChild) {
        playerCardsDiv.removeChild(playerCardsDiv.firstChild);
    }

    playerHand.forEach((card, index) => {
        if (index < 5) { // Limit to 5 cards
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            cardDiv.style.backgroundImage = `url('https://deckofcardsapi.com/static/img/${card}.png')`; // Using a public card sprite API
            playerCardsDiv.appendChild(cardDiv);
        }
    });

    document.getElementById('player-score').innerText = ` (Score: ${calculateScore(playerHand)})`;

    // Check for Blackjack
    if (calculateScore(playerHand) == 21) {
        disableButtons();
        revalDealerCards();
        document.getElementById('result').innerText = 'Blackjack! You win!';
        addMoney(betAmount);
        setTimeout(resetGame, 3000); // Adjust the delay as needed
        return;
    } else if (calculateScore(dealerHand) == 21) {
        disableButtons();
        revalDealerCards();
        document.getElementById('result').innerText = 'Dealer has Blackjack! Dealer wins.';
        subtractMoney(betAmount);
        setTimeout(resetGame, 3000); // Adjust the delay as needed
        return;
    }
}

function setupDealerCards() {
    const dealerCardsDiv = document.getElementById('dealer-cards');

    while (dealerCardsDiv.firstChild) {
        dealerCardsDiv.removeChild(dealerCardsDiv.firstChild);
    }

    dealerStartingScore = 0

    dealerHand.forEach((card, index) => {
        if (index < 1) { // Limit to 5 cards
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            cardDiv.style.backgroundImage = `url('https://deckofcardsapi.com/static/img/${card}.png')`; // Using a public card sprite API
            dealerCardsDiv.appendChild(cardDiv);

            const facedownCard = document.createElement('div');
            facedownCard.className = 'card';
            facedownCard.style.backgroundImage = `url('https://deckofcardsapi.com/static/img/back.png')`; // Using a public card sprite API
            dealerCardsDiv.appendChild(facedownCard);

            const scoreCard = [card];
            dealerStartingScore = calculateScore(scoreCard)
        }
    });

    document.getElementById('dealer-score').innerText = ` (Score: ${dealerStartingScore})`;
}

function revalDealerCards() {
    const dealerCardsDiv = document.getElementById('dealer-cards');

    while (dealerCardsDiv.firstChild) {
        dealerCardsDiv.removeChild(dealerCardsDiv.firstChild);
    }

    dealerHand.forEach((card, index) => {
        if (index < 5) { // Limit to 5 cards
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            cardDiv.style.backgroundImage = `url('https://deckofcardsapi.com/static/img/${card}.png')`; // Using a public card sprite API
            dealerCardsDiv.appendChild(cardDiv);
        }
    });

    document.getElementById('dealer-score').innerText = ` (Score: ${calculateScore(dealerHand)})`;
}

function disableButtons() {
    document.getElementById('hit-button').style.display = 'none';
    document.getElementById('stand-button').style.display = 'none';
    document.getElementById('double-button').style.display = 'none';
    document.getElementById('surrender').style.display = 'none';
}

function enableButtons() {
    document.getElementById('hit-button').style.display = 'inline-block';
    document.getElementById('stand-button').style.display = 'inline-block';
    document.getElementById('double-button').style.display = 'inline-block';
    document.getElementById('surrender').style.display = 'inline-block';
}

function addMoney(money) {
    bank += money;
    bank = roundToHundredth(bank);
    document.getElementById('banktext').innerText = `Current Bank: $${bank}`;
}

function subtractMoney(money) {
    bank -= money;
    bank = roundToHundredth(bank);
    document.getElementById('banktext').innerText = `Current Bank: $${bank}`;
}

function roundToHundredth(num) {
    return Math.round(num * 100) / 100;
}

// Event listeners for buttons
document.getElementById('start-button').addEventListener('click', startGame);

document.getElementById('hit-button').addEventListener('click', () => {
    dealCard(playerHand, playerValue);
    revealCards();
    if (calculateScore(playerHand) > 21) {
        revealCards();
        displayResult();
    }
    document.getElementById('surrender').style.display = 'none';
});

document.getElementById('stand-button').addEventListener('click', () => {
    disableButtons();
    while (calculateScore(dealerHand) < 17 || (calculateScore(dealerHand) === 17 && dealerHand.some(card => card.includes('A')))) {
        dealCard(dealerHand, dealerValue);
    }
    revalDealerCards();
    displayResult();
});

document.getElementById('double-button').addEventListener('click', () => {
    if(betAmount*2 > bank) {
        alert("You don't have enough money to double right now");
        return;
    }
    betAmount = betAmount * 2;
    dealCard(playerHand, playerValue);
    revealCards();

    disableButtons();
    while (calculateScore(dealerHand) < 17 || (calculateScore(dealerHand) === 17 && dealerHand.some(card => card.includes('A')))) {
        dealCard(dealerHand, dealerValue);
    }
    revalDealerCards();
    displayResult();

    document.getElementById('bet-display').innerText = `You bet: $${betAmount}`;
});

document.getElementById('surrender').addEventListener('click', () => {
    resetGame();
    subtractMoney(betAmount / 2)
});

document.getElementById('bet-input').addEventListener('input', (event) => {
    betAmount = parseFloat(event.target.value) || 0;
});

document.getElementById('all-in').addEventListener('click', () => {
    betAmount = bank;
     // Hide the bet input and start button
     document.getElementById('all-in').style.display = 'none';
     document.getElementById('bet-input').style.display = 'none';
     document.getElementById('start-button').style.display = 'none';
 
     disableButtons();
 
     // Show the bet amount
     document.getElementById('bet-display').innerText = `You bet: $${betAmount}`;
 
     // Shuffle the deck
     shuffleDeck(deck, deckValue);
 
     playerHand = [];
     dealerHand = [];
     dealCard(playerHand, playerValue);
     dealCard(dealerHand, dealerValue);
     dealCard(playerHand, playerValue);
     dealCard(dealerHand, dealerValue);
     revealCards();
     setupDealerCards();
 
     enableButtons();
});

document.getElementById('dynamicButton').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default anchor behavior

    // Add logic to decide which link to open
    const randomChoice = Math.random() < 0.5; // 50% chance
    const link = randomChoice 
        ? "https://www.youtube.com/watch?v=dQw4w9WgXcQ" // First link
        : "https://www.youtube.com/watch?v=At8v_Yc044Y"; // Second link

    window.location.href = link; // Redirect to the chosen link
});
