let currentPower = 0;
let zenPower = 0;
let score = 0;
let zenScore = 0;
let zenMisses = 0;
let isZenMode = false;
let normalFeedback = '';
let zenFeedback = '';


// Cookie functions
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function setCookie(name, value, days) {
    const expires = days ? `; expires=${new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()}` : '';
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
}


// Initialize mode and scores
function initialize() {
    isZenMode = getCookie('isZenMode') === 'true';
    
    currentPower = parseInt(getCookie('currentPower') || '0', 10);
    score = parseInt(getCookie('currentScore') || '0', 10);
    normalFeedback = getCookie('normalFeedback') || '';
    
    zenScore = parseInt(getCookie('zenScore') || '0', 10);
    zenPower = parseInt(getCookie('zenPower') || '0', 10);
    zenMisses = parseInt(getCookie('zenMisses') || '0', 10);
    zenFeedback = getCookie('zenFeedback') || '';

    console.log('isZenMode:', getCookie('isZenMode'));
    console.log('currentPower:', getCookie('currentPower'));
    console.log('currentScore:', getCookie('currentScore'));
    console.log('zenScore:', getCookie('zenScore'));
    console.log('zenPower:', getCookie('zenPower'));
    console.log('zenMisses:', getCookie('zenMisses'));
    


    updateScoreBoard();
    updatePowerDisplay();
    updateFeedback();
}


// DOM elements
const powerDisplay = document.getElementById("currentPower");
const answerInput = document.getElementById("answerInput");
const feedback = document.getElementById("feedback");
const scoreBoard = document.getElementById("scoreBoard");
const highScoreBoard = document.getElementById("highScoreBoard");
const restartButton = document.getElementById("restartButton");
const infoButton = document.getElementById("infoButton");
const infoModal = document.getElementById("infoModal");
const zenModeButton = document.getElementById("zenModeButton");


function updateFeedback() {
    feedback.textContent = isZenMode ? zenFeedback : normalFeedback;
    feedback.style.color = feedback.textContent.includes('Correct') ? 'green' : 
                          feedback.textContent.includes('Wrong') ? 'red' : 
                          feedback.textContent.includes('Hey') ? 'purple' : 'black';
}


function getHighScore() {
    return parseInt(getCookie('highScore') || '0', 10);
}

function setHighScore(newScore) {
    const currentHighScore = getHighScore();
    if (newScore > currentHighScore) {
        setCookie('highScore', newScore, 365);
    }
}

function updatePowerDisplay() {
    const displayPower = isZenMode ? zenPower : currentPower;
    powerDisplay.innerHTML = `2<sup>${displayPower}</sup>`;
}

function updateScoreBoard() {
    if (isZenMode) {
        scoreBoard.textContent = `Zen Score: ${zenScore} | Misses: ${zenMisses}`;
        highScoreBoard.style.display = "none";
    } else {
        scoreBoard.textContent = `Score: ${score}`;
        const highScore = getHighScore();
        highScoreBoard.textContent = `High Score: ${highScore}`;
        highScoreBoard.style.display = "block";
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
    const power = isZenMode ? zenPower : currentPower;
    const correctAnswer = 2n ** BigInt(power);
    const userAnswer = BigInt(answerInput.value);

    if (userAnswer === correctAnswer) {
        const feedbackText = `Correct! The answer was ${userAnswer.toString()}`;
        
        if (isZenMode) {
            zenScore++;
            zenPower++;
            zenFeedback = feedbackText;
            setCookie('zenScore', zenScore, 365);
            setCookie('zenPower', zenPower, 365);
            setCookie('zenFeedback', zenFeedback, 365);
        } else {
            score++;
            currentPower++;
            normalFeedback = feedbackText;
            setHighScore(score);
            setCookie('currentScore', score, 365);
            setCookie('currentPower', currentPower, 365);
            setCookie('normalFeedback', normalFeedback, 365);
        }
        
        handleCheckpoint(power);
    } else {
        if (correctAnswer === 1)
        {
            const feedbackText = `Wrong! The correct answer was ${correctAnswer.toString()}. (You put in ${userAnswer.toString()}) <a href="https://www.youtube.com/shorts/W-JoMPOe9HQ" target="_blank">Wanna know why?</a>`;
        }
        const feedbackText = `Wrong! The correct answer was ${correctAnswer.toString()}. (You put in ${userAnswer.toString()})`;
        
        if (isZenMode) {
            zenMisses++;
            zenFeedback = feedbackText;
            setCookie('zenFeedback', zenFeedback, 365);
            setCookie('zenMisses', zenMisses, 365);
        } else {
            setHighScore(score);
            normalFeedback = feedbackText;
            setCookie('normalFeedback', normalFeedback, 365);
            resetGame();
        }
    }

    updatePowerDisplay();
    updateScoreBoard();
    updateFeedback();
    answerInput.value = "";
    answerInput.focus();
}




function handleCheckpoint(power) {
    const messages = {
        31: "The end?",
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


    const funMessageCheckpoints = [];


    if (funMessageCheckpoints.includes(power)) {
        const rando = FUNSTRINGS[Math.floor(Math.random() * FUNSTRINGS.length)];
        messages[power] += ` ${rando}`;
    }

    spawnConfetti();
    if (messages[power]) {
        feedback.textContent += `\n${messages[power]}`;
        feedback.style.color = "purple";
    }
}


function toggleZenMode() {
    isZenMode = !isZenMode;
    setCookie('isZenMode', isZenMode.toString(), 365);
    
    updateScoreBoard();
    updatePowerDisplay();
    updateFeedback();
    
    if (isZenMode) {
        showSplash("Zen mode activated", "green");
    } else {
        showSplash("Zen mode disabled", "red");
    }
}

function resetGame() {
    if (isZenMode) {
        zenScore = 0;
        zenPower = 0;
        zenMisses = 0;
        zenFeedback = '';
        setCookie('zenScore', zenScore, 365);
        setCookie('zenPower', zenPower, 365);
        setCookie('zenMisses', zenMisses, 365);
        setCookie('zenFeedback', '', 365);
    } else {
        score = 0;
        currentPower = 0;
        normalFeedback = '';
        setCookie('currentScore', score, 365);
        setCookie('currentPower', currentPower, 365);
        setCookie('normalFeedback', '', 365);
    }
    updateScoreBoard();
    updatePowerDisplay();
    updateFeedback();
    answerInput.value = "";
    answerInput.focus();
}



function showSplash(message, color) {
    const splash = document.createElement("div");
    splash.style.position = "fixed";
    splash.style.top = "50%";
    splash.style.left = "50%";
    splash.style.transform = "translate(-50%, -50%)";
    splash.style.backgroundColor = color;
    splash.style.color = "white";
    splash.style.padding = "10px 20px";
    splash.style.borderRadius = "5px";
    splash.style.fontFamily = "Arial, sans-serif";
    splash.style.fontWeight = "bold";
    splash.style.animation = "fadeOut 2s forwards";
    splash.textContent = message;
    document.body.appendChild(splash);

    setTimeout(() => {
        splash.remove();
    }, 2000);
}

function toggleInfoModal() {
    infoModal.style.display = infoModal.style.display === "block" ? "none" : "block";
}


// Event listeners
zenModeButton.addEventListener("click", toggleZenMode);
document.getElementById("submitAnswer").addEventListener("click", checkAnswer);
answerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkAnswer();
    }
});
restartButton.addEventListener("click", resetGame);

infoButton.addEventListener("click", toggleInfoModal);

updatePowerDisplay();
updateScoreBoard();
infoModal.style.display = "block";
