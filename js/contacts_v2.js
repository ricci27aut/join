const contactsSlider = document.getElementById("contactsSlider");
const sliderTrigger = document.getElementById("sliderTrigger");

/**
 * Highlights the email input with a red border and displays a warning for invalid email.
 */
function alertValidMail() {
  document.getElementById("contactEmail").classList.add("red-border");
  document.getElementById("warningContainer").innerHTML = alertValidMailText();
}

/**
 * Highlights the phone input with a red border and displays a warning for invalid phone number.
 */
function alertValidNumber() {
  document.getElementById("contactPhone").classList.add("red-border");
  document.getElementById("warningContainer").innerHTML = alertValidNumberText();
}

/**
 * Highlights all required contact fields with a red border and shows a general warning message.
 */
function alert() {
  document.getElementById("contactName").classList.add("red-border");
  document.getElementById("contactEmail").classList.add("red-border");
  document.getElementById("contactPhone").classList.add("red-border");
  document.getElementById("warningContainer").innerHTML = warningText();
}

/**
 * Removes all red borders from contact input fields and clears the warning container.
 */
function alertremove() {
  document.getElementById("contactName").classList.remove("red-border");
  document.getElementById("contactEmail").classList.remove("red-border");
  document.getElementById("contactPhone").classList.remove("red-border");
  document.getElementById("warningContainer").innerHTML = "";
}

/**
 * Highlights all required edit contact fields with a red border and shows a general warning.
 */
function alertEdit() {
  document.getElementById("editName").classList.add("red-border");
  document.getElementById("editMail").classList.add("red-border");
  document.getElementById("editPhone").classList.add("red-border");
  document.getElementById("warningEditContainer").innerHTML = warningText();
}

/**
 * Highlights the email input in the edit form with a red border and shows a warning for invalid email.
 */
function alertValidMailEdit() {
  document.getElementById("editMail").classList.add("red-border");
  document.getElementById("warningEditContainer").innerHTML = alertValidMailText();
}

/**
 * Highlights the phone input in the edit form with a red border and shows a warning for invalid phone number.
 */
function alertValidNumberEdit() {
  document.getElementById("editPhone").classList.add("red-border");
  document.getElementById("warningEditContainer").innerHTML = alertValidNumberText();
}

/**
 * Removes all red borders from edit contact input fields and clears the warning container.
 */
function alertremoveEdit() {
  document.getElementById("editName").classList.remove("red-border");
  document.getElementById("editMail").classList.remove("red-border");
  document.getElementById("editPhone").classList.remove("red-border");
  document.getElementById("warningEditContainer").innerHTML = "";
}

/**
 * Clears all input fields in the add contact form and removes validation warnings.
 */
function clearAddContactFields() {
  document.getElementById("contactName").value = "";
  document.getElementById("contactEmail").value = "";
  document.getElementById("contactPhone").value = "";
  alertremove();
}

/**
 * Clears all input fields in the edit contact form and removes validation warnings.
 */
function clearEditContactFields() {
  document.getElementById("editName").value = "";
  document.getElementById("editMail").value = "";
  document.getElementById("editPhone").value = "";
  alertremoveEdit();
}

/**
 * Builds a contact object.
 * @param {string} name 
 * @param {string} mail 
 * @param {string} phone 
 * @returns {Object} - Contact object.
 */
function buildContactObject(name, mail, phone) {
  return {
    name: name,
    mail: mail,
    phone_number: phone,
    color: getRandomColor()
  };
}

/**
 * Saves a contact to the backend.
 * @param {string} key - Contact key.
 * @param {Object} contact - Contact object.
 */
async function saveContact(key, contact) {
  try {
    const response = await fetch(`${BASE_URL}contacts/${key}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact)
    });
    if (!response.ok) {
      return;}
    finishContactCreation();
  } catch (error) { }
}

/**
 * Finishes contact creation process and updates UI.
 */
function finishContactCreation() {
  closeAddContact();
  clearAddContactFields();
  contactAddedSuccessfully();
  fetchContacts();
}

/**
 * Closes a specified overlay by its ID.
 * @param {string} overlayId - The overlay element ID.
 */
function closeOverlayByElement(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (overlay) overlay.classList.add("hidden");
}

/**
 * This function closes open overlays via event listener
 */
document.addEventListener("click", function (event) {
  const openOverlays = document.querySelectorAll(".overlay:not(.hidden)");
  openOverlays.forEach(overlay => {
    if (event.target === overlay) {
      overlay.classList.add("hidden");
    }
  });
});

/**
 * This function displays and hides the contacts slider on click
 */
if (contactsSlider && sliderTrigger) {
  sliderTrigger.addEventListener("click", function (event) {
    event.stopPropagation();
    contactsSlider.classList.toggle("dnone");
  });
  document.addEventListener("click", function (event) {
    const isClickOutside =
      !contactsSlider.contains(event.target) &&
      !sliderTrigger.contains(event.target);
    if (isClickOutside && !contactsSlider.classList.contains("dnone")) {
      contactsSlider.classList.add("dnone");
    }});}

/**
 * Deletes the currently selected contact.
 */
function deleteCurrentContact() {
  if (currentEditKey) {
    deleteContact(currentEditKey);
    closeEditContact();
  }
}

/**
 * Shows feedback that contact was added successfully.
 */
function contactAddedSuccessfully() {
  const feedbackEl = document.getElementById("userFeedback");
  feedbackEl.classList.remove("hidden");
  setTimeout(() => {
    feedbackEl.classList.add("hidden");
  }, 4000);
}