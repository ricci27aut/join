let currentId;

/**
 * This function start the card dragging and rotates the card. It shows a visible dropzone
 * for the dragged card and scrolls to the end of the tasklist.
 * 
 * @param {number} id - This is the id from the dragged task from the tasks array
 * @returns - If there is no card, the function stops with return
 */
function startDragging(id) {
    currentId = id;
    const card = document.getElementById(`card${currentId}`);
    if (!card) return;
    if (!card.dataset.dragListenerAdded) {
        card.addEventListener('dragstart', function (e) {
            e.preventDefault();
        });
        card.dataset.dragListenerAdded = "true";}
    card.style.transformOrigin = 'bottom left';
    card.style.transform = 'rotate(3deg)';
    showVisibleFeedbackOnDrag(currentId);
    scrollDropzoneIntoView();
}

/**
 * This function ends the card dragging and rotates the card to its original value.
 * It hides the visible dropzone for the dragged card and the tasklist scrolls back.
 * 
 * @param {number} taskIndex - This is the index number from the tasks array
 */
function dragEnd(taskIndex) {
    const card = document.getElementById(`card${taskIndex}`);
    if (card) {
        card.style.transform = 'rotate(0deg)';
    }
    scrollElementsLeft();
    hideVisibleFeedbackOnDrag();
}

/**
 * This function saves the current task card status, fetches it and renders the changed tasks 
 * 
 * @param {string} status - This function needs the task from the task array
 */
async function moveTo(status) {
    tasks[currentId].status = status;
    currentTaskPath = BASE_URL + "tasks/" + Object.keys(taskResponse)[currentId] + "/status";
    await putData(currentTaskPath, status);
    await fetchContacts();
    clearBoardTable();
    renderTasks(contacts);
}

/**
 * This function allows a drop-event in the current browser
 * 
 * @param {object} ev - This parameter is the drag event
 */
function dragoverHandler(ev) {
    ev.preventDefault();
}

/**
 * This function shows visible feedback at the end of a tasklist while dragging
 * 
 * @param {number} currentId - This is the id from the dragged task from the tasks array
 */
function showVisibleFeedbackOnDrag(currentId) {
    if (tasks[currentId].status == "toDo") {
        toggleVisibleFeedbackToDo();
    }
    if (tasks[currentId].status == "inProgress") {
        toggleVisibleFeedbackInProgress();
    }
    if (tasks[currentId].status == "await") {
        toggleVisibleFeedbackAwait();
    }
    if (tasks[currentId].status == "done") {
        toggleVisibleFeedbackDone();
    }
}

/**
 * This function scrolls the tasklist back to the first task
 */
function scrollElementsLeft() {
    const containers = document.getElementsByClassName("taskList");
    for (const container of containers) {
        container.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
}

/**
 * This function scrolls the visible feedback element called dropzone into view
 */
function scrollDropzoneIntoView() {
    const containers = document.getElementsByClassName("taskList");
    for (const container of containers) {
        const dropzone = container.querySelector(".dropzoneCard");
        if (dropzone) {
            const containerRect = container.getBoundingClientRect();
            const dropzoneRect = dropzone.getBoundingClientRect();
            const offsetRight = dropzoneRect.right - containerRect.right;
            if (offsetRight > 0) {
                container.scrollBy({ left: offsetRight, top: 0, behavior: 'smooth' });
            }
        }
    }
}

/**
 * This function toggles the classes of the visible feedback of the To do tasklist
 * to see the feedback while dragging
 */
function toggleVisibleFeedbackToDo() {
    document.getElementById("dropzone#TaskInProgress").classList.remove("d_none");
    document.getElementById("dropzone#TaskAwaitFeedback").classList.remove("d_none");
    document.getElementById("dropzone#TaskDone").classList.remove("d_none");
}

/**
 * This function toggles the classes of the visible feedback of the In progress tasklist
 * to see the feedback while dragging
 */
function toggleVisibleFeedbackInProgress() {
    document.getElementById("dropzone#TaskToDo").classList.remove("d_none");
    document.getElementById("dropzone#TaskAwaitFeedback").classList.remove("d_none");
    document.getElementById("dropzone#TaskDone").classList.remove("d_none");
}

/**
 * This function toggles the classes of the visible feedback of the Await feedback tasklist
 * to see the feedback while dragging
 */
function toggleVisibleFeedbackAwait() {
    document.getElementById("dropzone#TaskToDo").classList.remove("d_none");
    document.getElementById("dropzone#TaskDone").classList.remove("d_none");
    document.getElementById("dropzone#TaskInProgress").classList.remove("d_none")
}

/**
 * This function toggles the classes of the visible feedback of the Done tasklist
 * to see the feedback while dragging
 */
function toggleVisibleFeedbackDone() {
    document.getElementById("dropzone#TaskToDo").classList.remove("d_none");
    document.getElementById("dropzone#TaskInProgress").classList.remove("d_none");
    document.getElementById("dropzone#TaskAwaitFeedback").classList.remove("d_none");
}

/**
 * This function is hiding the visible feedback on dragEnd
 */
function hideVisibleFeedbackOnDrag() {
    document.getElementById("dropzone#TaskToDo").classList.add("d_none");
    document.getElementById("dropzone#TaskInProgress").classList.add("d_none");
    document.getElementById("dropzone#TaskAwaitFeedback").classList.add("d_none");
    document.getElementById("dropzone#TaskDone").classList.add("d_none");
}

/**
 * This function enables the touch function for dragging on mobile devices with touch screen
 * 
 * @param {element} cardElement - This is the element which should be dragged
 * @param {number} taskIndex - This is the index number from the tasks array
 */
function enableTouchDrag(cardElement, taskIndex) {
    let offsetX = 0, offsetY = 0;
    cardElement.addEventListener('touchstart', (e) => {
        ({ offsetX, offsetY } = handleTouchStart(cardElement, e));
    });
    cardElement.addEventListener('touchmove', (e) => {
        handleTouchMove(cardElement, e, offsetX, offsetY);
    });
    cardElement.addEventListener('touchend', (e) => {
        handleTouchEnd(cardElement, taskIndex, e);
    });
}

/**
 * This function adds the class "touched" to the card element
 * 
 * @param {element} cardElement - This is the element which should be dragged
 */
function addTouchedClass(cardElement) {
    cardElement.classList.add('touched');
}

/**
 * This function removes the class "touched" to the card element
 * 
 * @param {element} cardElement - This is the element which should be dragged 
 */
function removeTouchedClass(cardElement) {
    cardElement.classList.remove('touched');
}

/**
 * This function starts the drag function on touch
 * 
 * @param {element} cardElement - This is the element which should be dragged 
 * @param {DOMRect-Object} rect - This object specifies the position and the size of an object 
 * @param {number} taskIndex - This is the index number from the tasks array 
 * @param {number} offsetX - This is the x-position of the touch event 
 * @param {number} offsetY - This is the y-position of the touch event  
 */
function startDrag(cardElement, rect, taskIndex, offsetX, offsetY) {
    cardElement.style.position = 'absolute';
    cardElement.style.zIndex = 1000;
    cardElement.style.left = rect.left + window.pageXOffset + 'px';
    cardElement.style.top = rect.top + window.pageYOffset + 'px';
    cardElement.classList.add('dragging');
    document.body.appendChild(cardElement);
    cardElement.style.transformOrigin = 'bottom left';
    cardElement.style.transform = 'rotate(3deg)';
    showVisibleFeedbackOnDrag(taskIndex);
    scrollDropzoneIntoView();
}

/**
 * This function is used to move the card by touch hold
 * 
 * @param {element} cardElement - This is the element which should be dragged  
 * @param {object} ev - This is the touch event object
 * @param {number} offsetX - This is the x-position of the touch event 
 * @param {number} offsetY - This is the y-position of the touch event 
 */
function moveCard(cardElement, ev, offsetX, offsetY) {
    ev.preventDefault();
    const touch = ev.touches[0];
    const newLeft = touch.clientX + window.pageXOffset - offsetX;
    const newTop = touch.clientY + window.pageYOffset - offsetY;
    cardElement.style.left = newLeft + 'px';
    cardElement.style.top = newTop + 'px';
}

/**
 * This function is used to finish the drag on release of touch
 * 
 * @param {element} cardElement - This is the element which should be dragged  
 * @param {number} taskIndex - This is the index number from the tasks array 
 * @param {object} ev - This is the touch event object 
 */
function finishDrag(cardElement, taskIndex, ev) {
    removeTouchedClass(cardElement);
    cardElement.classList.remove('dragging');
    dragEnd(taskIndex);
    const touch = ev.changedTouches[0];
    cardElement.style.pointerEvents = 'none';
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    cardElement.style.pointerEvents = '';
    const status = extractStatusFromDropTarget(dropTarget);
    if (status) {
        currentId = taskIndex;
        moveTo(status);
    } if (cardElement.parentElement === document.body) {cardElement.remove();}
}

/**
* This function handles the dragging process of the dragged card element
* 
* @param {element} cardElement - This is the element which should be dragged  
* @param {object} e - This is the touch event object  
* @param {number} taskIndex - This is the index number from the tasks array 
*/
function handleTouchStart(cardElement, e, taskIndex) {
    e.preventDefault();
    addTouchedClass(cardElement);
    const touch = e.touches[0];
    const rect = cardElement.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    setupDragHandlers(cardElement, touch, rect, offsetX, offsetY, taskIndex);
}

/**
 * This function is used to get the setup for the dragging process
 * 
 * @param {element} cardElement - This is the element which should be dragged 
 * @param {object} touch - This is the touch event object 
 * @param {DOMRect-Object} rect - This object specifies the position and the size of an object 
 * @param {number} offsetX - This is the x-position of the touch event  
 * @param {number} offsetY - This is the y-position of the touch event  
 * @param {number} taskIndex - This is the index number from the tasks array 
 */
function setupDragHandlers(cardElement, touch, rect, offsetX, offsetY, taskIndex) {
    let dragStarted = false;
    let canDrag = false;
    const dragTimer = startDragTimer(() => canDrag = true, 300);
    const onMove = (ev) => {
        dragStarted = onTouchMove(ev, {
            dragStarted, canDrag, touch, cardElement, rect, taskIndex, offsetX, offsetY, dragTimer
        });};
    const onEnd = (ev) => {
        onTouchEnd(ev, {
            dragStarted, cardElement, onMove, onEnd, taskIndex, dragTimer});};
    cardElement.addEventListener('touchmove', onMove, { passive: false });
    cardElement.addEventListener('touchend', onEnd);
}