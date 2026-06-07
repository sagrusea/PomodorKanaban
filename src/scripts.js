// const { userData } = require("three/tsl");
const timeDisplay = document.getElementById("time");
const pauseBtn = document.getElementById("pause");
const startBtn = document.getElementById("start");
const settingsOverlay = document.getElementById("settingsDIV");
const timerStatusDp = document.getElementById("timerStatus");
const progressBar = document.getElementById("progressBar");
let defaultTime = 10;
let defaultBreak = 300;
let status = 0; // 0 work | 1 break | 2 short break
let timeLeft = defaultTime;
let enableTimer = false;
let wasStarted = false;
let settings = {};
const phaseText = {
    work: "working",
    break: "break",
    shortBreak: "short break"
}
userData = {
    completedSessions: 0,
    current_phase: 0,
    last_phase: 0
}


addEventListener("DOMContentLoaded", async (event) => {
    settings = await loadSettings();
    applySettings();
    updateDisplay();
    loadKanaban();
    handlePhaseStatus();
})

// --- SETTINGS ----
async function saveSettings() {
    try {
        const serialSettings = JSON.stringify(settings);
        localStorage.setItem('userSettings', serialSettings);
        applySettings();
    } catch (error) {
        console.error("Saving failed:",error);
    }
}

async function loadSettings() {
    try {
        const serialSettings = localStorage.getItem('userSettings');
        if (serialSettings === null) return {workTime: 1500, breakTime: 300, doDiffrentBreaks: true};
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

    _settings = {
        workTime: formData.get("workTime_S") * 60,
        breakTime: formData.get("breakTime_S") * 60,
        doDiffrentBreaks: formData.get("doDiffrentBreaks_S") === "on"
    };
    settings = _settings;
    saveSettings();
}

function applySettings() {
    defaultTime = settings.workTime;
    defaultBreak = settings.breakTime;
    timeLeft = defaultTime;
}

// ---- KANABAN ----

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

        saveKanaban();
    }
}

function saveKanaban() {
    try {
        const kanabanState = {
            todo: [],
            doing: [],
            done: []
        };

        document.querySelectorAll('#todo-column .task-card').forEach(card => {
            kanabanState.todo.push({ id: card.id, text: card.querySelector("p").textContent })
        });

        document.querySelectorAll('#doing-column .task-card').forEach(card => {
            kanabanState.doing.push({ id: card.id, text: card.querySelector("p").textContent })
        });

        document.querySelectorAll('#done-column .task-card').forEach(card => {
            kanabanState.done.push({ id: card.id, text: card.querySelector("p").textContent })
        });

        localStorage.setItem("kanabanSave", JSON.stringify(kanabanState));
    } catch (error) {
        console.error("failed to save the kanaban", error);
    }
}

function loadKanaban() {
    try {
        const savedState = localStorage.getItem("kanabanSave");
        if (!savedState) return;
        const kanabanState =JSON.parse(savedState);

        document.querySelectorAll(".task-list").forEach(list => list.innerHTML = "");

        Object.keys(kanabanState).forEach(columnKey => {
            const columnID = `${columnKey}-column`;
            const columnContainer = document.querySelector(`#${columnID} .task-list`);

            if (columnContainer) {
                kanabanState[columnKey].forEach(cardData => {
                    const cardElement = createCardElement(cardData.id, cardData.text);
                    columnContainer.appendChild(cardElement);
                });
            }
        });
    } catch (error) {
        console.error("failed to load kanaban:", error);
    }
}

function createCardElement(id ,text) {
    const article = document.createElement("article");
    article.className = "task-card";
    article.draggable = true;
    article.id = id;

    article.addEventListener("dragstart", drag);

    const p = document.createElement("p");
    p.textContent = text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-card-btn";
    deleteBtn.innerHTML = "&times;";

    deleteBtn.onclick = function(event) {
        event.stopPropagation();
        article.remove();
        saveKanaban();
    };

    article.appendChild(p);
    article.appendChild(deleteBtn);
    return article;
}

function handleNewCard(event, columnID) {
    if (event.key !== "Enter") return;

    const inputField = event.target;
    const taskText = inputField.value.trim();

    if (taskText === "") return;

    const uniqueID = "task-" + Date.now();

    const newCard = createCardElement(uniqueID, taskText);
    const targetList = document.querySelector(`#${columnID} .task-list`);

    if (targetList) {
        targetList.appendChild(newCard);

        saveKanaban();
        inputField.value = "";
    }
}
// ----- TIMER FUNCTIONS ----

function switchPhase() {
    // 0 work | 1 break | 2 short break
    if (userData.current_phase === 0) {
        userData.completedSessions++;

        if (settings.doDiffrentBreaks && userData.completedSessions % 4 === 0) {
            userData.current_phase = 1;
            defaultTime = timeLeft = settings.breakTime*3;
           
        } else {
            userData.current_phase = 2;
            defaultTime = timeLeft = settings.breakTime;
            timerStatusDp.textContent = phaseText.shortBreak;
        }
    } else {
        userData.current_phase = 0;
        defaultTime = timeLeft = settings.workTime;
        userData.completedSessions++;
    }
}

function handlePhaseStatus() {
    switch (userData.current_phase) {
        case 0:
            timerStatusDp.textContent = phaseText.work;
            break;
        case 1:
            timerStatusDp.textContent = phaseText.break;
            break;
        case 2:
            timerStatusDp.textContent = phaseText.shortBreak;
            break;
        default:
            break;
    }
}

function startTimer() {
    if (!wasStarted) {
        handlePhaseStatus();
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
    userData = {
        completedSessions: 0,
        current_phase: 0,
        last_phase: 0
    }
    handlePhaseStatus();
};

function tickTimer() {
    if (enableTimer) {
        if (timeLeft > 0) {
            timeLeft -= 1;
            updateDisplay();
        } else { 
            enableTimer = false;
            switchPhase();
            handlePhaseStatus();
            enableTimer = true;
        }
    }
};

function updateDisplay() {
    let timeLeft_seconds = timeLeft % 60;
    let timeLeft_mins = Math.floor(timeLeft / 60);

    let displaySeconds = String(timeLeft_seconds).padStart(2, '0');
    let displayMinutes = String(timeLeft_mins).padStart(2, '0');

    timeDisplay.textContent = `${displayMinutes}:${displaySeconds}`;

    const progress = defaultTime > 0 ? (timeLeft / defaultTime) * 100 : 0;
    progressBar.style.width = `${progress}%`;
}

setInterval(tickTimer, 1000);

function resetSettings() {
    // TODO: make my own confirmation to make the app smoother.
    confirm("Do you want to reset your settings?");
    settings = {
        workTime: 1500, 
        breakTime: 300, 
        doDiffrentBreaks: true
    };
    applySettings();
    updateDisplay();
    console.log("Oh no i forgot your settings :)")
    saveSettings();
}


// ---- USER DATA ----
async function saveUserData() {
    try {
        const _userData = JSON.stringify(userData);
        localStorage.setItem("userData", _userData);
    } catch (error) {
        console.error("couldnt save data:", error);
    }
}

async function loadUserData() {
    try {
        const _userData = localStorage.getItem("userData");
        if (userData === null) return 0;
        return JSON.parse(_userData);
    } catch (error) {
        console.error("couldn load user data:", error);
    }
}