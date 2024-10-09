const input = document.querySelector('#add');
const gridElement = document.querySelector('#grid');
const start = document.querySelector('#ok');
const boxes = Array.from( document.querySelectorAll('.box'));
let text = document.querySelector('#text');

const O_text = 'O';
const x_text = 'X';
let currentPlayer = x_text;
let spaces = Array(9).fill(undefined);


///skzbum ej@ bacelis miangamic xaxalu hamar aranc input
const startGame = ()=>{
    boxes.forEach(box => box.addEventListener('click', boxClicked));
}//amen boxin event e avelacnum

function boxClicked(e){
    const id = e.target.id;//vori vra click enq arel id n veragrum enq id -in
    if(!spaces[id]){//stugum enq datark e te voch
        spaces[id]= currentPlayer;
        e.target.innerText = currentPlayer;
        if(playerHasWon() != false){
            text.innerHTML = `${currentPlayer} has won!`
            let winningBlocks = playerHasWon();
            console.log(winningBlocks);
            winningBlocks.map(box => boxes[box].classList.add('winningcolor'));
            startConfetti();
            disableClicks();
           return
        }
        else if (spaces.every(space => space !== undefined)) {//ete defined en bolor@ aysinqn bolor@ sexmvel en
            text.innerHTML = "It's a draw! Try again.";
            disableClicks();
            return;
        }
    }
    
    currentPlayer= currentPlayer == x_text ? O_text : x_text
    
}

function disableClicks() {
    boxes.forEach(box => {
        box.removeEventListener('click', boxClicked); 
    });
}

function enableClicks() {
    boxes.forEach(box => box.addEventListener('click', () =>{
        boxClicked();
        inputboxClicked();
    }));
}

const winningCombos = [
    [0, 1, 2], 
    [3, 4, 5], 
    [6, 7, 8], 
    [0, 3, 6], 
    [1, 4, 7], 
    [2, 5, 8], 
    [0, 4, 8], 
    [2, 4, 6]  
];

function playerHasWon(){
    for(const condition of winningCombos){
        let [a, b, c] = condition;
        if(spaces[a] && (spaces[a] === spaces[b] && spaces[a] === spaces[c])){
            return [a,b,c]
        }

    };
    return false;
}

startGame()



/////////////////////////
// input ic heto xaxalu hamar

start.addEventListener('click', () => {
    confettiActive = false; // 
    ctx.clearRect(0, 0, canvas.width, canvas.height); // jnjenq canvas@

    const newSize = parseInt(input.value);
    resizeGrid(newSize);
    renderGrid(newSize);
    text.innerHTML = 'Tic Tac Toe'; 
    enableClicks(); 
    currentPlayer = x_text; //  skzbi xaxacox
});


function resizeGrid(newSize) {
    spaces = new Array(newSize).fill(undefined).map(() => new Array(newSize).fill(0));
}

function renderGrid(newSize) {
    gridElement.innerHTML = ''; //jnjenq grid@
    const gridSize = 450 ;  // Number(gridElement.style.width); 
    const boxSize = gridSize / newSize; 

    for (let i = 0; i < spaces.length; i++) {
        for (let j = 0; j < spaces[i].length; j++) {
            const box = document.createElement('div');
            box.classList.add('box');
            box.id = `${i}-${j}`; 
            box.style.height = box.style.width= `${boxSize}px`;
            box.style.fontSize= `${-2.8*parseInt(input.value)+90}px`
            box.style.border = '1px solid';
            if (i === 0) {
                box.classList.add('no-top-border');
            }
            if (j === 0) {
                box.classList.add('no-left-border');
            }
            if (i === newSize - 1) {
                box.classList.add('no-bottom-border');
            }
            if (j === newSize - 1) {
                box.classList.add('no-right-border');
            }

            box.addEventListener('click', inputboxClicked);
            gridElement.appendChild(box);
        }
    }
}


function inputboxClicked(e) {
    const box = e.target;
    const [row, col] = box.id.split('-').map(Number); //sarqum e tiv

    // stugenq ardyoq click exela box@ ete che veradardzra
    if (spaces[row][col] !== 0) {
        return;
    }

    // Update anenq
    spaces[row][col] = currentPlayer;
    box.textContent = currentPlayer;
    console.log(box);
    
    // stugel haxtoxin
    const winningCells = checkWin(row, col);
    if (winningCells.length > 0) {
        text.innerHTML = `${currentPlayer} has won!`;
        winningCells.forEach(id => document.getElementById(id).classList.add('winningcolor'));
        startConfetti();
        disableAllBoxes(); // box chkaroxananq sexmel
        return;
    }

    // voch voqi
    if (spaces.flat().every(cell => cell !== 0)) {
        text.innerHTML = "It's a draw! Try again.";
        box.style.pointerEvents = 'none'; // box chkaroxananq sexmel
        disableAllBoxes(); 
        return;
    }
    // Switch to the other player
    currentPlayer = (currentPlayer === x_text) ? O_text : x_text;
}

function disableAllBoxes() {
    document.querySelectorAll('.box').forEach(box => {
        box.style.pointerEvents = 'none'; // Disable anenq
        //When pointerEvents is set to none, the element becomes "invisible" to mouse events.
        // This means that the element will not respond to clicks, hovers, or any other 
        //pointer interactions. It's as if the element doesn't exist for user interaction.
    });
}

function checkWin(row, col) {
    const player = spaces[row][col];
    const size = spaces.length;
    let winningCells = [];

    // stugel row
    if (spaces[row].every(cell => cell === player)) {
        //lcnenq arr mej vor background karoxananq poxel
        winningCells = Array.from({ length: size }, (_, idx) => `${row}-${idx}`);
    }

    // stugel column
    else if (spaces.every(r => r[col] === player)) {
        winningCells = Array.from({ length: size }, (_, idx) => `${idx}-${col}`);
    }

    // stugel ankyunagits (top-left to bottom-right)
    else if (row === col && spaces.every((r, idx) => r[idx] === player)) {
        winningCells = Array.from({ length: size }, (_, idx) => `${idx}-${idx}`);
    }

    //myus ankyunagits (top-right to bottom-left)
    else if (row + col === size - 1 && spaces.every((r, idx) => r[size - 1 - idx] === player)) {
        winningCells = Array.from({ length: size }, (_, idx) => `${idx}-${size - 1 - idx}`);
    }

    return winningCells;
}



//confetti

const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
const colors = ['#FF0B0B', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
let confettiActive = false;//flag e 
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function startConfetti() {
    particles = []; // 0yacnel naxkin@
    confettiActive = true; // true depqum sksum e 
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 5 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            velocity: Math.random() * 3 + 1,
            direction: Math.random() * 2 * Math.PI,
        });
    }

    function draw() {
        if (!confettiActive) return; // Stop if not active
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            p.x += Math.cos(p.direction) * p.velocity;
            p.y += Math.sin(p.direction) * p.velocity;
            p.y += 0.1; // Gravity effect
            if (p.y > canvas.height) {
                p.y = -10; // Reset particle when it goes off screen
            }
        });
        requestAnimationFrame(draw);
    }
    draw();
}



