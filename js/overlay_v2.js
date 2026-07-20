/**
 * Initializes form input validation for the "Create Task" button.
 * The button is enabled only if all required fields (title, due date, category) are filled.
 * Uses an interval to continuously check form input validity.
 */
function initValidation() {
    const submitButton = document.getElementById("creatTask");
    const title = document.getElementById("title");
    const dueDate = document.getElementById("dueDate");
    const category = document.getElementById("category");
    if (!title || !dueDate || !category || !submitButton) {
        console.warn("No formula elements found."); return; };
    if (validationInterval !== null) return;
    validationInterval = setInterval(() => {
        const isValid =
            title.value.trim() !== "" &&
            dueDate.value.trim() !== "" &&
            category.value.trim() !== "";
        submitButton.disabled = !isValid; }, 200);
};

/**
 * Stops the ongoing form validation interval if it is running.
 * This prevents further automatic checks of input fields.
 */
function stopValidation() {
    if (validationInterval !== null) {
        clearInterval(validationInterval);
        validationInterval = null;
    };
};

/**
 * This function closes the add task overlay board
 */
function closeAddTaskBoard() {
    isAddTaskOverlayOpen = false;
    const addTaskBoardRef = document.getElementById('addTaskBoard');
    addTaskBoardRef.classList.remove('open_addTask');
    addTaskBoardRef.classList.add('closed_addTask');
    addTaskBoardRef.innerHTML = "";
    document.getElementById('addTaskBoardContainer').classList.add('hidden');
    stopValidation();
}

/**
 * This function clears the entries of the add task board
 */
function cancelTask() {
    const submitButton = document.getElementById("creatTask");
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("dueDate").value = "";
    document.getElementById('category').value = "";
    document.getElementById("memberForTask").innerHTML = "";
    document.getElementById("subtask").value = "";
    subtaskList.innerHTML = "";
    submitButton.disabled = true;
    addCss('medium');
    assignedMembers = [];
};

/**
 * This function checks the input of the add task title onfocusout
 */
function checkTitle() {
    let title = document.getElementById('title');
    let warningText = document.getElementById('warning-title');
    if (title.value.length <= 0) {
        getRedBorder(title);
    } else {
        title.classList.remove('red-border');
        warningText.classList.add('d_none');
    };
};

/**
 * This function checks the input of the add task dueDate onfocusout
 */
function checkDate() {
    let date = document.getElementById('dueDate');
    let warningText = document.getElementById('warning-dueDate');
    if (date.value === '') {
        getRedBorder(date);
    } else {
        date.classList.remove('red-border');
        warningText.classList.add('d_none');
    };
};

/**
 * This function creates a warning message and a red boarder around an input field if there
 * is no input
 * 
 * @param {Element} input - This function uses an Element to establish the red boarder
 */
function getRedBorder(input) {
    input.classList.add('red-border');
    let warningText = document.getElementById('warning-' + input.id);
    warningText.classList.remove('d_none');
};

/**
 * This function checks the input of the add task category onfocusout
 */
function checkCategory() {
    let category = document.getElementById('category');
    let warningText = document.getElementById('warning-category');
    if (category.value === '') {
        getRedBorder(category);
    } else {
        category.classList.remove('red-border');
        warningText.classList.add('d_none');
    };
};

/**
 * This function checks the subtask via onkeyup on the input field
 */
function checkSubtask() {
    let subtaskRef = document.getElementById('subtask');
    let subtaskPlus = document.getElementById('subtask-plus');
    let subtaskIcons = document.getElementById('subtask-icon-container');
    if (subtaskRef.value.length > 0) {
        subtaskPlus.classList.add('d_none');
        subtaskIcons.classList.remove('d_none');
    } else {
        subtaskPlus.classList.remove('d_none');
        subtaskIcons.classList.add('d_none');
    };
};

/**
 * This function checks the input fields from the add task board and enables the
 * add task button
 */
function checkButtonDisabillity() {
    const submitButton = document.getElementById("creatTask");
    const title = document.getElementById("title");
    const dueDate = document.getElementById("dueDate");
    const category = document.getElementById("category");
    checkInputs(title, dueDate, category, submitButton);
};

/**
 * This function collects the input values and creates a new task
 */
async function addNewToDO() {
    title = document.getElementById("title").value;
    description = document.getElementById("description").value;
    dueDate = document.getElementById("dueDate").value;
    category = document.getElementById("category").value;
    await pushTaskBoard(title, description, dueDate, category, priority);
    cancelTask();
    renderTasksOnly();
    closeAddTaskBoard();
};

/**
 * This function collects the input from the add task board and creates/fetches a new task
 * 
 * @param {string} title - collects the title from the input field as a string
 * @param {string} description - collects the description from the input field as a string 
 * @param {string} dueDate - collects the dueDate from the input field as a string 
 * @param {string} category - collects the category from the input field as a string 
 * @param {string} priority - collects the priority from the input field as a string 
 */
async function pushTaskBoard(title, description, dueDate, category, priority) {
    let newTask = ({
        assigned_to: assignedMembers,
        category: category,
        date: dueDate,
        description: description,
        name: title,
        priority: priority,
        status: "toDo",
        subtasks: subtasksArray
    });
    await postData(newTask);
};

/**
 * This function forwards the user to "./board.html"
 */
function fowarding() {
    window.location.href = "./board.html";
};

/**
 * This function toggles the button for the add task button under a window.innerWidth of
 * 850px and redirects the user to "./add_task.html"
 */
function toggleAddTaskLink() {
    const taskBtnBoardRef = document.getElementById('addTaskButtonBoard')
    if (window.innerWidth <= 850) {
        taskBtnBoardRef.href = "./add_task.html";
        if (isAddTaskOverlayOpen) {
            window.location.href = "./add_task.html";
        }
    } else {
        taskBtnBoardRef.href = "#";
    }
};

/**
 * This function toggles the scroll behavior of the task overlay if the window.innerWidth
 * gets higher or lower than 550px
 */
function toggleOverlayTask() {
    if (window.innerWidth <= 550 && isTaskOverlayOpen) {
        document.documentElement.classList.add('stopScrolling')
    } else {
        document.documentElement.classList.remove('stopScrolling')
    }
};