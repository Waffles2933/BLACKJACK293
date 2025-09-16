// === ROULETTE GAME LOGIC ===

let currentChipValue = 1;
let bets = {}; // { betType: amount }
let playerChips = 1000;
let spinning = false;

const spinBtn = document.getElementById("spinBtn");
const clearBtn = document.getElementById("clearBtn");
const wheel = document.getElementById("wheel");
const status = document.getElementById("status");
const table = document.getElementById("bettingTable");
const chipButtons = document.querySelectorAll(".chip");

const rouletteNumbers = ["0", "00"].concat([...Array(36).keys()].map(n => (n+1).toString()));
const redNumbers = ["1","3","5","7","9","12","14","16","18","19","21","23","25","27","30","32","34","36"];
const blackNumbers = ["2","4","6","8","10","11","13","15","17","20","22","24","26","28","29","31","33","35"];

// Build table grid
function buildTable(){
  table.innerHTML = "";
  rouletteNumbers.forEach(num => {
    const spot = document.createElement("div");
    spot.classList.add("bet-spot");
    spot.dataset.bet = num;
    if(num === "0" || num==="00") spot.classList.add("green");
    else if(redNumbers.includes(num)) spot.classList.add("red");
    else spot.classList.add("black");
    spot.innerText = num;
    table.appendChild(spot);

    spot.addEventListener("click", () => placeBet(num, spot));
  });
}

buildTable();

function updateStatus(msg){
  status.innerText = msg + ` | Chips: ${playerChips}`;
}

// Chip selection
chipButtons.forEach(chip => {
  chip.addEventListener("click", () => {
    currentChipValue = parseInt(chip.dataset.value);
  });
});

function placeBet(bet, spot){
  if(playerChips < currentChipValue){
    updateStatus("Not enough chips!");
    return;
  }
  if(!bets[bet]) bets[bet]=0;
  bets[bet] += currentChipValue;
  playerChips -= currentChipValue;
  updateStatus(`Bet ${currentChipValue} on ${bet}`);

  let chipDiv = spot.querySelector(".chipOnBoard");
  if(!chipDiv){
    chipDiv = document.createElement("div");
    chipDiv.classList.add("chipOnBoard");
    spot.appendChild(chipDiv);
  }
  chipDiv.innerText = bets[bet];
}

// Clear bets
clearBtn.addEventListener("click", () => {
  bets = {};
  document.querySelectorAll(".chipOnBoard").forEach(c => c.remove());
  updateStatus("Bets cleared!");
});

// Spin wheel
spinBtn.addEventListener("click", () => {
  if(spinning || Object.keys(bets).length===0){
    updateStatus("Place at least one bet!");
    return;
  }

  spinning = true;
  const deg = 720 + Math.floor(Math.random()*360);
  wheel.style.transition = "transform 4s ease-out";
  wheel.style.transform = `rotate(${deg}deg)`;

  setTimeout(() => {
    const index = Math.floor(Math.random()*rouletteNumbers.length);
    const result = rouletteNumbers[index];
    resolveBets(result);
    spinning = false;
  }, 4000);
});

function resolveBets(result){
  let payout = 0;

  if(bets[result]) payout += bets[result]*35;
  if(redNumbers.includes(result) && bets["red"]) payout += bets["red"]*2;
  if(blackNumbers.includes(result) && bets["black"]) payout += bets["black"]*2;

  const numVal = parseInt(result);
  if(!isNaN(numVal)){
    if(numVal%2===0 && bets["even"]) payout += bets["even"]*2;
    if(numVal%2===1 && bets["odd"]) payout += bets["odd"]*2;
    if(numVal>=1 && numVal<=18 && bets["low"]) payout += bets["low"]*2;
    if(numVal>=19 && numVal<=36 && bets["high"]) payout += bets["high"]*2;
  }

  playerChips += payout;
  updateStatus(`Ball landed on ${result}! You won ${payout} chips!`);
  bets = {};
  document.querySelectorAll(".chipOnBoard").forEach(c => c.remove());
}

updateStatus("Place your bets!");
