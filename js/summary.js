const time = new Date();

/**
 * Initializes the summary view of the application.
 *
 * This functions:
 * - Initializes task data with {@link initTask}.
 * - Fetches data from the API using {@link fetchInit}.
 * - Displays a welcome message via {@link summaryWelcome}.
 * - Renders the summary content using {@link renderSummary}.
 * - Highlights the corresponding navigation link with {@link highlightLink}.
 */
async function initSummary() {
    initTask();
    await fetchInit();
    summaryWelcome();
    renderSummary();
    highlightLink();
};

/**
 * Function to render the menu and header into the HTML
 */
function initTask() {
    document.getElementById("menuTemplate").innerHTML = checkLogged();
    document.getElementById("headerTemplate").innerHTML = header();
};

/**
 * highlight the summary link at the menu 
 */
function highlightLink() {
    const currentLink = document.getElementById('summary');
    currentLink.classList.add('activeLink');
};

/**
 * Function to display the greeting
 */
function summaryWelcome() {
    contentRef = document.getElementById("content");
    greetingTime = switchTime();
    greeting.innerHTML = greetingTime + getUserInfo();
};

/**
 * Function to get the correct greeting
 * 
 * Depends on daytime witch greeting displays on the HTML
 * 
 * @returns {string} - good morning, good afternoon or good evening
 */
function switchTime() {
    t = time.getHours();
    switch (true) {
        case (t >= 6 && t < 12):
            return "Good morning";
        case (t >= 12 && t <= 18):
            return "Good afternoon";
        default:
            return "Good evening";
    };
};

/**
 * Function to get the current user's name
 * 
 * Get the current user name from the logged in out of the localStorage.
 * And displays it or if the user name ist "guest" display nothing
 * 
 * @returns {string} - current user name or " "
 */
function getUserInfo() {
    let user = JSON.parse(localStorage.getItem("user"));
    switch (true) {
        case (user === "Guest"):
            return "";
        default:
            return `,` + `<p class="user-name">${user}</p>`;
    };
};

/**
 * Function to render the rows of the summary
 */
function renderSummary() {
    renderFirstRow();
    renderSecondRow();
    renderThirdRow();
};

/**
 * Renders the number of urgent tasks and displays the earliest due date
 * 
 * This function filters all tasks with the priority "urgent", counts them,
 * and updates the DOM with:
 * - The total number of urgent tasks
 * - The earliest date
 */
function renderSecondRow() {
    let allUrgents = document.getElementById('urgent');
    let currentUrgent = tasks.filter((i) => i.priority === "urgent");
    allUrgents.innerHTML = `${currentUrgent.length}`;
    let urgentDates = [];
    for (let index = 0; index < currentUrgent.length; index++) {
        urgentDates.push(new Date(currentUrgent[index].date))};
    const minDate = new Date(Math.min(...urgentDates));
    let urgentDate = document.getElementById('urgant-date');
    urgentDate.innerHTML = minDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric' });
};

/**
 * Renders the number of "to-does" and "done" tasks and displays them
 * 
 * This function filters all tasks with the status "to-do" and "done" counts them,
 * and updates the DOM with:
 * - The total number of to-does and done's tasks
 */
function renderFirstRow() {
    let allToDoes = document.getElementById('to-do');
    let currentToDoes = tasks.filter((i) => i.status === "toDo");
    allToDoes.innerHTML = `${currentToDoes.length}`;
    let allDones = document.getElementById('done');
    let currentDones = tasks.filter((i) => i.status === "done");
    allDones.innerHTML = `${currentDones.length}`;
};

/**
 * Renders the number of "all Tasks", "tasks in Progress" and "awaiting feedback" tasks and displays them
 * 
 * This function filters all tasks with the status "to-do" and "done" counts them,
 * and updates the DOM with:
 * - The total number of to-does and done's tasks
 */
function renderThirdRow() {
    let allTasks = document.getElementById('tasks-in-board');
    allTasks.innerHTML = `${tasks.length}`;
    let allInProgress = document.getElementById('tasks-in-progress');
    let currentInProgress = tasks.filter((i) => i.status === "inProgress");
    allInProgress.innerHTML = `${currentInProgress.length}`;
    let allAwait = document.getElementById('awaiting-feedback');
    let currentAwait = tasks.filter((i) => i.status === "await");
    allAwait.innerHTML = `${currentAwait.length}`;
};

/**
 * Add the body and the HTML the class "stopScrolling" for 2 seconds.
 * Removes it after
 */
window.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('stopScrolling');
    document.body.classList.add('stopScrolling');
    setTimeout(() => {
        document.documentElement.classList.remove('stopScrolling');
        document.body.classList.remove('stopScrolling');
    }, 2000);
});
