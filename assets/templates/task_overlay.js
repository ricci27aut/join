function renderTaskOverlay(taskIndex) {
    return `
        <div id="cardOverlay" class="cardOverlay">
            <div id="cardOverlay" class="cardOverlayInner">
                <div class="taskCategoryDiv"><div id="taskCategory${"#" + taskIndex}" class="taskOverlayCategory">${tasks[taskIndex].category}</div><div class="closeImg" onclick="closeOverlay()"></div></div>
                <div id="taskName" class="taskOverlayName">${tasks[taskIndex].name}</div>
                <div id="taskDescription" class="taskOverlayDescription">${tasks[taskIndex].description}</div>
                <div class="dueDateOverlay">   
                    <p class="fontSize20">Due date:</p>
                    <div class="dueDateOverlayDiv">${tasks[taskIndex].date.slice(0, 10).split('-').reverse().join('/')}</div>
                </div>
                <div class="priorityOverlay">
                    <p class="fontSize20">Priority:</p>
                    <div id="priority${"#" + taskIndex}" class="priorityOverlayDiv"></div>
                </div>
                <div id="taskAssignment" class="taskOverlayAssignment">
                    <p class="fontSize20">Assigned To:</p>
                    <div id="assignedTo${"#" + taskIndex}" class="assignedToOverlay"></div>
                </div>
                <div>
                    <p id="subTaskHeadTitle" class="subTaskHeadTitle">Subtasks</p>
                    <div id="subtasks${"#" + taskIndex}" class="overlaySubtasks">
                    </div>
                </div>
                
                <div class="editDeleteDiv">
                    <div class="deleteSectionDiv" onclick="getTaskKey('${tasks[taskIndex].name}')">
                        <img class="editDeleteImg" src="../assets/icons/delete.png" alt="delete">
                        <div>Delete</div>
                    </div>    
                    <img class="editDeleteVector" src="../assets/icons/vector.png" alt="vector">
                    <div class="editSectionDiv" onclick="editTaskOverlay(${taskIndex})">
                        <img class="editDeleteImg" src="../assets/icons/edit-v2.png" alt="edit">
                        <div>Edit</div>
                    </div>    
                </div>
            </div>
        </div>
    `;
}

function renderOverlaySubtasks(taskIndex, subtaskKey, subtaskCounter) {
    const subtask = tasks[taskIndex].subtasks[subtaskKey];
    const checkedAttr = subtask.done ? "checked" : "";

    return `
        <div class="overlaySubtaskDiv">
            <label class="overlaySubtaskCheckbox">
                <input 
                    type="checkbox" 
                    id="overlaySubtask#${taskIndex}#${subtaskCounter}" 
                    class="overlaySubtaskInput"
                    onchange="updateSubtaskStatus(${taskIndex}, '${subtaskKey}', this.checked)"
                    ${checkedAttr}
                >
                <span class="overlaySubtaskCheckmark"></span>
            </label>
            <div>${subtask.title}</div>
        </div>
    `;
}

function renderAssignedToName(assignedToNamesIndex, assignedToName) {
    const temp = document.createElement("div");
    temp.innerHTML = `
        <div class="assignedToName" id="assignedToName${"#" + assignedToNamesIndex}">${assignedToName}</div>
    `;
    return temp.firstElementChild;
}

function editTaskOverlayTemplate(currentTask) {
    return `<div id="cardOverlay" class="cardOverlayInner cardOverlayInnerEdit">
                <div class="closeOverlayContainer"><div class="closeImg" onclick="closeOverlay()"></div></div>
                <form class="flex-center-task">
                    <div class="first-container flex-gap flex-column">
                            <p>Title</p>
                            <input class="input-text" type="text" id="titleEdit"value="${tasks[currentTask].name}" required>
                            <p>Description</p>
                            <textarea class="input-text" id="description" rows="6" cols="50">${tasks[currentTask].description}</textarea>
                            <p>Due date</p>
                            <input value="${tasks[currentTask].date}" type="date" required class="input-text date-input" id="dueDateEdit">
                            <p>Priority</p>
                            <div class="flex-center flex-gap">
                                <div class="selectable" id="urgent" onclick="addCss('urgent')">
                                    Urgent
                                    <img src="../assets/icons/urgent.png" alt="">
                                </div>
                                <div class="selectable" id="medium" onclick="addCss('medium')">
                                    Medium
                                    <img src="../assets/icons/medium.png" alt="">
                                </div>
                                <div class="selectable" id="low" onclick="addCss('low')">
                                    Low
                                    <img src="../assets/icons/low.png" alt="">
                                </div>
                            </div>
                        <div class="assign-dropdown-container">
                            <p>Assigned to</p>
                            <div class="dropdown" id="assignee-dropdown">
                                <div onclick="toggleSelectable(), event.stopPropagation()" id="assignee-container"
                                    class="subtask-container">
                                    <input onkeyup="searchContact()" class="input-subtask" type="text" id="assignee-input"
                                        placeholder="Select contacts to assign" autocomplete="off">
                                    <div class="dropdown-img-container">
                                        <img id="dropwdown-icon" src="../assets/icons/dropdown-closed.png" alt="">
                                    </div>
                                </div>
                                <div class="selectable-assigned dnone" id="assigned"></div>
                                <div class="memberForTask" id="memberForTask"></div>
                            </div>
                        </div>
                        <article class="flex-column">
                            <label for="categoryEdit">Category</label>
                            <select disabled onfocusout="checkEditInput()" id="categoryEdit" name="selection-category" class="input-text"required>
                                <option value="${tasks[currentTask].category}" disabled selected hidden>${tasks[currentTask].category}</option>
                                <option value="Technical Task">Technical Task</option>
                                <option value="User Story">User Story</option>
                            </select>
                        </article>
                            <p>Subtasks</p>
                            <div class="subtask-container">
                                <input onclick="addSubtask()" onkeyup="checkSubtask()" id="subtask" type="text" placeholder="Add new Subtask"
                                    maxlength="20" name="subtaskTitle" class="input-subtask">
                                <div id="subtask-icon-container" class="hidden subtasks-icon-container">
                                    <img onclick="deleteSubtaskInput()" class="delte-icon" src="../assets/icons/delete.png"
                                        alt="X">
                                    <img src="../assets/icons/vector.png" alt="">
                                    <img id="subtask-add-btn" onclick="addSubtask()" class="check-icon" src="../assets/icons/check-black.png"
                                        alt="Add">
                                </div>
                                <img id="subtask-plus" src="../assets/icons/+.png" alt="+" class="plus-symbol">
                            </div>
                            <div class="subtaskList subtaskListEdit" id="subtaskList"></div>
                    </div>
                </form>
                <div class= "addTaskButtonOverlayContainer">
                    <button disabled=false onclick="editToDo(${currentTask})" id="creatTaskEdit" class="addTaskButtonOverlay btn_edit_confirm">Ok
                        <img class="addPlus" src="../assets/icons/check-btn.png" alt="add task">
                    </button>
                </div>
            </div>`
};

function subtaskEditTemplate(index,arr) {
    return `<div id="subtask-${index}">
                <div ondblclick="editSubtask(${index})" onmouseover="openSubtaskEdit(${index})" onmouseout="closeSubtaskEdit(${index})"  class="subtask-list-container">
                    <li>${arr[index].title}</li>
                    <div id="${arr[index].title}-${index}" class="d_none subtasks-icon-container">
                        <img onclick="removeSubtask(${index})" class="delte-icon" src="../assets/icons/delete.png"alt="X">
                        <img src="../assets/icons/vector.png" alt="">
                        <img onclick="editSubtask(${index})" class="check-icon" src="../assets/icons/edit-v2.png" alt="Add">
                    </div>
                </div>
            </div>`
};

function editSubtaskOverlayTemplate(index) {
    return `<div class="subtask-edit-container">
                <input onfocusout="addEditSubtask(${index})" id="edit-input" type="text" value="${subtasksArray[index].title}">
                <div class="subtasks-icon-container">
                    <img onclick="removeSubtask(${index})" class="delte-icon" src="../assets/icons/delete.png" alt="X">
                    <img src="../assets/icons/vector.png" alt="">
                    <img onclick="addEditSubtask(${index})" class="check-icon" src="../assets/icons/check-black.png" alt="Add">
                </div>
            </div>`
};

function addTaskBoardTemplate() {
    return ` <div class="add-task-style-board">
            <div class="add-task-board-header">
                <h1 class="h1-add-task">Add Task</h1>
                <div onclick="closeAddTaskBoard()" class="closeImg" onclick="closeOverlay()"></div>
            </div>
            <form class="flex-center-task form formBoard">
                <div class="first-container flex-gap flex-column">
                    <article>
                        <p>Title<span>*</span></p>
                        <input onfocusout="checkTitle()" class="input-text" type="text" id="title"
                            placeholder="Task Title" required>
                        <div class="warning-container">
                            <span class="warning d_none" id="warning-title">This field is required</span>
                        </div>
                    </article>
                    <article>
                        <p>Description</p>
                        <textarea class="input-text" id="description" rows="6" cols="50"
                            placeholder="Enter a Description"></textarea>
                    </article>
                    <article>
                        <p>Due date<span>*</span></p>
                        <input onfocusout="checkDate()" type="date" required class="input-text date-input" id="dueDate">
                        <div class="warning-container">
                            <span class="warning d_none" id="warning-dueDate">This field is required</span>
                        </div>
                    </article>
                </div>
                <div id="Border" class="task-gray-border"></div>
                <div class="second-container flex-gap flex-column">
                    <div>
                        <p>Priority</p>
                        <div class="flex-center flex-gap">
                            <div class="selectable" id="urgent" onclick="addCss('urgent')">
                                Urgent
                                <img src="../assets/icons/urgent.png" alt="">
                            </div>
                            <div class="selectable" id="medium" onclick="addCss('medium')">
                                Medium
                                <img src="../assets/icons/medium.png" alt="">
                            </div>
                            <div class="selectable" id="low" onclick="addCss('low')">
                                Low
                                <img src="../assets/icons/low.png" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="assign-dropdown-container">
                        <p>Assigned to</p>
                        <div class="dropdown" id="assignee-dropdown">
                            <div onclick="toggleSelectable(), event.stopPropagation()" id="assignee-container"
                                class="subtask-container">
                                <input onkeyup="searchContact()" class="input-subtask" type="text" id="assignee-input"
                                    placeholder="Select contacts to assign" autocomplete="off">
                                <div class="dropdown-img-container">
                                    <img id="dropwdown-icon" src="../assets/icons/dropdown-closed.png" alt="">
                                </div>
                            </div>
                            <div class="selectable-assigned dnone" id="assigned"></div>
                            <div class="memberForTask" id="memberForTask"></div>
                        </div>
                    </div>
                    <article class="flex-column">
                        <label for="category">Category<span>*</span></label>
                        <select onfocusout="checkCategory()" id="category" name="selection-category" class="input-text"
                            required>
                            <option value="" disabled selected hidden>Select task category</option>
                            <option value="Technical Task">Technical Task</option>
                            <option value="User Story">User Story</option>
                        </select>
                        <div class="warning-container">
                            <span class="warning d_none" id="warning-category">This field is required</span>
                        </div>
                    </article>
                    <article>
                        <p>Subtasks</p>
                        <div class="subtask-container">
                            <input onclick="addSubtask()" onkeyup="checkSubtask()" id="subtask" type="text" placeholder="Add new Subtask"
                                maxlength="20" name="subtaskTitle" class="input-subtask">
                            <div id="subtask-icon-container" class="hidden subtasks-icon-container">
                                <img onclick="deleteSubtaskInput()" class="delte-icon" src="../assets/icons/delete.png"
                                    alt="X">
                                <img src="../assets/icons/vector.png" alt="">
                                <img id="subtask-add-btn" onclick="addSubtask()" class="check-icon" src="../assets/icons/check-black.png"
                                    alt="Add">
                            </div>
                            <img id="subtask-plus" src="../assets/icons/+.png" alt="+" class="plus-symbol">
                        </div>
                        <div class="subtaskList subtaskListBoard" id="subtaskList"></div>
                    </article>
                </div>
            </form>
            <div class="flex-center flex-space-between margin-top-50px button-area">
                <p class="mobile-dnone"><span>*</span>This field is required</p>
                <div class="btn-container">
                    <button class="clear-btn" onclick="cancelTask()">Clear <img src="../assets/icons/x.png"
                            alt=""></button>
                    <button disabled id="creatTask" onclick="addNewToDO()" class="add-task-btn margin-left-10px">Create
                        Task<img src="../assets/icons/check-btn.png" alt=""></button>
                </div>
            </div>
        </div>`
}

function moreMemberTemplate() {
    return `<div class="moreMembers">+${assignedMembers.length - 5}</div>`
}

function moreMemberCardTemplate() {
    return `<div class="moreCardMembers">+${assignedTo.length - 5}</div>`
}