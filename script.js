let currentPower = 0;
let score = 0;

const powerDisplay = document.getElementById("currentPower");
const answerInput = document.getElementById("answerInput");
const feedback = document.getElementById("feedback");
const scoreBoard = document.getElementById("scoreBoard");
const highScoreBoard = document.getElementById("highScoreBoard");
const restartButton = document.getElementById("restartButton");
const infoButton = document.getElementById("infoButton");
const infoModal = document.getElementById("infoModal");

function getHighScore() {
    const match = document.cookie.match(/highScore=(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
}

function setHighScore(score) {
    document.cookie = `highScore=${score}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

function updatePowerDisplay() {
    powerDisplay.innerHTML = `2<sup>${currentPower}</sup>`;
}

function updateScoreBoard() {
    scoreBoard.textContent = `Score: ${score}`;
    const highScore = getHighScore();
    if (score > highScore) {
        setHighScore(score);
        highScoreBoard.textContent = `High Score: ${score}`;
    } else {
        highScoreBoard.textContent = `High Score: ${highScore}`;
    }
}

function spawnConfetti() {
    const confettiContainer = document.getElementById("confettiContainer");
    const colors = [
        '#ff577f', '#ff884b', '#ffd384', '#fff9b0', 
        '#7fb77e', '#b1d7b4', '#f7f6dc', '#ffc090', 
        '#98d8aa', '#f7d794', '#ff8080', '#ffcf96'  
    ];
    
    const shapes = ['circle', 'square', 'triangle', 'star'];
    

    confettiContainer.innerHTML = '';
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        
    
        confetti.style.left = `${Math.random() * 100}%`;
        
    
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
    
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        if (shape === 'circle') {
            confetti.style.borderRadius = '50%';
        } else if (shape === 'triangle') {
            confetti.style.backgroundColor = 'transparent';
            confetti.style.borderLeft = '5px solid transparent';
            confetti.style.borderRight = '5px solid transparent';
            confetti.style.borderBottom = `10px solid ${colors[Math.floor(Math.random() * colors.length)]}`;
            confetti.style.width = '0';
            confetti.style.height = '0';
        } else if (shape === 'star') {
            confetti.innerHTML = '★';
            confetti.style.backgroundColor = 'transparent';
            confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.fontSize = '10px';
        }
        
    
        const size = Math.random() * 8 + 4;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
    
        const duration = Math.random() * 2 + 2;
        const delay = Math.random() * 0.5;
        
    
        confetti.style.animation = `
            fall ${duration}s linear ${delay}s forwards,
            sway ${duration * 0.5}s ease-in-out ${delay}s infinite alternate,
            fade ${duration}s ease-out forwards
        `;
        
        confettiContainer.appendChild(confetti);
        
    
        setTimeout(() => confetti.remove(), (duration + delay) * 1000);
    }
}

function checkAnswer() {
    const correctAnswer = Math.pow(2, currentPower);
    const userAnswer = parseInt(answerInput.value, 10);

    if (userAnswer === correctAnswer) {
        feedback.textContent = `Correct! The answer was ${userAnswer}`;
        feedback.style.color = "green";
        score++;
        currentPower++;
        spawnConfetti();
        handleCheckpoint(currentPower);
    } else if (currentPower === 0 && userAnswer != correctAnswer) {
        feedback.innerHTML = `Wrong! The correct answer was ${correctAnswer}. (You put in ${userAnswer}). <a href="https://www.youtube.com/shorts/W-JoMPOe9HQ" target="_blank">Wanna know why?</a>`;
        feedback.style.color = "red";
        resetGame();
    } else {
        feedback.textContent = `Wrong! The correct answer was ${correctAnswer}. (You put in ${userAnswer})`;
        feedback.style.color = "red";
        resetGame();
    }

    updatePowerDisplay();
    updateScoreBoard();
    answerInput.value = "";
    answerInput.focus();
}

function handleCheckpoint(power) {
    const messages = {
        10: "",
        15: "",
        18: "",
        22: "",
        25: "",
        29: "",
        31: "The end?, ",
        32: " Hey, you're at the 32-bit Integer limit, You're doing calculations beyond what many 2002-era systems could handle natively. Amazing!",
        64: " 64-bit integer limit!, Nah, you wouldn't get here right?... right??, im not even surprised on how you got here, im surprised that the JS Engine hasn't overflowed.",
        128: " You've reached so high, here's my password: kingkalingkung123 (ha.. you tried??)"
    };

    const FUNSTRINGS = [
        "GO KING 👑",
        "Hello World... did you think im that basic?",
        "OOGA BOOGA!!!!!!!",
        "Roses are red, violets are blue, if you're reading this, you wasted 5 seconds",
        "Powered by ⅝ Hamster Wheel?",
        "Do you like feet?, YES I DO. wait who said that?",
        "Beware of the man who speaks in hands...",
        "Beware of the man who likes roses, well maybe a particular rose.",
        "I'm not singing for an ex though...",
        "Is mayonnaise an instrument?",
        "404: Sense of humor not found. Please reboot.",
        "Have you tried turning it off and on again?",
        "This is my splash text. There are many like it, but this one is mine.",
        "Warning: May spontaneously combust into confetti.",
        "Brought to you by the letter 'M' (and also other letters).",
        "I'm not a robot... beep boop.",
        "Don't forget to save your progress! (Or don't. Live dangerously.)",
        "If you win, I'll give you a chance of putting a splash text here",
        "Don't hurt yourself over this game okay?",
        "Loading... (Still loading... Just kidding!)",
        "This game is best played with copious amounts of snacks.",
        "My other splash text is a lie."
    ];


    const funMessageCheckpoints = [10, 15, 22, 25, 29];


    if (funMessageCheckpoints.includes(power)) {
        const rando = FUNSTRINGS[Math.floor(Math.random() * FUNSTRINGS.length)];
        messages[power] += ` ${rando}`;
    }


    if (messages[power]) {
        feedback.textContent += `\n${messages[power]}`;
        feedback.style.color = "purple";
        spawnConfetti();
    }
}


function resetGame() {
    score = 0;
    currentPower = 0;
}


function toggleInfoModal() {
    infoModal.style.display = infoModal.style.display === "block" ? "none" : "block";
}

document.getElementById("submitAnswer").addEventListener("click", checkAnswer);

answerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkAnswer();
    }
});

restartButton.addEventListener("click", () => {
    score = 0;
    currentPower = 0;
    feedback.textContent = "";
    updatePowerDisplay();
    updateScoreBoard();
    answerInput.value = "";
    answerInput.focus();
});

infoButton.addEventListener("click", toggleInfoModal);

updatePowerDisplay();
updateScoreBoard();
infoModal.style.display = "block";
