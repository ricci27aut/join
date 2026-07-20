let subtasksArray = [];

/**
 * Add new subtask to the subtask list.
 * 
 * adds the input value to an subtask array if its not empty
 * clears the input field
 * calls {@link renderSubtasks} to update the HTML
 * calls {@link checkSubtask} to validate the current subtask list.
 */
function addSubtask() {
    subtask = document.getElementById("subtask");
        subtask.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("subtask-add-btn").click();}});
    if (subtask.value.trim()) {
        subtasksArray.push({
            done: false,
            title: subtask.value});
        renderSubtasksEdit();
        subtask.value = "";}
    checkSubtask();
};

/**
 * Loop trough the subtask array and appends the HTML for each subtask
 */
function renderSubtasksEdit() {
    subtaskList.innerHTML = "";
    for (let index = 0; index < subtasksArray.length; index++) {
        subtaskList.innerHTML += subtaskEditTemplate(index, subtasksArray);
    };
};

/**
 * Removes the input value of the subtask field
 * 
 */
function deleteSubtaskInput() {
    let subtaskRef = document.getElementById('subtask');
    subtaskRef.value = "";
    checkSubtask();
};

/**
 * Opens the subtask edit input for the specified subtask by index.
 * 
 * @param {number} index - The index of the subtask to edit in the subtask array.
 */
function openSubtaskEdit(index) {
    let subtaskEdit = document.getElementById(subtasksArray[index].title + "-" + index);
    subtaskEdit.classList.remove('d_none');
};

/**
 * Closes the subtask edit input for the specified subtask by index.
 * 
 * @param {number} index - The index of the subtask to edit in the subtask array.
 */
function closeSubtaskEdit(index) {
    let subtaskEdit = document.getElementById(subtasksArray[index].title + "-" + index);
    subtaskEdit.classList.add('d_none');
};

/**
 * Removes the subtask edit input for the specified subtask by index.
 * And renders the subtask's via {@link renderSubtasks}.
 * @param {number} index - The index of the subtask to edit in the subtask array.
 */
function removeSubtask(index) {
    subtasksArray.splice(index, 1);
    renderSubtasksEdit();
};

/**
 * Replaces a subtask's list item with an editable input template.
 * 
 * This function clears the current content of the subtask element and replaces it
 * with an input field to allow editing.
 * 
 * @param {number} index - The index of the subtask to edit in the subtask array.
 */
function editSubtask(index) {
    let currentListItem = document.getElementById("subtask-" + index);
    currentListItem.innerHTML = "";
    currentListItem.innerHTML = editSubtaskOverlayTemplate(index);
};

/**
 * Add the edit subtask value to the subtask array
 * And renders the subtask's via {@link renderSubtasks}.
 * @param {number} index - The index of the subtask to edit in the subtask array.
 */
function addEditSubtask(index) {
    let editInput = document.getElementById('edit-input');
    subtasksArray[index].title = editInput.value;
    renderSubtasksEdit();
};

/**
 * Loads the subtasks of a specific task into the global `subtasksArray` and triggers rendering.
 * 
 * Retrieves the `subtasks` object from the task at `taskIndex`, converts it into an array,
 * and stores it in `subtasksArray`. Then calls `renderSubtasksEdit` to display them.
 * 
 * @param {number} taskIndex - The index of the task in the `tasks` array.
 * @returns {void}
 */
function getSubtasksEdit(taskIndex) {
    subtasksArray = [];
    const task = tasks[taskIndex];
    const subtasksObj = task.subtasks;
    if (!subtasksObj || typeof subtasksObj !== "object") {
        return;
    };
    subtasksArray = Object.values(subtasksObj);
    renderSubtasksEdit();
};

/**
 * Edits an existing task with updated input values and refreshes the task board.
 * 
 * Retrieves updated task details from the input fields, then calls `pushTask` 
 * to update the task at the given `taskIndex`. Afterwards, it closes the overlay 
 * and reinitializes the task board.
 * 
 * @param {number} taskIndex - The index of the task to be edited.
 * @returns {Promise<void>} - Resolves when the task is updated and the board is refreshed.
 */
async function editToDo(taskIndex) {
    title = document.getElementById("titleEdit").value;
    description = document.getElementById("description").value;
    dueDate = document.getElementById("dueDateEdit").value;
    category = document.getElementById("categoryEdit").value;
    await pushTask(title, description, dueDate, category, priority, taskIndex);
    closeOverlay();
    await initboard();
};

/**
 * Creates a new task object and sends it to the backend.
 * 
 * @param {string} title - task title
 * @param {string} description - task description
 * @param {string} dueDate - due date 
 * @param {string} category - the selected task category
 * @param {string} priority - the selected priority
 */
async function pushTask(title, description, dueDate, category, priority, taskIndex) {
    let editTask = ({
        assigned_to: assignedMembers,
        category: category,
        date: dueDate,
        description: description,
        name: title,
        priority: priority,
        status: tasks[taskIndex].status,
        subtasks: subtasksArray
    });
    currentTaskPath = BASE_URL + "tasks/" + Object.keys(taskResponse)[taskIndex];
    await putData(currentTaskPath, editTask)
};

/**
 * Enables or disables the submit button based on input field values.
 * 
 * Checks whether the `title`, `dueDate`, and `category` fields are non-empty.
 * If any of the fields are empty , disables the `submitButton`.
 * Otherwise, enables the button.
 * 
 * @param {HTMLInputElement} title - Input field for the task title.
 * @param {HTMLInputElement} dueDate - Input field for the due date.
 * @param {HTMLInputElement} category - Input field for the category.
 * @param {HTMLButtonElement} submitButton - The button to enable/disable.
 */
function checkInputs(title, dueDate, category, submitButton) {
    if (title.value.trim() === "" || dueDate.value.trim() === "" || category.value.trim() === "") {
        submitButton.disabled = true;
    } else { submitButton.disabled = false; }
}

/**
 * Initializes the search input for filtering contacts.
 */
function searchContact() {
    const searchInput = document.getElementById('assignee-input');
    searchInput.addEventListener('input', filterAssigned);
};

/**
 * Filters the list of assigned contacts based on user input.
 * 
 * @param {Event} event - The input event triggered by typing in the search field. 
 */
function filterAssigned(event) {
    const searchTerm = event.target.value.toLowerCase();
    const assigned = document.querySelectorAll('.selectable-assigned-contact');
    assigned.forEach(contact => {
        const content = contact.innerText.toLowerCase();
        contact.style.display = content.includes(searchTerm) ? 'flex' : 'none';
    });
};