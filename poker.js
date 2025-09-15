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

// === PART 3B: HAND EVALUATION & WINNER LOGIC ===

// Utility: convert hand + community to sorted values
function getCardValues(hand) {
  return hand.map(c => c.value).sort((a,b)=>b-a);
}

// Simplified: highest card wins (placeholder for full hand ranking)
function evaluateHand(hand) {
  const allCards = hand.concat(communityCards);
  const values = allCards.map(c=>c.value).sort((a,b)=>b-a);
  return values[0]; // placeholder: top card determines winner
}

// Determine winner between player and AI
function determineWinner() {
  const playerScore = evaluateHand(playerHand);
  const aiScores = aiHands.map(h => evaluateHand(h));

  const highestAI = Math.max(...aiScores);

  if(playerScore > highestAI) {
    showStatus('You win the round!');
    chips += currentBet * 2;
  } else if(playerScore === highestAI) {
    showStatus('Round is a tie (Push)');
    chips += currentBet;
  } else {
    showStatus('AI wins the round');
    chips -= currentBet;
  }
  updateChips();
}

// Show AI cards at showdown
function revealAIHands() {
  aiPlayersEl.querySelectorAll('.aiPlayer').forEach((div,index)=>{
    div.querySelectorAll('.card').forEach(c=>c.classList.remove('hidden-card'));
  });
}

// === Betting / Player Actions ===
function playerBet(amount) {
  amount = parseInt(amount);
  if(amount > chips) {
    showStatus('Not enough chips');
    return false;
  }
  currentBet = amount;
  chips -= amount;
  updateChips();
  showStatus(`Bet set to ${amount}`);
  return true;
}

// AI Placeholder Logic: simple random fold/call
function aiDecision() {
  aiHands.forEach((hand,index)=>{
    // simple: 80% chance to stay, 20% fold
    const decision = Math.random();
    if(decision<0.2){
      showStatus(`AI ${index+1} folds`);
    }
  });
}

// Full round: Flop -> Turn -> River -> Showdown
function playRound() {
  dealFlop();
  aiDecision();
  dealTurn();
  aiDecision();
  dealRiver();
  aiDecision();
  revealAIHands();
  determineWinner();
}

// === UI Buttons (add in HTML) ===
document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('startRoundBtn')?.addEventListener('click',startRound);
  document.getElementById('playRoundBtn')?.addEventListener('click',playRound);
  document.getElementById('betInput')?.addEventListener('change',()=>playerBet(betInput.value));
});


// === PART 4: FULL POKER LOGIC ===

// Hand ranking utility
const HAND_RANKS = {
  'highCard':1,
  'pair':2,
  'twoPair':3,
  'threeOfAKind':4,
  'straight':5,
  'flush':6,
  'fullHouse':7,
  'fourOfAKind':8,
  'straightFlush':9,
  'royalFlush':10
};

// Helper functions
function isFlush(cards){
  const suits = cards.map(c=>c.suit);
  return suits.every(s=>s===suits[0]);
}

function isStraight(values){
  const sorted = [...new Set(values)].sort((a,b)=>a-b);
  if(sorted.length<5) return false;
  for(let i=0;i<=sorted.length-5;i++){
    let straight=true;
    for(let j=0;j<4;j++){
      if(sorted[i+j]+1!==sorted[i+j+1]) straight=false;
    }
    if(straight) return true;
  }
  return false;
}

function countValues(cards){
  const counts={};
  cards.forEach(c=>counts[c.value]=(counts[c.value]||0)+1);
  return counts;
}

// Evaluate a 7-card hand
function evaluateFullHand(hand){
  const allCards = hand.concat(communityCards);
  const values = allCards.map(c=>c.value);
  const counts = countValues(allCards);
  const flush = isFlush(allCards);
  const straight = isStraight(values);
  
  const countVals = Object.values(counts);
  
  if(flush && straight && values.includes(14)) return {rank: HAND_RANKS.royalFlush, high:14};
  if(flush && straight) return {rank: HAND_RANKS.straightFlush, high:Math.max(...values)};
  if(countVals.includes(4)) return {rank: HAND_RANKS.fourOfAKind, high:Math.max(...values)};
  if(countVals.includes(3) && countVals.includes(2)) return {rank: HAND_RANKS.fullHouse, high:Math.max(...values)};
  if(flush) return {rank: HAND_RANKS.flush, high:Math.max(...values)};
  if(straight) return {rank: HAND_RANKS.straight, high:Math.max(...values)};
  if(countVals.includes(3)) return {rank: HAND_RANKS.threeOfAKind, high:Math.max(...values)};
  if(countVals.filter(v=>v===2).length===2) return {rank: HAND_RANKS.twoPair, high:Math.max(...values)};
  if(countVals.includes(2)) return {rank: HAND_RANKS.pair, high:Math.max(...values)};
  return {rank: HAND_RANKS.highCard, high:Math.max(...values)};
}

// Determine winner
function determineWinnerAdvanced(){
  const playerScore = evaluateFullHand(playerHand);
  const aiScores = aiHands.map(h=>evaluateFullHand(h));
  
  let highestRank = playerScore;
  let winner = 'Player';
  
  aiScores.forEach((score,i)=>{
    if(score.rank>highestRank.rank || (score.rank===highestRank.rank && score.high>highestRank.high)){
      highestRank = score;
      winner = `AI ${i+1}`;
    }
  });
  
  showStatus(`${winner} wins the round!`);
  
  if(winner==='Player'){
    chips += currentBet * 2;
  } else {
    chips -= currentBet;
  }
  updateChips();
}

// AI Decision-Making (simple logic)
function aiDecisionAdvanced(){
  aiHands.forEach((hand,index)=>{
    const score = evaluateFullHand(hand);
    // Fold if very low hand
    if(score.rank <= HAND_RANKS.highCard && Math.random()<0.3){
      showStatus(`AI ${index+1} folds`);
      hand.folded = true;
    } else {
      // Call or raise
      hand.folded = false;
    }
  });
}

// Multiple Betting Rounds
function playFullRound(){
  currentBet = parseInt(document.getElementById('betInput').value) || 10;
  chips -= currentBet;
  updateChips();
  
  dealPreFlop();
  aiDecisionAdvanced();
  
  dealFlop();
  aiDecisionAdvanced();
  
  dealTurn();
  aiDecisionAdvanced();
  
  dealRiver();
  aiDecisionAdvanced();
  
  revealAIHands();
  determineWinnerAdvanced();
}

// Button for full round
document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('playFullRoundBtn')?.addEventListener('click', playFullRound);
});

function dealFlop() {
  communityCards.push(dealCard(communityCards));
  communityCards.push(dealCard(communityCards));
  communityCards.push(dealCard(communityCards));
  renderCommunity();
}
