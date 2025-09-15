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
