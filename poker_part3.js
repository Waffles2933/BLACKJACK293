// === PART 3: TEXAS HOLD'EM GAMEPLAY JS ===

// Deck & cards
const SUITS = ['♠','♥','♦','♣'];
const RANKS = [
  {r:'A',v:14},{r:'2',v:2},{r:'3',v:3},{r:'4',v:4},{r:'5',v:5},{r:'6',v:6},
  {r:'7',v:7},{r:'8',v:8},{r:'9',v:9},{r:'10',v:10},{r:'J',v:11},{r:'Q',v:12},{r:'K',v:13}
];

let deck = [];
let communityCards = [];
let playerHand = [];
let aiHands = [[],[],[],[]]; // 4 AI players
let chips = 1000;
let currentBet = 10;

// DOM Elements
const tableEl = document.getElementById('table');
const playerHandEl = document.getElementById('playerHand');
const communityEl = document.getElementById('communityCards');
const aiPlayersEl = document.getElementById('aiPlayers');
const betInput = document.getElementById('betInput');
const chipsEl = document.getElementById('chips');
const statusEl = document.getElementById('status');
const statsEl = document.getElementById('stats');

// === UTILITY FUNCTIONS ===
function buildDeck() {
  const d = [];
  for (const s of SUITS) {
    for (const r of RANKS) {
      d.push({suit: s, rank: r.r, value: r.v});
    }
  }
  return shuffle(d);
}

function shuffle(array){
  for (let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
  return array;
}

function dealCard(hand){
  if(deck.length===0) deck = buildDeck();
  const card = deck.pop();
  hand.push(card);
  return card;
}

function renderCard(card, hidden=false){
  const div = document.createElement('div');
  div.className = hidden ? 'card hidden-card' : 'card';
  if(!hidden){
    if(card.suit==='♥'||card.suit==='♦') div.classList.add('red');
    div.innerHTML = `<div class="top-left">${card.rank}${card.suit}</div>
                     <div class="center">${card.rank}</div>
                     <div class="bottom-right">${card.rank}${card.suit}</div>`;
  }
  return div;
}

// === UI RENDERING ===
function renderPlayerHand() {
  playerHandEl.innerHTML = '';
  playerHand.forEach(c => playerHandEl.appendChild(renderCard(c)));
}

function renderCommunity() {
  communityEl.innerHTML = '';
  communityCards.forEach(c => communityEl.appendChild(renderCard(c)));
}

function renderAIHands() {
  aiPlayersEl.innerHTML = '';
  aiHands.forEach((hand,index)=>{
    const div = document.createElement('div');
    div.className = 'aiPlayer hiddenCards';
    div.innerHTML = `<strong>AI ${index+1}</strong>`;
    const cardsDiv = document.createElement('div');
    cardsDiv.className = 'cards';
    hand.forEach(c=>cardsDiv.appendChild(renderCard(c,true))); // hidden
    div.appendChild(cardsDiv);
    const chipDiv = document.createElement('div');
    chipDiv.className = 'aiChips';
    chipDiv.textContent = 'Chips: 1000';
    div.appendChild(chipDiv);
    aiPlayersEl.appendChild(div);
  });
}

function updateChips() {
  chipsEl.textContent = chips;
}

function showStatus(msg) {
  statusEl.textContent = msg;
}

// === GAME FUNCTIONS ===
function startRound() {
  deck = buildDeck();
  communityCards = [];
  playerHand = [];
  aiHands = [[],[],[],[]];

  // Deal player & AI
  dealCard(playerHand); dealCard(playerHand);
  aiHands.forEach(h=>{ dealCard(h); dealCard(h); });

  renderPlayerHand();
  renderAIHands();
  renderCommunity();
  showStatus('Place your bet and play!');
}

function dealFlop() {
  communityCards.push(dealCard([]));
  communityCards.push(dealCard([]));
  communityCards.push(dealCard([]));
  renderCommunity();
}

function dealTurn() {
  communityCards.push(dealCard([]));
  renderCommunity();
}

function dealRiver() {
  communityCards.push(dealCard([]));
  renderCommunity();
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', ()=>{
  updateChips();
  startRound();

  // Example buttons: you would create buttons in your index.html
  document.getElementById('dealFlopBtn')?.addEventListener('click',dealFlop);
  document.getElementById('dealTurnBtn')?.addEventListener('click',dealTurn);
  document.getElementById('dealRiverBtn')?.addEventListener('click',dealRiver);
});
