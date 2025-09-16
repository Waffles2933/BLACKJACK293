// === Roulette Game JS ===

// DOM Elements
const wheelEl = document.getElementById('wheel');
const tableEl = document.getElementById('bettingTable');
const chipContainer = document.getElementById('chip-container');
const playerChipsEl = document.getElementById('chips');
const spinBtn = document.getElementById('spinBtn');
const clearBetsBtn = document.getElementById('clearBetsBtn');
const statusEl = document.getElementById('status');
const notificationEl = document.getElementById('notification');

let playerChips = 1000;
let selectedChip = 10;
let bets = {}; // key = number, value = amount

// === Setup Betting Table ===
function createTable() {
    tableEl.innerHTML = '';
    for (let i = 0; i <= 36; i++) {
        const cell = document.createElement('div');
        cell.className = 'number-cell';
        cell.dataset.number = i;

        if (i === 0) {
            cell.classList.add('green');
        } else if ([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(i)) {
            cell.classList.add('red');
        } else {
            cell.classList.add('black');
        }

        cell.textContent = i;
        cell.addEventListener('click', () => placeBet(i));
        tableEl.appendChild(cell);
    }
}

// === Chip Selection ===
chipContainer.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
        selectedChip = parseInt(chip.dataset.value);
        showStatus(`Selected chip: ${selectedChip}`);
    });
});

// === Place Bet ===
function placeBet(number) {
    if (playerChips < selectedChip) {
        showStatus('Not enough chips!');
        return;
    }

    bets[number] = (bets[number] || 0) + selectedChip;
    playerChips -= selectedChip;
    updateChips();
    highlightBet(number);
}

// Highlight placed bet
function highlightBet(number) {
    const cell = tableEl.querySelector(`[data-number='${number}']`);
    if(cell) cell.classList.add('bet-placed');
}

// Update chip display
function updateChips() {
    playerChipsEl.textContent = playerChips;
}

// === Clear Bets ===
clearBetsBtn.addEventListener('click', () => {
    for (const number in bets) {
        const cell = tableEl.querySelector(`[data-number='${number}']`);
        if (cell) cell.classList.remove('bet-placed');
    }
    // Refund chips
    for (const number in bets) {
        playerChips += bets[number];
    }
    bets = {};
    updateChips();
    showStatus('Bets cleared.');
});

// === Spin Wheel ===
function spinWheel() {
    if (Object.keys(bets).length === 0) {
        showStatus('Place at least one bet!');
        return;
    }

    const winningNumber = Math.floor(Math.random() * 37); // 0-36
    showNotification(`Winning number: ${winningNumber}`);

    // Payouts: 35:1 for single number
    if (bets[winningNumber]) {
        const winnings = bets[winningNumber] * 36; // payout = 35 + original bet
        playerChips += winnings;
        showStatus(`You won ${winnings} chips on ${winningNumber}!`);
    } else {
        showStatus(`You lost this round. Winning number: ${winningNumber}`);
    }

    // Reset bets
    for (const number in bets) {
        const cell = tableEl.querySelector(`[data-number='${number}']`);
        if (cell) cell.classList.remove('bet-placed');
    }
    bets = {};
    updateChips();
}

// Notification
function showNotification(msg) {
    notificationEl.textContent = msg;
    notificationEl.style.opacity = 1;
    setTimeout(() => {
        notificationEl.style.opacity = 0;
    }, 3000);
}

// Status
function showStatus(msg) {
    statusEl.textContent = msg;
}

// === Wheel Visual ===
function animateWheel() {
    const degrees = Math.floor(Math.random() * 360) + 720; // spin at least 2 turns
    wheelEl.style.transition = 'transform 3s ease-out';
    wheelEl.style.transform = `rotate(${degrees}deg)`;
    setTimeout(() => {
        wheelEl.style.transition = '';
        wheelEl.style.transform = 'rotate(0deg)';
    }, 3100);
}

// === Button Events ===
spinBtn.addEventListener('click', () => {
    spinWheel();
    animateWheel();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createTable();
    updateChips();
});
