const timeDisplay = document.getElementById("time");
const pauseBtn = document.getElementById("pause");
const startBtn = document.getElementById("start");
const settingsOverlay = document.getElementById("settingsDIV");
let defaultTime = 1500;
let defaultBreak = 300;
let status = 0; // 0 work | 1 break | 2 short break
let timeLeft = defaultTime;
let enableTimer = false;
let wasStarted = false;
let settings = {}


addEventListener("DOMContentLoaded", (event) => {
    updateDisplay();
    settings = loadSettings();
})

async function saveSettings() {
    try {
        const serialSettings = JSON.stringify(settings);
        localStorage.setItem('userSettings', serialSettings);
    } catch (error) {
        console.error("Saving failed:",error);
    }
}

async function loadSettings() {
    try {
        const serialSettings = localStorage.getItem('userSettings');
        if (serialSettings === null) return 0;
        return JSON.parse(serialSettings);
    } catch (error) {
        console.error("loading failed:",error);
        return 0;
    }
}

function openSettings() {
    settingsOverlay.classList.remove("hidden");

}
function closeSettings() {
    settingsOverlay.classList.add("hidden");
}

function handleSettings(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    //todo

}

function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();

    const cardID = event.dataTransfer.getData("text/plain");
    const draggedCard = document.getElementById(cardID);

    const targetList = event.target.closest('.task-list');

    if (targetList) {
        targetList.appendChild(draggedCard);
    }
}

function startTimer() {
    if (!wasStarted) {
        timeLeft = defaultTime;
        enableTimer = true;
        wasStarted = true;
        startBtn.setAttribute('disabled', true);
    }
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
    timeLeft = defaultTime;
    wasStarted = false;
    enableTimer = false;
    startBtn.removeAttribute('disabled');
    updateDisplay();
};

function tickTimer() {
    if (enableTimer) {
        if (timeLeft > 0) {
            timeLeft -= 1;
            updateDisplay();
        } else enableTimer = false;
    }
};

function updateDisplay() {
    let timeLeft_seconds = timeLeft % 60;
    let timeLeft_mins = Math.floor(timeLeft / 60);

    let displaySeconds = String(timeLeft_seconds).padStart(2, '0');
    let displayMinutes = String(timeLeft_mins).padStart(2, '0');

    timeDisplay.textContent = `${displayMinutes}:${displaySeconds}`;
}

setInterval(tickTimer, 1000);