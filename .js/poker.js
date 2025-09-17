// === Texas Hold'em Poker Game ===

// --- Deck setup ---
const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = [
  { r: "A", v: 14 },
  { r: "K", v: 13 },
  { r: "Q", v: 12 },
  { r: "J", v: 11 },
  { r: "10", v: 10 },
  { r: "9", v: 9 },
  { r: "8", v: 8 },
  { r: "7", v: 7 },
  { r: "6", v: 6 },
  { r: "5", v: 5 },
  { r: "4", v: 4 },
  { r: "3", v: 3 },
  { r: "2", v: 2 }
];

let deck = [];
let playerHand = [];
let communityCards = [];
let aiPlayers = [
  { hand: [], folded: false },
  { hand: [], folded: false },
  { hand: [], folded: false },
  { hand: [], folded: false }
];

let chips = 1000;
let currentBet = 10;

// --- DOM elements ---
const statusEl = document.getElementById("status");
const chipsEl = document.getElementById("chips");

// --- Utility functions ---
function buildDeck() {
  const d = [];
  for (let s of SUITS) {
    for (let r of RANKS) {
      d.push({ suit: s, rank: r.r, value: r.v });
    }
  }
  return shuffle(d);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createCard(card, hidden = false) {
  const div = document.createElement("div");
  div.className = hidden ? "card back" : "card";
  if (!hidden) {
    if (card.suit === "♥" || card.suit === "♦") div.classList.add("red");
    div.innerHTML = `
      <div class="top-left">${card.rank}${card.suit}</div>
      <div class="center">${card.rank}</div>
      <div class="bottom-right">${card.rank}${card.suit}</div>
    `;
  }
  return div;
}

function setStatus(msg) {
  statusEl.textContent = msg;
}

function updateChips() {
  chipsEl.textContent = chips;
}

// --- Reset table ---
function resetTable() {
  playerHand = [];
  communityCards = [];
  aiPlayers.forEach(ai => {
    ai.hand = [];
    ai.folded = false;
  });

  document.getElementById("playerArea").innerHTML = "<h3>Your Hand</h3><div class='cards'></div>";
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`ai${i}`).innerHTML = `<h3>AI Player ${i}</h3><div class='cards'></div>`;
  }
  document.getElementById("communityCards").innerHTML = "";
  setStatus("Table cleared.");
}

// --- Deal round ---
function dealRound() {
  resetTable();
  deck = buildDeck();

  // Player hand
  playerHand = [deck.pop(), deck.pop()];
  const playerArea = document.getElementById("playerArea").querySelector(".cards");
  playerHand.forEach(c => playerArea.appendChild(createCard(c)));

  // AI hands
  aiPlayers.forEach((ai, i) => {
    ai.hand = [deck.pop(), deck.pop()];
    const aiArea = document.getElementById(`ai${i + 1}`).querySelector(".cards");
    ai.hand.forEach(c => aiArea.appendChild(createCard(c, true))); // hidden
  });

  setStatus("Cards dealt! Your move...");
}

// --- Deal community cards ---
function dealFlop() {
  communityCards.push(deck.pop(), deck.pop(), deck.pop());
  renderCommunity();
  setStatus("Flop dealt!");
}

function dealTurn() {
  communityCards.push(deck.pop());
  renderCommunity();
  setStatus("Turn dealt!");
}

function dealRiver() {
  communityCards.push(deck.pop());
  renderCommunity();
  setStatus("River dealt!");
}

function renderCommunity() {
  const commDiv = document.getElementById("communityCards");
  commDiv.innerHTML = "<h3>Community Cards</h3>";
  const cardDiv = document.createElement("div");
  cardDiv.className = "cards";
  communityCards.forEach(c => cardDiv.appendChild(createCard(c)));
  commDiv.appendChild(cardDiv);
}

// --- Reveal AI hands ---
function revealAIHands() {
  aiPlayers.forEach((ai, i) => {
    const aiArea = document.getElementById(`ai${i + 1}`).querySelector(".cards");
    aiArea.innerHTML = "";
    ai.hand.forEach(c => aiArea.appendChild(createCard(c, false)));
  });
  setStatus("Showdown!");
}

// --- Simple hand evaluation (high card only for now) ---
function evaluateHand(hand) {
  const all = hand.concat(communityCards);
  const values = all.map(c => c.value).sort((a, b) => b - a);
  return values[0]; // highest card
}

function determineWinner() {
  const playerScore = evaluateHand(playerHand);
  let best = { score: playerScore, winner: "Player" };

  aiPlayers.forEach((ai, i) => {
    if (ai.folded) return;
    const score = evaluateHand(ai.hand);
    if (score > best.score) best = { score, winner: `AI ${i + 1}` };
  });

  if (best.winner === "Player") {
    chips += currentBet * 2;
    setStatus("You win!");
  } else {
    chips -= currentBet;
    setStatus(`${best.winner} wins!`);
  }
  updateChips();
}

// --- Event listeners ---
document.getElementById("dealBtn").addEventListener("click", dealRound);
document.getElementById("flopBtn").addEventListener("click", dealFlop);
document.getElementById("turnBtn").addEventListener("click", dealTurn);
document.getElementById("riverBtn").addEventListener("click", dealRiver);
document.getElementById("showdownBtn").addEventListener("click", () => {
  revealAIHands();
  determineWinner();
});

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
  updateChips();
  setStatus("Click 'New Round' to start.");
});
