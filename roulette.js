let chips = 1000;
let currentBet = 0;
let bets = {}; // store bets by cell number
let spinning = false;

// DOM refs
const chipsEl = document.getElementById("chips");
const statusEl = document.getElementById("status");
const boardEl = document.getElementById("bettingBoard");
const wheelEl = document.getElementById("wheel");

// Build betting board (0-36)
function buildBoard() {
  for (let i = 0; i <= 36; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.textContent = i;
    if (i === 0) cell.classList.add("green");
    else if ([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(i)) {
      cell.classList.add("red");
    } else {
      cell.classList.add("black");
    }
    cell.addEventListener("click", () => placeBet(i));
    boardEl.appendChild(cell);
  }
}

// Place bet
function placeBet(num) {
  if (currentBet > chips) {
    setStatus("Not enough chips for that bet!");
    return;
  }
  if (!bets[num]) bets[num] = 0;
  bets[num] += currentBet;
  chips -= currentBet;
  updateChips();
  setStatus(`Bet ${currentBet} on ${num}`);
}

// Spin wheel
function spinWheel() {
  if (spinning) return;
  spinning = true;

  let deg = Math.floor(Math.random() * 360) + 720; // 2+ spins
  wheelEl.style.transition = "transform 3s ease-out";
  wheelEl.style.transform = `rotate(${deg}deg)`;

  setTimeout(() => {
    let winningNum = Math.floor(Math.random() * 37); // 0-36
    settleBets(winningNum);
    spinning = false;
  }, 3200);
}

// Settle bets
function settleBets(winningNum) {
  let payout = 0;
  for (let num in bets) {
    if (parseInt(num) === winningNum) {
      payout += bets[num] * 35; // straight-up win
    }
  }
  if (payout > 0) {
    chips += payout;
    setStatus(`Ball landed on ${winningNum}! You won ${payout}!`);
  } else {
    setStatus(`Ball landed on ${winningNum}. You lost your bets.`);
  }
  bets = {}; // reset
  updateChips();
}

// Helpers
function updateChips() {
  chipsEl.textContent = chips;
}
function setStatus(msg) {
  statusEl.textContent = msg;
}

// Chip selector
document.querySelectorAll(".chip").forEach(btn => {
  btn.addEventListener("click", () => {
    currentBet = parseInt(btn.dataset.value);
    setStatus(`Selected chip value: ${currentBet}`);
  });
});

// Spin button
document.getElementById("spinBtn").addEventListener("click", spinWheel);

// Init
buildBoard();
updateChips();
