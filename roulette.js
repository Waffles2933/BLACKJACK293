// === ROULETTE GAME LOGIC ===

let currentChipValue = 1;
let bets = {}; // { betType: amount }
let playerChips = 1000;
let spinning = false;

// DOM Elements
const spinBtn = document.getElementById("spinBtn");
const clearBtn = document.getElementById("clearBtn");
const wheel = document.getElementById("wheel");
const status = document.getElementById("status");
const numbersContainer = document.getElementById("numbers");
const chipButtons = document.querySelectorAll(".chip");

// American Roulette numbers
const rouletteNumbers = ["0", "00"].concat([...Array(36).keys()].map(n => (n+1).toString()));

// Color mapping
const redNumbers = ["1","3","5","7","9","12","14","16","18","19","21","23","25","27","30","32","34","36"];
const blackNumbers = ["2","4","6","8","10","11","13","15","17","20","22","24","26","28","29","31","33","35"];

// Generate betting numbers
numbersContainer.innerHTML = "";
rouletteNumbers.forEach(num => {
  const div = document.createElement("div");
  div.classList.add("bet-spot");
  div.dataset.bet = num;
  div.innerText = num;
  numbersContainer.appendChild(div);
});

// Update status and chips
function updateStatus(msg){
  status.innerText = msg + ` | Chips: ${playerChips}`;
}

// Select chip value
chipButtons.forEach(chip => {
  chip.addEventListener("click", () => {
    currentChipValue = parseInt(chip.dataset.value);
  });
});

// Place bet
document.querySelectorAll(".bet-spot").forEach(spot => {
  spot.addEventListener("click", () => {
    const bet = spot.dataset.bet;
    if (playerChips < currentChipValue) {
      updateStatus("Not enough chips to place bet!");
      return;
    }

    if (!bets[bet]) bets[bet] = 0;
    bets[bet] += currentChipValue;
    playerChips -= currentChipValue;
    updateStatus(`Bet ${currentChipValue} on ${bet}`);

    // Show chip on board
    let chipDiv = spot.querySelector(".chipOnBoard");
    if (!chipDiv) {
      chipDiv = document.createElement("div");
      chipDiv.classList.add("chipOnBoard");
      spot.appendChild(chipDiv);
    }
    chipDiv.innerText = bets[bet];
  });
});

// Clear bets
clearBtn.addEventListener("click", () => {
  bets = {};
  document.querySelectorAll(".chipOnBoard").forEach(c => c.remove());
  updateStatus("Bets cleared!");
});

// Determine result and payouts
function resolveBets(result){
  let payout = 0;

  // Number bet
  if(bets[result]) payout += bets[result] * 35;

  // Color bets
  if(redNumbers.includes(result) && bets["red"]) payout += bets["red"] * 2;
  if(blackNumbers.includes(result) && bets["black"]) payout += bets["black"] * 2;

  // Even/Odd
  const numVal = parseInt(result);
  if(!isNaN(numVal)){
    if(numVal % 2 === 0 && bets["even"]) payout += bets["even"] * 2;
    if(numVal % 2 === 1 && bets["odd"]) payout += bets["odd"] * 2;
  }

  // High/Low
  if(!isNaN(numVal)){
    if(numVal >= 1 && numVal <= 18 && bets["low"]) payout += bets["low"] * 2;
    if(numVal >= 19 && numVal <= 36 && bets["high"]) payout += bets["high"] * 2;
  }

  playerChips += payout;
  updateStatus(`Ball landed on ${result}! You won ${payout} chips!`);
  bets = {};
  document.querySelectorAll(".chipOnBoard").forEach(c => c.remove());
}

// Spin the wheel
spinBtn.addEventListener("click", () => {
  if(spinning || Object.keys(bets).length === 0){
    updateStatus("Place at least one bet before spinning!");
    return;
  }

  spinning = true;
  const spinDeg = 720 + Math.floor(Math.random() * 360);
  wheel.style.transition = "transform 4s ease-out";
  wheel.style.transform = `rotate(${spinDeg}deg)`;

  setTimeout(() => {
    // Random number result
    const randIndex = Math.floor(Math.random() * rouletteNumbers.length);
    const result = rouletteNumbers[randIndex];
    resolveBets(result);
    spinning = false;
  }, 4000);
});

updateStatus("Place your bets!");
