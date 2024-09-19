// Initialize variables
const wordDisplay = document.getElementById('word-display');
const typingInput = document.getElementById('typing-input');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const resetBtn = document.getElementById('reset-btn');
const lengthButtons = document.querySelectorAll('.length-btn');

let words = [];
let currentWordIndex = 0;
let typedWords = [];
let spaceCount = 0;
let startTime, endTime;
let wordCount = 10;  // Default word count
let typingActive = false;
let correctWords = 0;  // To track the number of correct words

// Word bank
const wordBank = [
    'which', 'more', 'they', 'over', 'school', 'through', 'than', 'can', 'lead', 'increase',
    'govern', 'help', 'system', 'possible', 'stand', 'both', 'run', 'real', 'first', 'nation',
    'great', 'right', 'down', 'ask', 'show', 'hold', 'give', 'may', 'about', 'many', 'must',
    'start', 'use', 'find', 'work', 'place', 'since', 'might', 'other', 'come', 'know',
    'part', 'take', 'back', 'same', 'place', 'new', 'own', 'best', 'show', 'case',
    'number', 'where', 'while', 'around', 'often', 'next', 'large', 'use', 'such', 'make',
    'take', 'look', 'mean', 'those', 'leave', 'each', 'might', 'know', 'home', 'side',
    'right', 'head', 'point', 'every', 'money', 'group', 'plan', 'under', 'part', 'keep',
    'ask', 'come', 'even', 'give', 'case', 'line', 'hand', 'small', 'stand', 'way',
    'turn', 'face', 'might', 'open', 'play', 'move', 'care', 'stand', 'show', 'start',
    'clear', 'head', 'learn', 'build', 'change', 'large', 'state', 'follow', 'reach', 'bring',
    'study', 'form', 'write', 'trust', 'avoid', 'think', 'close', 'draw', 'cause', 'plan',
    'often', 'start', 'need', 'cover', 'speak', 'find', 'turn', 'never', 'answer', 'build'
];


// Event listener for word length buttons
lengthButtons.forEach(button => {
    button.addEventListener('click', function() {
        wordCount = parseInt(this.textContent);
        resetTest();
    });
});

// Function to start the test
function startTest() {
    typingActive = true;
    startTime = new Date().getTime();
    typingInput.focus();
}

// Function to reset the test
function resetTest() {
    typingInput.value = '';
    currentWordIndex = 0;
    typedWords = [];
    correctWords = 0;
    spaceCount = 0;
    generateWords();
    displayWords();
    updateStats('--', '--');
    typingActive = false;
}

// Function to generate random words
function generateWords() {
    words = [];
    for (let i = 0; i < wordCount; i++) {
        const randomWord = wordBank[Math.floor(Math.random() * wordBank.length)];
        words.push(randomWord);
    }
}

// Function to display the generated words (no numbering)
function displayWords() {
    wordDisplay.innerHTML = words.map((word, index) => `<span id="word-${index}">${word}</span>`).join(' ');
}

// Function to calculate WPM and accuracy
function calculateResults() {
    endTime = new Date().getTime();
    const timeDiff = (endTime - startTime) / 1000 / 60;  // Time in minutes
    const wordsTyped = typedWords.length;

    // WPM calculation
    const wpm = Math.round((wordsTyped / timeDiff));

    // Accuracy calculation
    const accuracy = Math.round((correctWords / wordsTyped) * 100);

    updateStats(wpm, accuracy);
}

// Function to update stats display
function updateStats(wpm, accuracy) {
    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = accuracy;
}

// Event listener for typing input
typingInput.addEventListener('input', function() {
    if (!typingActive) startTest();
});

// Event listener for space key to validate and move to next word
typingInput.addEventListener('keydown', function(event) {
    if (event.key === ' ') {
        event.preventDefault();  // Prevent default space behavior

        // Get the current word from input and trim it
        const typedWord = typingInput.value.trim();
        typedWords.push(typedWord);

        // Check the typed word against the current word in the word display
        const currentWord = words[currentWordIndex];
        const currentWordElement = document.getElementById(`word-${currentWordIndex}`);

        if (typedWord === currentWord) {
            currentWordElement.style.color = 'green';
            correctWords++;  // Increase correct word count
        } else {
            currentWordElement.style.color = 'red';
        }

        typingInput.value = '';  // Clear the input box for the next word
        currentWordIndex++;
        spaceCount++;

        // Check if the user has typed the last word (game ends without needing a final space)
        if (currentWordIndex >= wordCount) {
            calculateResults();
            typingActive = false;
        }
    }
});

// Event listener for typing the last word (without needing space key to finish)
typingInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && currentWordIndex === wordCount - 1) {
        event.preventDefault();

        // Check the last typed word
        const typedWord = typingInput.value.trim();
        typedWords.push(typedWord);

        const currentWord = words[currentWordIndex];
        const currentWordElement = document.getElementById(`word-${currentWordIndex}`);

        if (typedWord === currentWord) {
            currentWordElement.style.color = 'green';
            correctWords++;
        } else {
            currentWordElement.style.color = 'red';
        }

        typingInput.value = '';  // Clear input for any reset
        calculateResults();  // Final calculation
        typingActive = false;
    }
});

// Event listener for reset button
resetBtn.addEventListener('click', resetTest);

// Event listener for 'Enter' key to reset the test
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && currentWordIndex >= wordCount) {
        resetTest();
    }
});

// Initialize test
resetTest();
