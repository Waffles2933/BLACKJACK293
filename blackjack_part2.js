// === PART 2: FULL GAMEPLAY JS ===

// Utility variables
const SUITS = ['♠','♥','♦','♣'];
const RANKS = [
  {r:'A',v:11},{r:'2',v:2},{r:'3',v:3},{r:'4',v:4},{r:'5',v:5},{r:'6',v:6},{r:'7',v:7},
  {r:'8',v:8},{r:'9',v:9},{r:'10',v:10},{r:'J',v:10},{r:'Q',v:10},{r:'K',v:10}
];

let deck=[], dealer=[], playerHands=[], currentHandIndex=0, gameOver=true, chips=1000, stats={wins:0,losses:0,blackjacks:0}, dealerHistory=[];
let keyMap={hit:'h',stand:'s',double:'d',split:'p',redeal:'r'};

// DOM elements
const dealerCardsEl=document.getElementById('dealerCards');
const dealerScoreEl=document.getElementById('dealerScore');
const playerPanelEl=document.getElementById('playerPanel');
const statusEl=document.getElementById('status');
const chipsEl=document.getElementById('chips');
const betInput=document.getElementById('betInput');
const dealBtn=document.getElementById('dealBtn');
const hitBtn=document.getElementById('hitBtn');
const standBtn=document.getElementById('standBtn');
const doubleBtn=document.getElementById('doubleBtn');
const splitBtn=document.getElementById('splitBtn');
const restartBtn=document.getElementById('restartBtn');
const keySettingsBtn=document.getElementById('keySettingsBtn');
const keyModal=document.getElementById('keyModal');
const saveKeysBtn=document.getElementById('saveKeysBtn');
const preset10=document.getElementById('preset10');
const preset50=document.getElementById('preset50');
const preset100=document.getElementById('preset100');
const sndHit=document.getElementById('sndHit');
const sndWin=document.getElementById('sndWin');
const sndLose=document.getElementById('sndLose');
const themeToggleBtn=document.getElementById('themeToggleBtn');

// ===== Deck & Card Functions =====
function buildDeck(){
  const d=[];
  for(const s of SUITS){
    for(const r of RANKS){
      d.push({suit:s, rank:r.r, value:r.v});
    }
  }
  return shuffle(d);
}

function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
  return array;
}

function dealCard(hand){
  if(deck.length===0) deck = buildDeck();
  const card = deck.pop();
  if(hand) hand.cards.push(card);
  return card;
}

function calcScore(cards){
  let sum=0, aces=0;
  for(const c of cards){
    sum+=c.value;
    if(c.rank==='A') aces++;
  }
  while(sum>21 && aces>0){ sum-=10; aces--; }
  return sum;
}

function renderCard(card,hidden=false){
  const div=document.createElement('div');
  div.className=hidden?'card hidden-card':'card';
  if(!hidden){
    if(card.suit==='♥'||card.suit==='♦') div.classList.add('red');
    div.innerHTML=`<div class="top-left">${card.rank}${card.suit}</div>
                    <div class="center">${card.rank}</div>
                    <div class="bottom-right">${card.rank}${card.suit}</div>`;
  }
  return div;
}

// ===== UI Updates =====
function renderHands(){
  playerPanelEl.innerHTML='';
  playerHands.forEach((hand,index)=>{
    const div=document.createElement('div');
    div.className='hand';
    const score = calcScore(hand.cards);
    div.innerHTML=`<strong>Hand ${index+1}</strong> <span class="score">${score}</span>`;
    const cardsDiv=document.createElement('div'); 
    cardsDiv.className='cards';
    hand.cards.forEach(c => cardsDiv.appendChild(renderCard(c)));
    div.appendChild(cardsDiv);
    playerPanelEl.appendChild(div);
  });
}

function renderDealer(hideSecond=true){
  dealerCardsEl.innerHTML='';
  dealer.forEach((c,i)=>{
    dealerCardsEl.appendChild(renderCard(c,i===1 && hideSecond));
  });
  dealerScoreEl.textContent = hideSecond ? '—' : calcScore(dealer);
}

function updateChips(){ chipsEl.textContent=chips; }
function showNotification(msg,color='#0f0'){ 
  const n=document.getElementById('notification');
  n.textContent=msg; n.style.color=color; n.style.opacity=1;
  setTimeout(()=>n.style.opacity=0,1200);
}
function updateStats(){
  document.getElementById('stats').textContent=`Wins: ${stats.wins} | Losses: ${stats.losses} | Blackjacks: ${stats.blackjacks}`;
}
function updateDealerHistory(){
  if(dealerHistory.length>0){
    document.getElementById('dealerHistory').textContent='Dealer Last Cards: '+dealerHistory.map(c=>c.rank+c.suit).join(', ');
  }
}

// ===== Game Control =====
function resetGame(){
  deck = shuffle(buildDeck());
  dealer=[]; playerHands=[]; currentHandIndex=0; gameOver=false;
  dealerCardsEl.innerHTML=''; dealerScoreEl.textContent='—';
  playerPanelEl.innerHTML=''; statusEl.textContent='Game started! Make your move.';
  hitBtn.disabled=true; standBtn.disabled=true; doubleBtn.disabled=true; splitBtn.disabled=true;
}

// ===== Deal Button =====
dealBtn.addEventListener('click',()=>{
  let bet=parseInt(betInput.value);
  if(isNaN(bet)||bet<1){ showNotification('Invalid bet','#f00'); return; }
  if(bet>chips){ showNotification('Not enough chips','#f00'); return; }
  
  chips-=bet; updateChips();
  
  resetGame();
  const hand={cards:[], bet:bet, double:false, stand:false};
  playerHands.push(hand);
  
  dealCard(hand);
  dealCard(hand);
  dealer.push(dealCard());
  dealer.push(dealCard());
  
  renderHands();
  renderDealer();
  enablePlayerButtons();
});

// ===== Button enabling =====
function enablePlayerButtons(){
  const hand=playerHands[currentHandIndex];
  hitBtn.disabled=false; standBtn.disabled=false;
  doubleBtn.disabled=(hand.cards.length===2 && chips>=hand.bet)?false:true;
  splitBtn.disabled=(hand.cards.length===2 && hand.cards[0].rank===hand.cards[1].rank && playerHands.length<4 && chips>=hand.bet)?false:true;
}

// ===== Player Actions =====
hitBt
