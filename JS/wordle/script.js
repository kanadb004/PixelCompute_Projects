let targetWord = '';
let currentGuessIndex = 0;
let gameOver = false;
const MAX_ATTEMPTS = 6;

const guessInput = document.getElementById('guessInput');
const submitBtn = document.getElementById('submitBtn');
const feedbackElement = document.getElementById('feedback');
const cells = document.querySelectorAll('.cell');

function initGame() {
  targetWord = selectRandomWord();
  currentGuessIndex = 0;
  gameOver = false;
  feedbackElement.textContent = '';
  feedbackElement.className = 'feedback-message';
  guessInput.disabled = false;
  guessInput.value = '';
  guessInput.focus();
  submitBtn.disabled = false;

  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
  });
}

function selectRandomWord() {
  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex].toLowerCase();
}

function submitGuess() {
  if (gameOver) return;

  const guess = guessInput.value.trim().toLowerCase();

  if (guess.length !== 5) {
    feedbackElement.textContent = 'Please enter a 5-letter word!';
    feedbackElement.className = 'feedback-message error';
    return;
  }

  if (!wordList.includes(guess)) {
    feedbackElement.textContent = 'Word not in word list!';
    feedbackElement.className = 'feedback-message error';
    return;
  }

  processGuess(guess);

  if (guess === targetWord) {
    gameOver = true;
    feedbackElement.textContent = 'Congratulations! You guessed the word!';
    feedbackElement.className = 'feedback-message success';
    guessInput.disabled = true;
    submitBtn.disabled = true;
    return;
  }

  currentGuessIndex++;

  if (currentGuessIndex >= MAX_ATTEMPTS) {
    gameOver = true;
    feedbackElement.textContent = `Game over, the word was "${targetWord}"`;
    feedbackElement.className = 'feedback-message error';
    guessInput.disabled = true;
    submitBtn.disabled = true;
    return;
  }

  guessInput.value = '';
  guessInput.focus();
  feedbackElement.textContent = '';
  feedbackElement.className = 'feedback-message';
}

function processGuess(guess) {
  const startIndex = currentGuessIndex * 5;
  
  const letterCounts = {};
  for (let i = 0; i < 5; i++) {
    const letter = targetWord[i];
    letterCounts[letter] = (letterCounts[letter] || 0) + 1;
  }

  const cellStates = [];
  for (let i = 0; i < 5; i++) {
    const cellIndex = startIndex + i;
    const letter = guess[i];
    const cell = cells[cellIndex];
    cell.textContent = letter;

    if (letter === targetWord[i]) {
      cellStates.push('correct');
      letterCounts[letter]--;
    } else {
      cellStates.push('notChecked');
    }
  }

  for (let i = 0; i < 5; i++) {
    const cellIndex = startIndex + i;
    const letter = guess[i];
    
    if (cellStates[i] === 'correct') {
      cells[cellIndex].classList.add('correct');
    } else if (letterCounts[letter] > 0 && targetWord.includes(letter)) {
      cells[cellIndex].classList.add('present');
      letterCounts[letter]--;
    } else {
      cells[cellIndex].classList.add('absent');
    }
  }
}

submitBtn.addEventListener('click', submitGuess);
guessInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    submitGuess();
  }
});

window.addEventListener('DOMContentLoaded', initGame);
