/**
 * This functin is used to move the element on touch
 * 
 * @param {object} ev - This is the touch event object 
 * @param {object} context - This is a container for the touch values
 * @returns the return value is true or false depending on touch state. if the drag event started
 *          previously, the return value is dragStarted
 */
function onTouchMove(ev, context) {
    const { dragStarted, canDrag, touch, cardElement, rect, taskIndex, offsetX, offsetY, dragTimer } = context;
    if (tryStartDrag(ev, { dragStarted, canDrag, touch, cardElement, rect, taskIndex, offsetX, offsetY, dragTimer }))
        return true;
    if (dragStarted) moveCard(cardElement, ev, offsetX, offsetY);
    return dragStarted;
}

/**
 * This function is used to handle the touch end
 * 
 * @param {object} ev - This is the touch event object 
 * @param {object} context - This is a container for the touch values 
 */
function onTouchEnd(ev, context) {
    const { dragStarted, cardElement, onMove, onEnd, taskIndex, dragTimer } = context;
    clearTimeout(dragTimer);
    cleanupListeners(cardElement, onMove, onEnd);
    removeTouchedClass(cardElement);
    if (!dragStarted) openTaskOverlay(taskIndex, ev);
    else finishDrag(cardElement, taskIndex, ev);
}

/**
 * This function is used to start the timer für the touch/drag event
 * 
 * @param {function} callback - This parameter is used to set the timer
 * @param {number} delay - This parameter controlls the timer delay
 * @returns - This function returns the setTimeout function
 */
function startDragTimer(callback, delay) {
    return setTimeout(callback, delay);
}

/**
 * This function adds the class "touched to the card"
 * 
 * @param {element} card - This is the element which should be dragged 
 */
function addTouchedClass(card) {
    card.classList.add('touched');
}

/**
 * This function removes the class "touched to the card"
 * 
 * @param {*element} card - This is the element which should be dragged 
 */
function removeTouchedClass(card) {
    card.classList.remove('touched');
}

/**
 * This function removes the event listeners from the card
 * 
 * @param {element} card - This is the element which should be dragged 
 * @param {object} onMove - This is the touch event on touchmove
 * @param {object} onEnd - This is the touch event on touchend 
 */
function cleanupListeners(card, onMove, onEnd) {
    card.removeEventListener('touchmove', onMove);
    card.removeEventListener('touchend', onEnd);
}

/**
 * This function is used to start the dragging, otherwise it returns false
 * 
 * @param {object} ev - This is the touch event object
 * @param {object} state - This is the status of the dragging process
 * @returns - This function returns false or true, depending on the dragged state
 */
function tryStartDrag(ev, state) {
    const moveTouch = ev.touches[0];
    const movedX = Math.abs(moveTouch.clientX - state.touch.clientX);
    const movedY = Math.abs(moveTouch.clientY - state.touch.clientY);
    if (!state.dragStarted && state.canDrag && (movedX > 5 || movedY > 5)) {
        clearTimeout(state.dragTimer);
        startDrag(state.cardElement, state.rect, state.taskIndex);
        return true;
    }
    return false;
}

/**
 * This function is used to start the dragging by touch
 * 
 * @param {element} card - This is the element which should be dragged  
 * @param {DOMRect-Object} rect - This object specifies the position and the size of an object  
 * @param {number} taskIndex - This is the index number from the tasks array 
 */
function startDrag(card, rect, taskIndex) {
    card.style.position = 'absolute';
    card.style.zIndex = 1000;
    card.style.left = rect.left + window.pageXOffset + 'px';
    card.style.top = rect.top + window.pageYOffset + 'px';
    card.classList.add('dragging');
    document.body.appendChild(card);
    card.style.transformOrigin = 'bottom left';
    card.style.transform = 'rotate(3deg)';
    showVisibleFeedbackOnDrag(taskIndex);
    scrollDropzoneIntoView();
}

/**
 * This function is used to move the card on touch event
 * 
 * @param {element} card - This is the element which should be dragged
 * @param {object} ev - This is the touch event object 
 * @param {number} offsetX - This is the x-position of the touch event  
 * @param {number} offsetY - This is the y-position of the touch event  
 */
function moveCard(card, ev, offsetX, offsetY) {
    ev.preventDefault();
    const touch = ev.touches[0];
    const newLeft = touch.clientX + window.pageXOffset - offsetX;
    const newTop = touch.clientY + window.pageYOffset - offsetY;
    card.style.left = newLeft + 'px';
    card.style.top = newTop + 'px';
}

/**
 * This function is used to finish the dragging process on touch event
 * 
 * @param {element} card - This is the element which should be dragged 
 * @param {number} taskIndex - This is the index number from the tasks array 
 * @param {object} ev - This is the touch event object 
 */
function finishDrag(card, taskIndex, ev) {
    card.classList.remove('dragging');
    dragEnd(taskIndex);
    const touch = ev.changedTouches[0];
    card.style.pointerEvents = 'none';
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    card.style.pointerEvents = '';
    const status = extractStatusFromDropTarget(dropTarget);
    if (status) {
        currentId = taskIndex;
        moveTo(status);
    }
    if (card.parentElement === document.body) card.remove();
}

/**
 * This function searches for the new status which the dragged element should get 
 * 
 * @param {HTMLElement} dropTarget - This is the target element of the dropped card
 * @returns - This function returns the new status which the dragged element should get
 */
function extractStatusFromDropTarget(dropTarget) {
    if (!dropTarget) return null;
    const boardList = dropTarget.closest('.boardList');
    if (!boardList) return null;
    const ondropAttr = boardList.getAttribute('ondrop');
    if (ondropAttr) {
        const match = ondropAttr.match(/moveTo\('([^']+)'\)/);
        if (match) return match[1];
    }
    const headerText = boardList.querySelector('h3')?.innerText.trim();
    const map = getStatusMapping();
    return map[headerText] || null;
}

/**
 * This function is used to return the mapping status as an object
 * 
 * @returns - This function returs the mapping status as an object 
 */
function getStatusMapping() {
    return {
        "To do": "toDo",
        "In progress": "inProgress",
        "Await feedback": "await",
        "Done": "done"
    };
}