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
