/**
 * Checks the input value of the title field.
 * 
 * If the title input is empty (length is 0), it shows a warning message
 * and applies a red border to the input element. Otherwise, it removes
 * the red border and hides the warning.
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
 * Checks the input value of the date field.
 * 
 * If the date input is empty, it shows a warning message
 * and applies a red border to the input element. Otherwise, it removes
 * the red border and hides the warning.
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
 * Function to get the red border to each input's
 * @param {HTMLInputElement} input - The input element to mark as invalid.
 */
function getRedBorder(input) {
    input.classList.add('red-border');
    let warningText = document.getElementById('warning-' + input.id);
    warningText.classList.remove('d_none');
};

/**
 * Checks the chosen category field.
 * 
 * If the category input is empty, it shows a warning message
 * and applies a red border to the input element. Otherwise, it removes
 * the red border and hides the warning.
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
 * Checks the input value of the subtask field.
 * 
 * If the subtask input is empty, it shows a plus icon
 * Otherwise, it shows a delete and add icon
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
    let subtaskEdit = document.getElementById(subtaskArr[index] + "-" + index);
    subtaskEdit.classList.remove('d_none');
};

/**
 * Closes the subtask edit input for the specified subtask by index.
 * 
 * @param {number} index - The index of the subtask to edit in the subtask array.
 */
function closeSubtaskEdit(index) {
    let subtaskEdit = document.getElementById(subtaskArr[index] + "-" + index);
    subtaskEdit.classList.add('d_none');
};

/**
 * Removes the subtask edit input for the specified subtask by index.
 * And renders the subtask's via {@link renderSubtasks}.
 * @param {number} index - The index of the subtask to edit in the subtask array.
 */
function removeSubtask(index) {
    subtaskArr.splice(index, 1);
    renderSubtasks();
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
    let currentListItem = document.getElementById("subtask-"+index);
    currentListItem.innerHTML = "";
    currentListItem.innerHTML = editSubtaskTemplate(index);
};

/**
 * Add the edit subtask value to the subtask array
 * And renders the subtask's via {@link renderSubtasks}.
 * @param {number} index - The index of the subtask to edit in the subtask array.
 */
function addEditSubtask(index) {
    let editInput = document.getElementById('edit-input');
    subtaskArr[index] = editInput.value;
    renderSubtasks();
};

/**
 * closes the dropdown list of assigned members
 * by clicking outside the list or at the close button
 */
document.addEventListener('click', e => {
    let assignInput = document.getElementById('assignee-container');
    let assignedRef = document.getElementById('assigned');
    if (!assignedRef.contains(e.target) && e.target !== assignInput) {
        assignedRef.classList.add('dnone');
    };
});

/**
 * Displays a succeed message when the task is added
 */
function succeedRegistration() {
    let succeed = document.getElementById('succedSignup');
    succeed.classList.remove('d_none');
    document.getElementById('body').style.overflow = "hidden";
};

/**
 * Moves the user forward to the board.
 */
function fowarding() {
    window.location.href = "./board.html";
};

/**
 * Filters the list of assignable contacts based on the search input.
 * 
 * Triggered by the input event on the assignee search field.
 * Compares the lowercase input value to the inner text of each contact element
 * and shows or hides the elements based on a match.
 * 
 * @param {Event} event - The input event from the search field.
 */
function filterAssigned(event) {
    const searchTerm = event.target.value.toLowerCase();
    const assigned = document.querySelectorAll('.selectable-assigned-contact');
    assigned.forEach(contact => {
        const content = contact.innerText.toLowerCase();
        contact.style.display = content.includes(searchTerm) ? 'flex' : 'none';
    });
};