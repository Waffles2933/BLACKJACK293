const suits = ["♠","♥","♦","♣"];
const ranks = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
let deck, dealerHand, playerHand, playerMoney = 500, currentBet = 0;

const dealerCardsDiv = document.getElementById("dealer-cards");
const playerCardsDiv = document.getElementById("player-cards");
const dealerScoreSpan = document.getElementById("dealer-score");
const playerScoreSpan = document.getElementById("player-score");
const moneySpan = document.getElementById("money");
const betInput = document.getElementById("bet");
const statusDiv = document.getElementById("status");

const btnDeal = document.getElementById("dealBtn");
const btnHit = document.getElementById("hitBtn");
const btnStand = document.getElementById("standBtn");
const btnRestart = document.getElementById("restartBtn");

// ---- Deck & Card Functions ----
function makeDeck() {
  let d = [];
  for (let s of suits) for (let r of ranks) d.push({suit: s, rank: r});
  return shuffle(d);
}
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function cardValue(card) {
  if (["J","Q","K"].includes(card.rank)) return 10;
  if (card.rank === "A") return 11;
  return parseInt(card.rank);
}
function calcScore(hand) {
  let score = hand.reduce((sum, c) => sum + cardValue(c), 0);
  let aces = hand.filter(c => c.rank === "A").length;
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  return score;
}

// ---- Game Display ----
function updateHands(showDealer=false) {
  dealerCardsDiv.innerHTML = "";
  dealerHand.forEach((c, i) => {
    if (!showDealer && i === 0) {
      dealerCardsDiv.innerHTML += "[Hidden] ";
    } else {
      dealerCardsDiv.innerHTML += `${c.rank}${c.suit} `;
    }
  });
  dealerScoreSpan.textContent = showDealer ? calcScore(dealerHand) : "?";

  playerCardsDiv.innerHTML = "";
  playerHand.forEach(c => playerCardsDiv.innerHTML += `${c.rank}${c.suit} `);
  playerScoreSpan.textContent = calcScore(playerHand);
}

// ---- Game Flow ----
function startRound() {
  currentBet = parseInt(betInput.value);
  if (isNaN(currentBet) || currentBet < 10 || currentBet > playerMoney) {
    statusDiv.textContent = "Invalid bet!";
    return;
  }
  playerMoney -= currentBet;
  moneySpan.textContent = playerMoney;
  deck = makeDeck();
  dealerHand = [deck.pop(), deck.pop()];
  playerHand = [deck.pop(), deck.pop()];
  statusDiv.textContent = "";
  btnDeal.disabled = true;
  btnHit.disabled = false;
  btnStand.disabled = false;
  updateHands(false);
  checkBlackjack();
}

function checkBlackjack() {
  const playerScore = calcScore(playerHand);
  const dealerScore = calcScore(dealerHand);
  if (playerScore === 21 && dealerScore === 21) {
    endRound("Push! Both have Blackjack.", true);
  } else if (playerScore === 21) {
    endRound("Blackjack! You win 1.5x your bet.", true, 1.5);
  }
}

function endRound(msg, showDealer=true, payoutMultiplier=0) {
  updateHands(true);
  btnDeal.disabled = false;
  btnHit.disabled = true;
  btnStand.disabled = true;
  if (payoutMultiplier > 0) {
    playerMoney += currentBet + currentBet * payoutMultiplier;
    moneySpan.textContent = playerMoney;
  }
  statusDiv.textContent = msg;
}

// ---- Button Actions ----
btnDeal.addEventListener("click", startRound);

btnHit.addEventListener("click", () => {
  playerHand.push(deck.pop());
  updateHands(false);
  if (calcScore(playerHand) > 21) {
    endRound("You busted! Dealer wins.");
  }
});

btnStand.addEventListener("click", () => {
  while (calcScore(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }
  const playerScore = calcScore(playerHand);
  const dealerScore = calcScore(dealerHand);
  if (dealerScore > 21) {
    endRound("Dealer busts! You win.", true, 1);
  } else if (playerScore > dealerScore) {
    endRound("You win!", true, 1);
  } else if (playerScore < dealerScore) {
    endRound("Dealer wins.");
  } else {
    endRound("Push! It's a tie.", true, 0);
    playerMoney += currentBet;
    moneySpan.textContent = playerMoney;
  }
});

btnRestart.addEventListener("click", () => {
  playerMoney = 500;
  moneySpan.textContent = playerMoney;
  statusDiv.textContent = "Balance reset.";
});
