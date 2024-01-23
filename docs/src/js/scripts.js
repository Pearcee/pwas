
// JS file for cycleTracker app

// -------------
// Variable declarations
// -------------
const newLogFormEl = document.getElementsByTagName("form")[0];
const logLocationEl = document.getElementById("log-location");
const logDateEl = document.getElementById("log-date");
const logMilageEl = document.getElementById("log-milage");
const logRangeEl = document.getElementById("log-range");
const pastLogsContainer = document.getElementById("past-logs");
const logDate = new Date() 

// Storage key is an app-wide constant
const STORAGE_KEY = "milage-logger";

// -------------
// Event Handlers
// -------------
newLogFormEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const logLocation = logLocationEl.value;
    const logDate = logDateEl.value;
    const logMilage = logMilageEl.value;
    const logRange = logRangeEl.value;

    storeNewLog(logLocation, logDate, logMilage, logRange);
    renderPastLogs();
    newLogFormEl.reset();
    setTime();
    setMilage();
    setRange();
});

// document.getElementById('log-date').value = logDate ; // "yyyy-MM-ddThh:mm"
window.addEventListener('load', () => {
    setTime();
    setMilage();
    setRange();
});

// 2. Get, add, sort, and store data
function storeNewLog(logLocation, logDate, logMilage, logRange) {
    var now = new Date();
    const logs = getAllStoredLogs();
    logs.push({ logLocation, logDate, logMilage, logRange, now });
    logs.sort((a, b) => {
        return new Date(b.logDate) - new Date(a.logDate);
    });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    // console.log(logDate)
}

// 3. Get and parse data
function getAllStoredLogs() {
    const data = window.localStorage.getItem(STORAGE_KEY);
    const logs = data ? JSON.parse(data) : [];
    return logs;
}

// 4. Display data
function renderPastLogs() {
    const pastLogsHeader = document.createElement("h2");
    const pastLogsList = document.createElement("ul");
    const logs = getAllStoredLogs();
    if (logs.length === 0) {
        return;
    }
    pastLogsContainer.innerHTML = "";
    pastLogsHeader.textContent = "Past logs";
    logs.forEach((logs) => {
        const logsEl = document.createElement("li");
        logsEl.textContent = `
            ${formatDate(logs.logDate,)} 
            ${(logs.logMilage)}
            ${(logs.logRange)}
            ${(logs.logLocation)}`;
        pastLogsList.appendChild(logsEl);
    });

    pastLogsContainer.appendChild(pastLogsHeader);
    pastLogsContainer.appendChild(pastLogsList);
    setTime();
}

// 5. format dates for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-UK", { timeZone: "UTC" }) // +" " + date.toLocaleTimeString("en-UK", { timeZone: "UTC" });
}

function setTime() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    /* remove second/millisecond if needed - credit ref. https://stackoverflow.com/questions/24468518/html5-input-datetime-local-default-value-of-today-and-current-time#comment112871765_60884408 */
    now.setMilliseconds(null)
    now.setSeconds(null)

    document.getElementById('log-date').value = now.toISOString().slice(0, -1);
}

function getMax(arr, prop) {
    var max;
    for (var i = 0; i < arr.length; i++) {
        if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
            max = arr[i];
    }
    return max.logMilage;
}

function setMilage() {
    const logs = getAllStoredLogs();
    var max = getMax(logs, "logMilage");
    document.getElementById('log-milage').value = max;
}

function setRange() {
    document.getElementById('log-range').value = 80;
}

renderPastLogs()
console.log("Its me")