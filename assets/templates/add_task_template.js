function assigneeDropdownTemplate(shortName, index) {
    return `<div id="container-${index}" onclick="addMember('${index}', '${shortName}', '${contacts[index].name}')" class="selectable-assigned-contact"><div class="initials-name"><div class="initials" id="${index}">${shortName}</div>${contacts[index].name}</div><img id="img-${index}" class="checkbox" src="../assets/icons/checkbox.png" alt=""></div>`;
};

function disabledSelect() {
    return `<option value="" disabled selected hidden>Select contacts to assign</option>`;
};

function meberTemplate(initialsMembers, index) {
    return `<div class="initials" id="picked-${index}">${initialsMembers[index]}</div>`
};

function subtaskTemplate(index) {
    return `<div id="subtask-${index}">
                <div ondblclick="editSubtask(${index})" onmouseover="openSubtaskEdit(${index})" onmouseout="closeSubtaskEdit(${index})"  class="subtask-list-container">
                    <li>${subtaskArr[index]}</li>
                    <div id="${subtaskArr[index]}-${index}" class="d_none subtasks-icon-container">
                        <img onclick="removeSubtask(${index})" class="delte-icon" src="../assets/icons/delete.png"alt="X">
                        <img src="../assets/icons/vector.png" alt="">
                        <img onclick="editSubtask(${index})" class="check-icon" src="../assets/icons/edit-v2.png" alt="Add">
                    </div>
                </div>
            </div>`
};

function editSubtaskTemplate(index) {
    return `<div class="subtask-edit-container">
                <input onfocusout="addEditSubtask(${index})" id="edit-input" type="text" value="${subtaskArr[index]}">
                <div class="subtasks-icon-container">
                    <img onclick="removeSubtask(${index})" class="delte-icon" src="../assets/icons/delete.png" alt="X">
                    <img src="../assets/icons/vector.png" alt="">
                    <img onclick="addEditSubtask(${index})" class="check-icon" src="../assets/icons/check-black.png" alt="Add">
                </div>
            </div>`
};

function moreMemberTemplate() {
    return `<div class="moreMembers">+${assignedMembers.length - 5}</div>`
}