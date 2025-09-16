// === TEXAS HOLD'EM GAMEPLAY ===

// Deck & cards
const SUITS = ['♠','♥','♦','♣'];
const RANKS = [
  {r:'A',v:14},{r:'2',v:2},{r:'3',v:3},{r:'4',v:4},{r:'5',v:5},{r:'6',v:6},
  {r:'7',v:7},{r:'8',v:8},{r:'9',v:9},{r:'10',v:10},{r:'J',v:11},{r:'Q',v:12},{r:'K',v:13}
];

let deck = [];
let communityCards = [];
let playerHand = [];
let aiHands = [
  { cards: [], folded: false },
  { cards: [], folded: false },
  { cards: [], folded: false },
  { cards: [], folded: false }
]; 
let chips = 1000;
let currentBet = 10;

// DOM Elements
const communityEl = document.getElementById('communityCards');
const playerAreaEl = document.getElementById('playerArea');
const aiPlayersEl = document.getElementById('aiPlayers');
const betInput = document.getElementById('betInput');
const statusEl = document.getElementById('status');

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

function dealCard(handArr){
  if(deck.length===0) deck = buildDeck();
  const card = deck.pop();
  handArr.push(card);
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
  playerAreaEl.innerHTML = '<h3>You</h3>';
  const cardsDiv = document.createElement('div');
  cardsDiv.className = 'cards';
  playerHand.forEach(c => cardsDiv.appendChild(renderCard(c)));
  playerAreaEl.appendChild(cardsDiv);
  const chipDiv = document.createElement('div');
  chipDiv.textContent = `Chips: ${chips}`;
  playerAreaEl.appendChild(chipDiv);
}

function renderCommunity() {
  communityEl.innerHTML = '';
  communityCards.forEach(c => communityEl.appendChild(renderCard(c)));
}

function renderAIHands(show=false) {
  aiPlayersEl.innerHTML = '';
  aiHands.forEach((handObj,index)=>{
    const div = document.createElement('div');
    div.className = 'aiPlayer';
    div.innerHTML = `<strong>AI ${index+1} ${handObj.folded ? '(Folded)' : ''}</strong>`;
    const cardsDiv = document.createElement('div');
    cardsDiv.className = 'cards';
    handObj.cards.forEach(c=>{
      cardsDiv.appendChild(renderCard(c, !show)); 
    });
    div.appendChild(cardsDiv);
    const chipDiv = document.createElement('div');
    chipDiv.className = 'aiChips';
    chipDiv.textContent = 'Chips: 1000'; // placeholder
    div.appendChild(chipDiv);
    aiPlayersEl.appendChild(div);
  });
}

function showStatus(msg) {
  statusEl.textContent = msg;
}

// === GAME FUNCTIONS ===
function startRound() {
  deck = buildDeck();
  communityCards = [];
  playerHand = [];
  aiHands = [
    { cards: [], folded: false },
    { cards: [], folded: false },
    { cards: [], folded: false },
    { cards: [], folded: false }
  ];

  // Deal player & AI
  dealCard(playerHand); dealCard(playerHand);
  aiHands.forEach(h=>{ dealCard(h.cards); dealCard(h.cards); });

  renderPlayerHand();
  renderAIHands(false);
  renderCommunity();
  showStatus('New round started! Place your bet.');
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

// === HAND EVALUATION (simplified, placeholder) ===
function evaluateHand(handObj) {
  if(handObj.folded) return {score: 0, high: 0};
  const allCards = handObj.cards.concat(communityCards);
  const values = allCards.map(c=>c.value).sort((a,b)=>b-a);
  return {score: values[0], high: values[0]};
}

function determineWinner() {
  const playerScore = evaluateHand({cards: playerHand, folded: false});
  const aiScores = aiHands.map(h=>evaluateHand(h));

  let best = playerScore;
  let winner = 'You';
  aiScores.forEach((s,i)=>{
    if(s.score>best.score){
      best = s;
      winner = `AI ${i+1}`;
    }
  });

  showStatus(`${winner} wins the round!`);
  renderAIHands(true); // reveal
}

// === BETTING ===
function playerBet(amount) {
  amount = parseInt(amount);
  if(amount > chips) {
    showStatus('Not enough chips');
    return;
  }
  currentBet = amount;
  chips -= amount;
  renderPlayerHand();
  showStatus(`You bet ${amount}`);
}

// AI simple logic
function aiDecision() {
  aiHands.forEach((h,i)=>{
    if(Math.random()<0.2){
      h.folded = true;
    }
  });
}

// === BUTTONS ===
document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('dealBtn').addEventListener('click', startRound);
  document.getElementById('betBtn').addEventListener('click', ()=>playerBet(betInput.value||10));
  document.getElementById('checkBtn').addEventListener('click', ()=>{ showStatus("You checked"); });
  document.getElementById('foldBtn').addEventListener('click', ()=>{ showStatus("You folded"); });

  // For testing: full flow
  document.getElementById('dealFlopBtn')?.addEventListener('click', dealFlop);
  document.getElementById('dealTurnBtn')?.addEventListener('click', dealTurn);
  document.getElementById('dealRiverBtn')?.addEventListener('click', ()=>{
    dealRiver();
    aiDecision();
    determineWinner();
  });

  startRound();
});
