const timeDisplay = document.getElementById("time");
const pauseBtn = document.getElementById("pause");
let defaultTime = 1200;
let timeLeft = defaultTime;
let enableTimer = false;
let wasStarted = false;


function startTimer() {
    timeLeft = defaultTime;
    enableTimer = true;
    wasStarted = true;
};

function pauseTimer() {
    if (wasStarted) {
        enableTimer = !enableTimer;
        if (enableTimer) {
            pauseBtn.textContent = "Pause";
        } else {
            pauseBtn.textContent = "Continue";
        }
    }
};

function resetTimer() {
    wasStarted = false;
    
};

function tickTimer() {
    if (enableTimer) {
        timeLeft -= 1;
        timeLeft_seconds = timeLeft % 60;
        timeLeft_mins = Math.floor(timeLeft / 60);
        timeDisplay.textContent = `${timeLeft_mins}:${timeLeft_seconds}`;
        console.log(timeLeft);
    }
};

setInterval(tickTimer, 1000);