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

// Get high score from cookies
function getHighScore() {
    const match = document.cookie.match(/highScore=(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
}

// Set high score in cookies
function setHighScore(score) {
    document.cookie = `highScore=${score}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

// Update UI elements
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
        '#ff577f', '#ff884b', '#ffd384', '#fff9b0',  // Warm colors
        '#7fb77e', '#b1d7b4', '#f7f6dc', '#ffc090',  // Nature colors
        '#98d8aa', '#f7d794', '#ff8080', '#ffcf96'   // Pastel colors
    ];
    
    const shapes = ['circle', 'square', 'triangle', 'star'];
    
    // Clear any existing confetti
    confettiContainer.innerHTML = '';
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        
        // Random starting position
        confetti.style.left = `${Math.random() * 100}%`;
        
        // Random color from our palette
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random shape
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
        
        // Random size
        const size = Math.random() * 8 + 4; // 4-12px
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        // Random animation properties
        const duration = Math.random() * 2 + 2; // 2-4 seconds
        const delay = Math.random() * 0.5; // 0-0.5 second delay
        
        // Combined animation
        confetti.style.animation = `
            fall ${duration}s linear ${delay}s forwards,
            sway ${duration * 0.5}s ease-in-out ${delay}s infinite alternate,
            fade ${duration}s ease-out forwards
        `;
        
        confettiContainer.appendChild(confetti);
        
        // Cleanup
        setTimeout(() => confetti.remove(), (duration + delay) * 1000);
    }
}

// Check answer
function checkAnswer() {
    const correctAnswer = Math.pow(2, currentPower);
    const userAnswer = parseInt(answerInput.value, 10);

    if (userAnswer === correctAnswer) {
        feedback.textContent = `Correct! The answer was ${userAnswer}`;
        feedback.style.color = "green";
        score++;
        currentPower++;
        spawnConfetti();
    } else {
        feedback.textContent = `Wrong! The correct answer was ${correctAnswer}. (You put in ${userAnswer})`;
        feedback.style.color = "red";
        score = 0;
        currentPower = 0;
    }

    updatePowerDisplay();
    updateScoreBoard();
    answerInput.value = "";
    answerInput.focus();
}

// Toggle info modal
function toggleInfoModal() {
    infoModal.style.display = infoModal.style.display === "block" ? "none" : "block";
}

// Event listeners
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

// Initialize
updatePowerDisplay();
updateScoreBoard();
infoModal.style.display = "block";
