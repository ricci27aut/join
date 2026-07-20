let priority = "medium"
let assignedMembers = [];

/**
 * Replaces the content of the selected subtask list item with an editable input.
 * 
 * This function targets a subtask element by its index, clears its content,
 * and inserts an input field using a predefined template to allow editing.
 * 
 * @param {number} index - The index of the subtask in the subtask array.
 */
function editTaskOverlay(currentTask) {
    let overlayRef = document.getElementById('cardOverlay');
    overlayRef.innerHTML = "";
    overlayRef.innerHTML = editTaskOverlayTemplate(currentTask);
    addCss(tasks[currentTask].priority);
    getAssignedMembers(currentTask);
    renderMembersForTask();
    getContacts();
    getSubtasksEdit(currentTask);
    dueDateEdit.min = new Date().toISOString().split("T")[0];
    initValidationEdit();
};

/**
 * Initializes form input validation for the "Create Task" button.
 * The button is enabled only if all required fields (title, due date, category) are filled.
 * Uses an interval to continuously check form input validity.
 */
function initValidationEdit() {
    const submitButton = document.getElementById("creatTaskEdit");
    const title = document.getElementById("titleEdit");
    const dueDate = document.getElementById("dueDateEdit");
    const category = document.getElementById("categoryEdit");
    if (!title || !dueDate || !category || !submitButton) {
        console.warn("No formula found."); return; }
     if (validationInterval !== null) return;
    validationInterval = setInterval(() => {
        const isValid =
            title.value.trim() !== "" &&
            dueDate.value.trim() !== "" &&
            category.value.trim() !== "";
        submitButton.disabled = !isValid; }, 200)
};

function establishVariablesForValidation() {
    submitButton = document.getElementById("creatTaskEdit");
    title = document.getElementById("titleEdit");
    dueDate = document.getElementById("dueDateEdit");
    category = document.getElementById("categoryEdit");
}

/**
 * Updates the CSS styling and sets the selected priority.
 * 
 * Adds the selected priority class
 * Updates the priority image via {@link addImage}.
 * Sets the global `priority` variable to the selected value.
 * 
 * @param {string} id - the selected priority "low", "urgent" or "medium"
 */
function addCss(id) {
    const elements = document.querySelectorAll('.selectable');
    elements.forEach(el => {
        el.classList.remove(el.id);
    });
    let clicked = document.getElementById(id);
    clicked.classList.add(id);
    addImage(id);
    priority = id;
};

/**
 * get the correct image depends on the chosen priority
 * 
 * @param {string} id - the selected priority "low", "urgent" or "medium"
 */
function addImage(id) {
    switch (id) {
        case 'urgent':
            addImageUrgent(id);
            break;
        case 'low':
            addImageLow(id);
            break;
        case 'medium':
            addImageMedium(id);
            break;
    };
};

/**
 * This function sets the correct image for the chosen priority
 * 
 * @param {string} id - the selected priority "urgent" 
 */
function addImageUrgent(id) {
    document.getElementById(id).innerHTML = `Urgent<img src="../assets/icons/urgent-white.png" alt="">`
    document.getElementById('low').innerHTML = `Low<img src="../assets/icons/low.png" alt="">`
    document.getElementById('medium').innerHTML = `Medium<img src="../assets/icons/medium.png" alt="">`
}

/**
 * This function sets the correct image for the chosen priority
 * 
 * @param {string} id - the selected priority "low"
 */
function addImageLow(id) {
    document.getElementById(id).innerHTML = `Low<img src="../assets/icons/low-white.png" alt="">`
    document.getElementById('medium').innerHTML = `Medium<img src="../assets/icons/medium.png" alt="">`
    document.getElementById('urgent').innerHTML = `Urgent<img src="../assets/icons/urgent.png" alt="">`
}

/**
 * This function sets the correct image for the chosen priority
 * 
 * @param {string} id - the selected priority "medium" 
 */
function addImageMedium(id) {
    document.getElementById(id).innerHTML = `Medium<img src="../assets/icons/medium-white.png" alt="">`
    document.getElementById('urgent').innerHTML = `Urgent<img src="../assets/icons/urgent.png" alt="">`
    document.getElementById('low').innerHTML = `Low<img src="../assets/icons/low.png" alt="">`
}

/**
 * Toggles the visibility of the contact assignment dropdown
 */
function toggleSelectable() {
    let dropdownIcon = document.getElementById('dropwdown-icon');
    let selectableRef = document.getElementById("assigned");
    if (selectableRef.classList.contains('dnone')) {
        dropdownIcon.src = `../assets/icons/dropdown-open.png`
    } else {
        dropdownIcon.src = `../assets/icons/dropdown-closed.png`
    }
    selectableRef.classList.toggle("dnone");
};

/**
 * Renders the list of contacts into the assignee dropdown
 * 
 * This function:
 * - Clears the current content of the assigned contact area.
 * - Extracts user names from the `contacts` array.
 * - Generates short name initials using {@link makeShortName}.
 * - For each contact, renders a dropdown entry using {@link assigneeDropdownTemplate}
 *   and sets its background color via {@link getBackgroundColor}.
 */
function getContacts() {
    const contentPlace = document.getElementById("assigned");
    contentPlace.innerHTML = "";
    contentPlace.innerHTML += disabledSelect();
    const userNames = contacts.map(u => u.name);
    const shortNames = makeShortName(userNames);
    for (let i = 0; i < contacts.length; i++) {
        contentPlace.innerHTML += assigneeDropdownTemplate(shortNames[i], i);
        getBackgroundColor(i);
        checkSelectable(i)
    };
};

/**
 * Checks if a contact is currently assigned
 * 
 * This function compares the contact name at the given index
 * to the list of already assigned members. If a match is found, it displays
 * the contact as selected by updating the background color and checkbox icon.
 * 
 * @param {number} index - The index of the contact in the contacts array.
 * @returns {void}
 */
function checkSelectable(index) {
    const currentMember = assignedMembers.find((member) => { return member == contacts[index].name });
    let bgcolor = document.getElementById("container-" + index);
    let checked = document.getElementById("img-" + index);
    if (currentMember) {
        bgcolor.classList.add('assigned-bgcolor');
        checked.src = `../assets/icons/checkbox-checked-white.png`
    } else {
        return
    };
};

/**
 * sets the background color of the contact element with the given index.
 * 
 * @param {number} index - The index of the contact in the global `contacts` array
 */
function getBackgroundColor(index) {
    document.getElementById(index).style.backgroundColor = contacts[index].color;
};

/**
 * creates initials from name array
 * 
 * loop trough userNames array and creates the initials from each name
 * 
 * @param {Array} userNames - array of contact names from the contacts array
 * @returns {string} - first letter from the name and first letter from the surname
 */
function makeShortName(userNames) {
    return userNames.map(name => {
        const parts = name.trim().split(" ");
        const first = parts[0]?.charAt(0).toUpperCase() || "";
        const last = parts[1]?.charAt(0).toUpperCase() || "";
        return first + last;
    });
};

/**
 * Renders the currently assigned members for a task.
 * 
 * Creates initials out of the assigned members.
 * Displays them and get them the same background color.
 */
function renderMembersForTask() {
    const contentPlace = document.getElementById("memberForTask");
    contentPlace.innerHTML = "";
    const initialsMembers = makeShortName(assignedMembers);
    for (let index = 0; index < assignedMembers.length; index++) {
        if (index == 5) {
            contentPlace.innerHTML += moreMemberTemplate()
            return
        }
        contentPlace.innerHTML += meberTemplate(initialsMembers, index);
        findSameBgColor(initialsMembers, assignedMembers, index);
    };
};

/**
 * Retrieves the assigned members of a specific task and stores them in the global `assignedMembers` array.
 * 
 * @param {number|string} currentTask - The key or index identifying the current task in the `tasks` array or object.
 * @returns {Array<string>} - An array containing the names of the assigned members.
 */
function getAssignedMembers(currentTask) {
    assignedMembers = [];
    if (tasks[currentTask].assigned_to) {
        for (const [key, value] of Object.entries(tasks[currentTask].assigned_to)) {
            let nameValue = value;
            assignedMembers.push(`${nameValue}`);
        };
        return assignedMembers;
    } else {
        return
    }
};

/**
 * Finds the contact by full name and sets their background color on the matching DOM element.
 * 
 * @param {string} fullname - current name
 * @param {number} index - Index of the contact to apply the color for.
 */
function findSameBgColor(initals, fullname, index) {
    const findSameInitials = contacts.find(({ name }) => { return name == fullname[index] });
    document.getElementById('picked-' + index).style.backgroundColor = findSameInitials.color;
};

/**
 * Toggles a user's assignment status for a task.
 * 
 * Adds or removes the given user from the `assignedMembers` array depending on their current state.
 * Updates the UI by changing the background color and checkbox icon accordingly
 * Finally, re-renders the member list for the task.
 * 
 * @param {number} index -The index of the member in the contact list
 * @param {string} userName - The name of the user to add or remove from the task.
 */
function addMember(index, shortName, userName) {
    const currentMember = assignedMembers.find((member) => { return member == userName });
    let bgcolor = document.getElementById("container-" + index);
    let checked = document.getElementById("img-" + index);
    if (currentMember) {
        const index = assignedMembers.indexOf(userName);
        removeMember(index, bgcolor, checked);
    } else {
        assignMember(bgcolor, checked, userName);
    };
};

/**
 * This function removes the given user from the `assignedMembers` array depending on their current state.
 * 
 * @param {number} index - the index of the userName in the array assignedMembers
 * @param {element} bgcolor - the element for which the background color is removed
 * @param {element} checked - the element for which the check-img is toggled
 */
function removeMember(index, bgcolor, checked) {
        assignedMembers.splice(index, 1);
        bgcolor.classList.remove('assigned-bgcolor');
        checked.src = `../assets/icons/checkbox.png`
        renderMembersForTask();
}

/**
 * This function adds the given user from the `assignedMembers` array depending on their current state.
 * 
 * @param {element} bgcolor - the element for which the background color is removed 
 * @param {element} checked - the element for which the check-img is toggled
 * @param {string} userName - The name of the user to add or remove from the task. 
 */
function assignMember(bgcolor, checked, userName) {
        assignedMembers.push(userName);
        bgcolor.classList.add('assigned-bgcolor');
        checked.src = `../assets/icons/checkbox-checked-white.png`
        renderMembersForTask();
}

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
        subtaskPlus.classList.add('hidden');
        subtaskIcons.classList.remove('hidden');
    } else {
        subtaskPlus.classList.remove('hidden');
        subtaskIcons.classList.add('hidden');
    };
};