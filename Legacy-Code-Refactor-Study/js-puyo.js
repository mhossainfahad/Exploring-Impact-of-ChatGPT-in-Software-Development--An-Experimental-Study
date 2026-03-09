const PUYO_SHAPES = [" ", "■", "○", "●", "◇", "◆", "△", "▲"];
const PUYO_COLORS = ["red", "blue", "green", "yellow", "purple"];
const BOARD_WIDTH = 6;
const BOARD_HEIGHT = 17;
let puyos = Array(BOARD_WIDTH * BOARD_HEIGHT).fill(0);
let currentPuyos = [];
let score = 0;

// Initialize the game board
const initPuyos = () => {
  // Fill the board with empty spaces
  puyos.fill(0);
  // Optionally add a couple of Puyos at the top
  for (let i = 0; i < BOARD_WIDTH; i++) {
    if (Math.random() < 0.2) {
      // 20% chance to start with a Puyo in this position
      puyos[i] = Math.floor(Math.random() * PUYO_COLORS.length) + 1;
    }
  }
};
// Render Puyos on the board
function renderPuyos(board) {
  let html = "";
  for (let i = 0; i < puyos.length; i++) {
    // Assign the appropriate color class based on the Puyo's value
    let colorClass = PUYO_COLORS[puyos[i]]
      ? ` puyo-${PUYO_COLORS[puyos[i]]}`
      : "";
    // Create the HTML for a Puyo piece
    html += `<div class="puyo${colorClass}"></div>`;

    // Add a new line for each row
    if ((i + 1) % BOARD_WIDTH === 0) {
      html += "<br>";
    }
  }
  board.innerHTML = html; // Update the board's HTML
}

// Logic for dropping Puyos from the top
const dropPuyos = () => {
  if (currentPuyos.length === 0) {
    let newPuyoPosition = Math.floor(Math.random() * BOARD_WIDTH);
    puyos[newPuyoPosition] = Math.floor(Math.random() * PUYO_COLORS.length) + 1;
    currentPuyos.push(newPuyoPosition);
  } else {
    let canMoveDown = true;
    for (let i = 0; i < currentPuyos.length; i++) {
      let position = currentPuyos[i];
      if (
        position >= BOARD_WIDTH * (BOARD_HEIGHT - 1) ||
        puyos[position + BOARD_WIDTH] !== 0
      ) {
        canMoveDown = false;
        break;
      }
    }
    if (canMoveDown) {
      for (let i = currentPuyos.length - 1; i >= 0; i--) {
        let position = currentPuyos[i];
        puyos[position] = 0;
        puyos[position + BOARD_WIDTH] =
          Math.floor(Math.random() * PUYO_COLORS.length) + 1;
        currentPuyos[i] += BOARD_WIDTH;
      }
    } else {
      currentPuyos = [];
    }
  }
};

// Logic to move Puyos left or right using arrow keys
const handleArrowKeyPress = (event) => {
  if (currentPuyos.length === 0) return;

  if (event.key === "ArrowLeft") {
    // Move left
    let newPosition = currentPuyos[0] - 1;
    if (
      newPosition % BOARD_WIDTH !== BOARD_WIDTH - 1 &&
      puyos[newPosition] === 0
    ) {
      puyos[newPosition] = puyos[currentPuyos[0]];
      puyos[currentPuyos[0]] = 0;
      currentPuyos[0] = newPosition;
    }
  } else if (event.key === "ArrowRight") {
    // Move right
    let newPosition = currentPuyos[0] + 1;
    if (newPosition % BOARD_WIDTH !== 0 && puyos[newPosition] === 0) {
      puyos[newPosition] = puyos[currentPuyos[0]];
      puyos[currentPuyos[0]] = 0;
      currentPuyos[0] = newPosition;
    }
  }
};

//
/* const updatePuyos = () => {
  // Check for matches in each column
  for (let col = 0; col < BOARD_WIDTH; col++) {
    for (let row = 0; row < BOARD_HEIGHT - 2; row++) {
      let index = row * BOARD_WIDTH + col;
      if (
        puyos[index] !== 0 &&
        puyos[index] === puyos[index + BOARD_WIDTH] &&
        puyos[index] === puyos[index + 2 * BOARD_WIDTH]
      ) {
        // Mark the matching Puyos for removal
        for (let k = 0; k < 3; k++) {
          puyos[index + k * BOARD_WIDTH] = 0;
        }
        score += 10; // Update score for each match
      }
    }
  }

  // Gravity - make Puyos fall down if there is space below
  for (let col = 0; col < BOARD_WIDTH; col++) {
    for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
      let index = row * BOARD_WIDTH + col;
      if (puyos[index] === 0 && row > 0 && puyos[index - BOARD_WIDTH] !== 0) {
        puyos[index] = puyos[index - BOARD_WIDTH];
        puyos[index - BOARD_WIDTH] = 0;
      }
    }
  }
}; */

// Logic to update Puyos on the board
const updatePuyos = () => {
  let hasChanged = false;

  // Apply gravity
  for (let i = puyos.length - BOARD_WIDTH; i >= 0; i--) {
    if (puyos[i] === 0 && puyos[i - BOARD_WIDTH] !== 0) {
      puyos[i] = puyos[i - BOARD_WIDTH];
      puyos[i - BOARD_WIDTH] = 0;
      hasChanged = true;
    }
  }

  if (hasChanged) {
    // Check for horizontal and vertical matches
    for (let i = 0; i < puyos.length; i++) {
      // Horizontal match check
      if (
        i % BOARD_WIDTH < BOARD_WIDTH - 2 &&
        puyos[i] !== 0 &&
        puyos[i] === puyos[i + 1] &&
        puyos[i] === puyos[i + 2]
      ) {
        // Mark matched Puyos for removal
        for (let k = 0; k < 3; k++) puyos[i + k] = 0;
        updateScore(10); // Update score for each match
      }

      // Vertical match check
      if (
        i < BOARD_WIDTH * (BOARD_HEIGHT - 2) &&
        puyos[i] !== 0 &&
        puyos[i] === puyos[i + BOARD_WIDTH] &&
        puyos[i] === puyos[i + 2 * BOARD_WIDTH]
      ) {
        // Mark matched Puyos for removal
        for (let k = 0; k < 3; k++) puyos[i + k * BOARD_WIDTH] = 0;
        updateScore(10); // Update score for each match
      }
    }
  }
};

// Update the score display
const updateScore = (points) => {
  score += points;
  document.querySelector(".score").textContent = `Score: ${score}`;
};

// Check if the game is over
const checkGameOver = () => {
  // Check the top row for any non-zero value, indicating no space left
  for (let i = 0; i < BOARD_WIDTH; i++) {
    if (puyos[i] !== 0) {
      return true;
    }
  }
  return false;
};

function startGame(board) {
  initPuyos(); // Initialize the Puyos array with random colors
  renderPuyos(board); // Render the initial state of the game board

  // Set up the game interval for dropping Puyos
  gameInterval = setInterval(() => {
    dropPuyos(); // Handle the dropping of new Puyos
    updatePuyos(); // Update the Puyos on the board, checking for matches
    renderPuyos(board); // Re-render the board after updates
    if (checkGameOver()) {
      // Check if the game is over
      clearInterval(gameInterval);
      alert("Game Over! Score: " + score);
    }
  }, 70);
}

const restartGame = () => {
  clearInterval(gameInterval);
  puyos.fill(0);
  score = 0;
  startGame();
};

document.addEventListener("DOMContentLoaded", () => {
  const board = document.querySelector(".board"); // Ensure this selector matches your HTML
  if (board) {
    startGame(board);
  } else {
    console.error("Board element not found");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    restartGame();
  } else if (event.key === "Escape") {
    clearInterval(gameInterval);
    alert("Game Quit");
  } else {
    handleArrowKeyPress(event);
  }
});
