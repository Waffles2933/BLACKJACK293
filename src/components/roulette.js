// === ROULETTE JS ===

// Player info
let playerChips = 1000;
let currentBet = 0;
let bets = []; // {type:'number/red/etc', value:amount}

// Roulette numbers for American wheel
const wheelNumbers = [
  '0','28','9','26','30','11','7','20','32','17','5','22','34','15','3','24','36','13','1',
  '00','27','10','25','29','12','8','19','31','18','6','21','33','16','4','23','35','14','2'
];

const numberColors = {
  '0':'green','00':'green',
  '1':'red','2':'black','3':'red','4':'black','5':'red','6':'black','7':'red','8':'black',
  '9':'red','10':'black','11':'black','12':'red','13':'black','14':'red','15':'black','16':'red',
  '17':'black','18':'red','19':'red','20':'black','21':'red','22':'black','23':'red','24':'black',
  '25':'red','26':'black','27':'red','28':'black','29':'black','30':'red','31':'black','32':'red',
  '33':'black','34':'red','35':'black','36':'red'
};

// DOM elements
const chipsEl = document.getElementById('playerChips');
const currentBetEl = document.getElementById('currentBet');
const notificationEl = document.getElementById('notification');
const spinBtn = document.getElementById('spinBtn');
const rouletteWheel = document.getElementById('rouletteWheel');
const tableContainer = document.getElementById('rouletteTable');

// Canvas context for wheel
const ctx = rouletteWheel.getContext('2d');
const wheelRadius = rouletteWheel.width/2;

// Initialize table numbers
function initTable() {
  const grid = tableContainer.querySelector('.numbers-grid');
  grid.innerHTML = '';
  for(let i=1;i<=36;i++){
    const div = document.createElement('div');
    div.className = 'bet-spot';
    div.dataset.number = i;
    div.textContent = i;
    div.style.backgroundColor = numberColors[i];
    div.style.color = (numberColors[i]==='red')?'white':'black';
    div.addEventListener('click',()=>placeBet(i));
    grid.appendChild(div);
  }

  // Add outside bets
  tableContainer.querySelectorAll('.outside-bets .bet-spot').forEach(btn=>{
    btn.addEventListener('click',()=>placeBet(btn.dataset.bet));
  });

  // Add 0 and 00 bets
  tableContainer.querySelectorAll('.zero-column .bet-spot').forEach(btn=>{
    btn.addEventListener('click',()=>placeBet(btn.dataset.number));
  });
}

// === BETTING ===
function placeBet(type){
  if(playerChips<=0) return alert("No chips left!");
  const amount = 10; // fixed chip for simplicity
  bets.push({type:type,value:amount});
  currentBet += amount;
  playerChips -= amount;
  updateDisplay();
}

// Update chip display
function updateDisplay(){
  chipsEl.textContent = playerChips;
  currentBetEl.textContent = currentBet;
}

// === WHEEL SPIN ===
function spinWheel(){
  if(bets.length===0) return alert("Place a bet first!");
  
  const spinIndex = Math.floor(Math.random()*wheelNumbers.length);
  const result = wheelNumbers[spinIndex];
  
  animateWheel(spinIndex, ()=>{
    checkBets(result);
    bets=[];
    currentBet=0;
    updateDisplay();
  });
}

// Animate wheel spin
function animateWheel(targetIndex, callback){
  let start = null;
  let totalSpins = 5*wheelNumbers.length + targetIndex; // total positions to move
  function step(timestamp){
    if(!start) start=timestamp;
    const progress = (timestamp-start)/2000; // spin duration ~2s
    let angleIndex = Math.floor(progress*totalSpins)%wheelNumbers.length;
    drawWheel(angleIndex);
    if(progress<1){
      requestAnimationFrame(step);
    }else{
      drawWheel(targetIndex);
      callback();
    }
  }
  requestAnimationFrame(step);
}

// Draw wheel
function drawWheel(highlightIndex=0){
  ctx.clearRect(0,0,rouletteWheel.width,rouletteWheel.height);
  const center = wheelRadius;
  const anglePerNumber = (2*Math.PI)/wheelNumbers.length;
  for(let i=0;i<wheelNumbers.length;i++){
    const startAngle = i*anglePerNumber - Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(center,center);
    ctx.arc(center,center,wheelRadius,startAngle,startAngle+anglePerNumber);
    ctx.closePath();
    ctx.fillStyle = (i===highlightIndex)?'yellow':numberColors[wheelNumbers[i]];
    ctx.fill();
    // Draw number
    ctx.save();
    ctx.translate(center,center);
    ctx.rotate(startAngle + anglePerNumber/2);
    ctx.textAlign = "right";
    ctx.fillStyle = (numberColors[wheelNumbers[i]]==='red')?'white':'black';
    ctx.font = "16px Arial";
    ctx.fillText(wheelNumbers[i], wheelRadius-10,5);
    ctx.restore();
  }
}

// === CHECK WINNER ===
function checkBets(result){
  let totalWin = 0;
  bets.forEach(b=>{
    if(b.type == result) totalWin += b.value*35; // straight win
    else if(b.type==='red' && numberColors[result]==='red') totalWin += b.value*2;
    else if(b.type==='black' && numberColors[result]==='black') totalWin += b.value*2;
    else if(b.type==='even' && result!=='0' && result!=='00' && result%2===0) totalWin += b.value*2;
    else if(b.type==='odd' && result!=='0' && result!=='00' && result%2===1) totalWin += b.value*2;
    else if(b.type==='1to18' && result>=1 && result<=18) totalWin += b.value*2;
    else if(b.type==='19to36' && result>=19 && result<=36) totalWin += b.value*2;
    else if(b.type==='first12' && result>=1 && result<=12) totalWin += b.value*3;
    else if(b.type==='second12' && result>=13 && result<=24) totalWin += b.value*3;
    else if(b.type==='third12' && result>=25 && result<=36) totalWin += b.value*3;
    else if(b.type==='col1' && [1,4,7,10,13,16,19,22,25,28,31,34].includes(result)) totalWin += b.value*3;
    else if(b.type==='col2' && [2,5,8,11,14,17,20,23,26,29,32,35].includes(result)) totalWin += b.value*3;
    else if(b.type==='col3' && [3,6,9,12,15,18,21,24,27,30,33,36].includes(result)) totalWin += b.value*3;
  });
  if(totalWin>0){
    notificationEl.textContent = `Result: ${result}. You won ${totalWin} chips!`;
  }else{
    notificationEl.textContent = `Result: ${result}. You lost your bet.`;
  }
  playerChips += totalWin;
}

// Initialize
document.addEventListener('DOMContentLoaded', ()=>{
  initTable();
  updateDisplay();
  spinBtn.addEventListener('click',spinWheel);
  drawWheel();
});
