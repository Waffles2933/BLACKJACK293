let currentChipValue = 1;
let bets = {};
let spinning = false;

const spinBtn = document.getElementById("spinBtn");
const clearBtn = document.getElementById("clearBtn");
const wheel = document.getElementById("wheel");
const status = document.getElementById("status");
const numbersContainer = document.getElementById("numbers");

// Generate number spots (0, 00, 1–36)
["0", "00"].concat([...Array(36).keys()].map(n => n+1)).forEach(num => {
  const div = document.createElement("div");
  div.classList.add("bet-spot");
  div.dataset.bet = num;
  div.innerText = num;
  numbersContainer.appendChild(div);
});

// Chip selection
document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    currentChipValue = parseInt(chip.dataset.value);
  });
});

// Place bets
document.querySelectorAll(".bet-spot").forEach(spot => {
  spot.addEventListener("click", () => {
    const bet = spot.dataset.bet;
    if (!bets[bet]) bets[bet] = 0;
    bets[bet] += currentChipValue;

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
  status.innerText = "Bets cleared!";
});

// Spin wheel
spinBtn.addEventListener("click", () => {
  if (spinning) return;
  spinning = true;

  const spinDeg = 720 + Math.floor(Math.random() * 360);
  wheel.style.transform = `rotate(${spinDeg}deg)`;

  setTimeout(() => {
    const result = Math.floor(Math.random() * 38); // 0–37
    const number = result === 37 ? "00" : result.toString();
    status.innerText = `Ball landed on ${number}!`;

    // TODO: payout logic here

    spinning = false;
  }, 4000);
});
