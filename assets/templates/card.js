function renderCard(taskIndex) {
    const task = tasks[taskIndex];
    return `
        <div draggable="true"
             ontouchstart="handleTouchStart(this, event,${taskIndex})"
             ondragstart="startDragging(${taskIndex})"
             ondragend="dragEnd(${taskIndex})"
             id="card${taskIndex}"
             class="card taskCard"
             onclick="openTaskOverlay(${taskIndex}, event)">
            
            <div id="taskCategory#${taskIndex}" class="taskCategory">${task.category}</div>
            <div class="taskName">${task.name}</div>
            <div class="taskDescription">${task.description}</div>
            
            <div id="subtasks#${taskIndex}" class="subtasks">
                <div id="outerScale#${taskIndex}" class="outerScale">
                    <div class="innerScale" id="innerScale#${taskIndex}"></div>
                </div>
                <p id="subtaskDone#${taskIndex}" class="subtaskDone"></p>
            </div>
            
            <div class="taskAssignment">
                <div id="assignedTo#${taskIndex}" class="assignedTo"></div>
                <div id="taskAssignment${taskIndex}" class="assignedTo"></div>
                <div id="priority#${taskIndex}" class="priority"></div>
            </div>
        </div>
    `;
}

function renderPriority(taskIndex, priority) {
     return `
     <img id="priorityImg${"#" + taskIndex}" class="priorityImg" src="../assets/icons/${priority}.png" alt="priority">
     `;
}

function renderInitials(taskIndex, initials, index) {
     return `
     <div class="assignedToInitialDiv">
        <div id="assignedToInitial${"#" + initials + "#" + index +  "#" + taskIndex}" class="assignedToInitial">${initials.toUpperCase()}</div>
     </div>
     `;
}

function renderDropZone(id) {
    return `
    <div id="${id}" class="dropzoneCard d_none"></div>
    `;
}
