let colorVariants = ["variant1", "variant2", "variant3", "variant4", "variant5", "variant6", "variant7", "variant8", "variant9", "variant10", "variant11", "variant12", "variant13", "variant14", "variant15"]
let categoryVariants = [];
let subtaskArray = [];
let assignedTo = [];
let assignedToVariants = [];
let subtask = 0;
let subtaskTotal = 0;
let touchTimer = null;
let touchStartTime = 0;
let hasStartedDragging = false;
let canStartDrag = false;
let hasMoved = false;

/**
 * This function initializes the board.html and fetches the saved tasks and contacts
 */
async function initboard() {
    document.getElementById("menuTemplate").innerHTML = checkLogged();
    document.querySelector("header").innerHTML = header();
    initAvatarSlider();
    await fetchTasks();
    await fetchContacts();
    clearBoardTable();
    renderTasks(contacts);
    highlightLink();
}

/**
 * This function highlights the chosen link in the menu
 */
function highlightLink() {
    const currentLink = document.getElementById('board')
    currentLink.classList.add('activeLink');
};

/**
 * This function renders the actual fetched tasks
 * 
 * @param {array} contacts - This function uses the fetched contacts array to render and assign the tasks
 */
function renderTasks(contacts) {
    for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
        if (tasks[taskIndex].status == "toDo") {
            renderTaskToDo(taskIndex, contacts);}
        else if (tasks[taskIndex].status == "inProgress") {
            renderTaskInProgress(taskIndex, contacts);}
        else if (tasks[taskIndex].status == "await") {
            renderTaskAwait(taskIndex, contacts);}
        else if (tasks[taskIndex].status == "done") {
            renderDone(taskIndex, contacts);}
    }
    renderDropZones();
}

/**
 * This function clears the board table to render new content.
 */
function clearBoardTable() {
    document.getElementById("taskToDo").innerHTML = "";
    document.getElementById("taskInProgress").innerHTML = "";
    document.getElementById("taskAwaitFeedback").innerHTML = "";
    document.getElementById("taskDone").innerHTML = "";
    document.getElementById("emptyTask0").classList.remove("d_none");
    document.getElementById("emptyTask0").classList.add("emptyTask");
    document.getElementById("emptyTask1").classList.remove("d_none");
    document.getElementById("emptyTask1").classList.add("emptyTask");
    document.getElementById("emptyTask2").classList.remove("d_none");
    document.getElementById("emptyTask2").classList.add("emptyTask");
    document.getElementById("emptyTask3").classList.remove("d_none");
    document.getElementById("emptyTask3").classList.add("emptyTask");
}

/**
 * This function renders the dropzones for the moved cards
 */
function renderDropZones() {
    document.getElementById("taskToDo").innerHTML += renderDropZone("dropzone#TaskToDo");
    document.getElementById("taskInProgress").innerHTML += renderDropZone("dropzone#TaskInProgress");
    document.getElementById("taskAwaitFeedback").innerHTML += renderDropZone("dropzone#TaskAwaitFeedback");
    document.getElementById("taskDone").innerHTML += renderDropZone("dropzone#TaskDone");
}

/**
 * This function renders the "To do" tasks as a card template from card.js
 * and adds the task informations
 * 
 * @param {number} taskIndex - This is the index number from the tasks array
 * @param {array} contacts - This is the array in which all contacts are pushed
 */
function renderTaskToDo(taskIndex, contacts) {
    document.getElementById("emptyTask0").classList.remove("emptyTask");
    document.getElementById("emptyTask0").classList.add("d_none");
    const container = document.getElementById("taskToDo");
    container.insertAdjacentHTML("beforeend", renderCard(taskIndex));
    findBackgroundColor(taskIndex);
    getSubtasks(taskIndex);
    getAssignedTo(taskIndex, contacts);
    getPriority(taskIndex);
    const cardElement = document.getElementById(`card${taskIndex}`);
    enableTouchDrag(cardElement, taskIndex);
}

/**
 * This function renders the "in progress" tasks as a card template from card.js
 * and adds the task informations
 * 
 * @param {number} taskIndex - This is the index number from the tasks array
 * @param {array} contacts - This is the array in which all contacts are pushed
 */
function renderTaskInProgress(taskIndex, contacts) {
    const empty = document.getElementById("emptyTask1");
    empty.classList.remove("emptyTask");
    empty.classList.add("d_none");
    const container = document.getElementById("taskInProgress");
    container.insertAdjacentHTML("beforeend", renderCard(taskIndex));
    findBackgroundColor(taskIndex);
    getSubtasks(taskIndex);
    getAssignedTo(taskIndex, contacts);
    getPriority(taskIndex);
    const cardElement = document.getElementById(`card${taskIndex}`);
    enableTouchDrag(cardElement, taskIndex);
}

/**
 * This function renders the "Await feedback" tasks as a card template from card.js
 * and adds the task informations
 * 
 * @param {number} taskIndex - This is the index number from the tasks array
 * @param {array} contacts - This is the array in which all contacts are pushed
 */
function renderTaskAwait(taskIndex, contacts) {
    const empty = document.getElementById("emptyTask2");
    empty.classList.remove("emptyTask");
    empty.classList.add("d_none");
    const container = document.getElementById("taskAwaitFeedback");
    container.insertAdjacentHTML("beforeend", renderCard(taskIndex));
    findBackgroundColor(taskIndex);
    getSubtasks(taskIndex);
    getAssignedTo(taskIndex, contacts);
    getPriority(taskIndex);
    const cardElement = document.getElementById(`card${taskIndex}`);
    enableTouchDrag(cardElement, taskIndex);
}

/**
 * This function renders the "Done" tasks as a card template from card.js
 * and adds the task informations
 * 
 * @param {number} taskIndex - This is the index number from the tasks array
 * @param {array} contacts - This is the array in which all contacts are pushed 
 */
function renderDone(taskIndex, contacts) {
    const empty = document.getElementById("emptyTask3");
    empty.classList.remove("emptyTask");
    empty.classList.add("d_none");
    const container = document.getElementById("taskDone");
    container.insertAdjacentHTML("beforeend", renderCard(taskIndex));
    findBackgroundColor(taskIndex);
    getSubtasks(taskIndex);
    getAssignedTo(taskIndex, contacts);
    getPriority(taskIndex);
    const cardElement = document.getElementById(`card${taskIndex}`);
    enableTouchDrag(cardElement, taskIndex);
}


/**
 * This function finds the background color for the initials of the contacts, which are
 * assigned to the current task. If no contact is found, it pushes a new color-variant
 * in the categoryVariants array
 * 
 * @param {number} taskIndex - This is the index number from the tasks array 
 */
function findBackgroundColor(taskIndex) {
    if (categoryVariants.find(({ category }) => category == tasks[taskIndex].category)) {
        let searchWord = tasks[taskIndex].category;
        let categoryVariantsIndex = categoryVariants.findIndex(v => v.category === searchWord);
        document.getElementById("taskCategory#" + taskIndex).classList.add(categoryVariants[categoryVariantsIndex].variant)
    } else {
        categoryVariants.push({
            variant: colorVariants[categoryVariants.length],
            category: tasks[taskIndex].category,
        })
        document.getElementById("taskCategory#" + taskIndex).classList.add(colorVariants[categoryVariants.length - 1])
    }
}

/**
 * This function finds all subtasks from the current task
 * 
 * @param {number} taskIndex - This is the index number from the tasks array 
 */
function getSubtasks(taskIndex) {
    subtask = 0;
    if (tasks[taskIndex].subtasks === undefined) {
        document.getElementById("subtasks#" + taskIndex).style.display = "none";
    }
    getSubtaskIndex(taskIndex);
    for (let subtaskIndex = 0; subtaskIndex < subtaskArray.length; subtaskIndex++) {
        if (subtaskArray[subtaskIndex].done == true) {
            subtask++;
        }
        subtaskTotal++;
    }
    renderSubtasks(taskIndex);
}

/**
 * This function renders the subtasks in the current task card
 * 
 * @param {number} taskIndex - This is the index number from the tasks array 
 */
function renderSubtasks(taskIndex) {
    document.getElementById("subtaskDone#" + taskIndex).innerHTML = subtask + "/" + subtaskTotal + " Subtask";
    document.getElementById("innerScale#" + taskIndex).style.width = Math.abs(Number((subtask / subtaskTotal) * 128)) + "px";
    subtask = 0;
    subtaskTotal = 0;
    subtaskArray = [];
}

/**
 * This function saves all found subtasks from tasks[taskindex] in the subtaskArray
 * 
 * @param {number} taskIndex - This is the index number from the tasks array
 */
function getSubtaskIndex(taskIndex) {
    const task = tasks[taskIndex];
    if (task.subtasks) {
        Object.entries(task.subtasks).forEach(([key, value], subIndex) => {
            subtaskArray.push({
                taskIndex,
                subIndex,
                taskName: task.name,
                key,
                title: value.title,
                done: value.done
            });
        });
    }}

/**
 * This function finds the task priority and renders it into the task card
 * 
 * @param {number} taskIndex - This is the index number from the tasks array 
 */
function getPriority(taskIndex) {
    let cardPriority = tasks[taskIndex].priority;
    if (cardPriority == "urgent") {
        document.getElementById("priority#" + taskIndex).innerHTML = renderPriority(taskIndex, cardPriority);
    } else if (cardPriority == "medium") {
        document.getElementById("priority#" + taskIndex).innerHTML = renderPriority(taskIndex, cardPriority);
    } else {
        document.getElementById("priority#" + taskIndex).innerHTML = renderPriority(taskIndex, cardPriority);
    }
}


/**
 * This function calls the getAssignedTiInitials() function
 * 
 * @param {number} taskIndex - This is the index number from the tasks array 
 * @param {array} contacts - This is the array in which all contacts are pushed 
 */
function getAssignedTo(taskIndex, contacts, full) {
    getAssignedToInitials(taskIndex, contacts, full);
}

/**
 * This function prepares the finding of the initial letters from each assigned 
 * contact and pushes them into the assignedTo array
 * 
 * @param {number} taskIndex - This is the index number from the tasks array 
 * @param {array} contacts - This is the array in which all contacts are pushed 
 */
function getAssignedToInitials(taskIndex, contacts, full) {
    if (tasks[taskIndex].assigned_to) {
        for (const [key, value] of Object.entries(tasks[taskIndex].assigned_to)) {
            let nameValue = value;
            assignedTo.push(`${nameValue}`);
        };
        establishInitials(taskIndex, contacts, full);
        assignedTo = [];
    } else {
        return
    };
}

/**
 * This function finds the initial letters from each assigned contact and renders them
 * in the task card
 * 
 * @param {number} taskIndex - This is the index number from the tasks array 
 * @param {array} contacts - This is the array in which all contacts are pushed 
 */
function establishInitials(taskIndex, contacts, full) {
    const contentPlace = document.getElementById("taskAssignment" + taskIndex);
    for (let index = 0; index < assignedTo.length; index++) {
        if (index == 5 && !full) {
            contentPlace.innerHTML = moreMemberCardTemplate(); return}
        let name = assignedTo[index];
        let parts = name.split(' ');
        let initials = '';
        for (let i = 0; i < parts.length; i++) {
            if (parts[i].length > 0 && parts[i] !== '') {
                initials += parts[i][0]}}
        document.getElementById("assignedTo#" + taskIndex).innerHTML += renderInitials(taskIndex, initials, index);
        getAssignedToVariants(taskIndex, initials, index, contacts);
    }}

/**
 * This function is used to find the peviously saved color variant for the assigned contact
 * from the contacts array. Otherwise a random color will be assigned to the assigned initials 
 * 
 * @param {number} taskIndex - This is the index number from the tasks array 
 * @param {string} initials - These are the found initials of the assigned people
 * @param {number} index - This is the index number from the assignedTo array 
 * @param {array} contacts - This is the array in which all contacts are pushed 
 */
function getAssignedToVariants(taskIndex, initials, index, contacts) {
    let nameToFind = Object.entries(tasks[taskIndex].assigned_to)[index][1];
    if (contacts.find(({ name }) => name == nameToFind)) {
        establishKnownVariant(taskIndex, initials, index);
    } else {
        document.getElementById("assignedToInitial#" + initials + "#" + index + "#" + taskIndex).style.backgroundColor = getRandomColor();
        if (index != 0) {
            document.getElementById("assignedToInitial#" + initials + "#" + index + "#" + taskIndex).classList.add("positionAddInitials");
        }
    }
}

/**
 * This function establishes the found color variant from a known assigned contact
 * 
 * @param {number} taskIndex - This is the index number from the tasks array 
 * @param {string} initials - These are the found initials of the assigned people 
 * @param {number} index - This is the index number from the assignedTo array 
 */
function establishKnownVariant(taskIndex, initials, index) {
    let searchWord = Object.entries(tasks[taskIndex].assigned_to)[index][1];
    let colorIndex = contacts.findIndex(v => v.name === searchWord);
    document.getElementById("assignedToInitial#" + initials + "#" + index + "#" + taskIndex).style.backgroundColor = contacts[colorIndex].color;
    if (index != 0) {
        document.getElementById("assignedToInitial#" + initials + "#" + index + "#" + taskIndex).classList.add("positionAddInitials");
    }
}

/**
 * This function establishes a random color variant for an unknown contact
 * 
 * @returns - The function returns a random color code from the colors array
 */
function getRandomColor() {
    const colors = ["#6E52FF", "#FFA35E", "#FFE62B", "#00BEE8", "#FF5EB3", "#FFBB2B", "#FF745E", "#C3FF2B", "#FF7A00", "#1FD7C1", "#0038FF", "#FFC701", "#9327FF", "#FC71FF", "#FF4646"];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * This function listens to the search input field in the task board to find the wanted
 * task
 */
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.taskSearchInput');
    searchInput.addEventListener('input', filterTasks);
});

/**
 * This function dynamically searches for tasks which fit to the input objects
 * 
 * @param {object} event - This is the search input object
 */
function filterTasks(event) {
    const searchTerm = event.target.value.toLowerCase();
    const taskCards = document.querySelectorAll('.taskCard');
    taskCards.forEach(card => {
        const content = card.innerText.toLowerCase();
        card.style.display = content.includes(searchTerm) ? 'flex' : 'none';
    });
}