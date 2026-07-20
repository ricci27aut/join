let taskContactIsIncluded = [];
let currentEditName = "";

/**
 * Regular expression to validate email addresses.
 * Matches a basic format like name@example.com.
 */
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Regular expression to validate phone numbers.
 * Allows optional '+' and various common separators.
 */
const digitPattern = /^\+?\d[\d\s\-()]{6,19}$/;

/** 
 * Currently selected contact key for editing.
 * @type {string|null} 
 */
let currentEditKey = null;

/**
 * Initializes the contacts module: fetches contacts and highlights the menu link.
 */
async function initContacts() {
  await fetchContacts();
  await fetchTasks();
  initTask();
  highlightLink();
}

/**
 * Fetches all contacts and renders them in the list.
 */
async function fetchContacts() {
  try {
    const data = await getAllUsers("contacts");
    if (!data) {
      document.getElementById("contactList").innerHTML = noKontaktTamplate();
      return;
    }
    renderContacts(data);
  } catch (error) { }
}

/**
 * Fetches all data from a specific path in the backend.
 * @param {string} path - The path to fetch data from.
 * @returns {Promise<Object>} - JSON data from the backend.
 */
async function getAllUsers(path) {
  const response = await fetch(BASE_URL + path + ".json");
  return await response.json();
}

/**
 * Highlights the 'contacts' navigation link.
 */
function highlightLink() {
  const currentLink = document.getElementById('contacts');
  currentLink.classList.add('activeLink');
}

/**
 * Renders the contact list grouped by first letter.
 * @param {Object} contactsData - The contacts data object.
 */
function renderContacts(contactsData) {
  const list = document.getElementById("contactList");
  list.innerHTML = "";
  const contacts = Object.entries(contactsData);
  contacts.sort((a, b) => a[1].name.localeCompare(b[1].name));
  let currentGroup = "";
  contacts.forEach(([key, contact]) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    if (firstLetter !== currentGroup) {
      currentGroup = firstLetter;
      appendGroupHeader(list, currentGroup);
    }
    appendContactElement(list, key, contact);
  });}

/**
 * Appends a contact element to the contact list.
 * @param {HTMLElement} list - The parent list element.
 * @param {string} key - The contact key.
 * @param {Object} contact - The contact object.
 */
function appendContactElement(list, key, contact) {
  const color = contact.color || getRandomColor();
  const div = document.createElement("div");
  div.classList.add("contact-div");
  div.id = key;
  div.setAttribute("onclick", `showCurrentContact('${key}')`);
  div.innerHTML = listTamplate(color, contact);
  div.addEventListener("click", () => showContact(contact, color, key));
  list.appendChild(div);
}

/**
 * Appends a header element for a new group of contacts.
 * @param {HTMLElement} list - The parent list element.
 * @param {string} groupLetter - The letter grouping the contacts.
 */
function appendGroupHeader(list, groupLetter) {
  const groupHeader = document.createElement("div");
  groupHeader.classList.add("contact-group-header");
  groupHeader.textContent = groupLetter;
  list.appendChild(groupHeader);
  const highlightDiv = document.createElement("div");
  highlightDiv.classList.add("contact-group-highlight");
  list.appendChild(highlightDiv);
}

/**
 * Highlights the currently selected contact.
 * @param {string} id - The ID of the selected contact.
 */
function showCurrentContact(id) {
  const prev = document.querySelector(".CurrentContact");
  if (prev) prev.classList.remove("CurrentContact");
  const current = document.getElementById(id);
  if (current) current.classList.add("CurrentContact");
}

/**
 * Returns the initials of a given name.
 * @param {string} name - The full name.
 * @returns {string} - Initials in uppercase.
 */
function getInitials(name) {
  return name.split(" ").map(n => n[0].toUpperCase()).join("");
}

/**
 * Returns a random color from the predefined list.
 * @returns {string} - A hex color string.
 */
function getRandomColor() {
  const colors = ["#6E52FF", "#FFA35E", "#FFE62B", "#00BEE8", "#FF5EB3", "#FFBB2B", "#FF745E", "#C3FF2B", "#FF7A00", "#1FD7C1", "#0038FF", "#FFC701", "#9327FF", "#FC71FF", "#FF4646"];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Navigates back to the contact list view.
 */
function backToList() {
  document.getElementById("contactDetails").classList.remove("show");
  document.querySelector(".contacts-list").classList.add("show");
}

/**
 * Opens the overlay for adding a new contact.
 */
function openAddContact() {
  document.getElementById("addContactOverlay").classList.remove("hidden");
}

/**
 * Closes the overlay for adding a contact and clears form fields.
 */
function closeAddContact() {
  document.getElementById("addContactOverlay").classList.add("hidden");
  clearAddContactFields();
}

/**
 * Opens the overlay for editing a contact.
 */
function openEditContact() {
  document.getElementById("editContactOverlay").classList.remove("hidden");
}

/**
 * Closes the overlay for editing a contact.
 */
function closeEditContact() {
  document.getElementById("editContactOverlay").classList.add("hidden");
  alertremoveEdit()
}

/**
 * Loads contact data into the edit form by key.
 * @param {string} key - The contact key.
 */
async function editContact(key, contactName) {
  try {
    findContactTasks(contactName)
    currentEditName = contactName;
    const contact = await fetchContactByKey(key);
    if (!contact) {
      closeEditContact(); return;}
    const { name, mail, phone_number: phone } = contact;
    const color = await ensureContactColor(key, contact.color);
    fillEditForm(name || "", mail || "", phone || "", color);
    currentEditKey = key;
    showEditOverlay(name || "", color);
  } catch (error) { }
  toggleContactsSlider();}

/**
 * Filters all tasks and finds those assigned to the given contact name.
 * 
 * @param {string} name -The name of the contact to search for in the assigned tasks
 */
function findContactTasks(name) {
  taskContactIsIncluded = tasks.filter((i) => {
    return i.assigned_to.includes(name)
  })
}

/**
 * Fetches a single contact by its key.
 * @param {string} key - The contact key.
 * @returns {Promise<Object>} - Contact object.
 */
async function fetchContactByKey(key) {
  const response = await fetch(`${BASE_URL}contacts/${key}.json`);
  return await response.json();
}

/**
 * Ensures the contact has a color assigned; generates one if missing.
 * @param {string} key - The contact key.
 * @param {string} color - The current color.
 * @returns {Promise<string>} - Final color value.
 */
async function ensureContactColor(key, color) {
  if (!color) {
    color = getRandomColor();
    await fetch(`${BASE_URL}contacts/${key}/color.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(color)
    });
  }
  return color;
}

/**
 * Fills the edit form fields with given contact data.
 * @param {string} name 
 * @param {string} mail 
 * @param {string} phone 
 * @param {string} color 
 */
function fillEditForm(name, mail, phone, color) {
  document.getElementById("editName").value = name;
  document.getElementById("editMail").value = mail;
  document.getElementById("editPhone").value = phone;
}

/**
 * Displays the edit avatar and overlay.
 * @param {string} name - Contact name.
 * @param {string} color - Avatar background color.
 */
function showEditOverlay(name, color) {
  const avatar = document.getElementById("editAvatar");
  avatar.textContent = getInitials(name);
  avatar.style.background = color;
  document.getElementById("editContactOverlay").classList.remove("hidden");
}

/**
 * Toggles the visibility of the contact slider.
 */
function toggleContactsSlider() {
  document.getElementById("contactsSlider").classList.toggle("open");
}

/**
 * Validates and saves the edited contact data.
 */
async function CheckEditedContact() {
  const name = document.getElementById("editName").value;
  const mail = document.getElementById("editMail").value;
  const phone = document.getElementById("editPhone").value;
  const color = document.getElementById("editAvatar").style.background || getRandomColor();
  if (!name || !mail || !phone) {
    alertEdit(); return;}
  if (!emailPattern.test(mail)) {
    alertValidMailEdit(); return;}
  if (!digitPattern.test(phone)) {
    alertValidNumberEdit(); return;}
  await combineFullContact(name, mail, phone, color)
}

/**
 * Combines the new contact
 */
async function combineFullContact(name, mail, phone, color) {
  const updatedContact = {
    name: name,
    mail: mail,
    phone_number: phone,
    color: color
  };
  await saveEditedContact(updatedContact);
  await updateTasks(updatedContact.name);
}

/**
 * Updates all tasks assigned to a specific contact name by replacing the contact
 * name in the `assigned_to` array with a new name.
 *
 * The tasks to be updated must be stored in the global variable `taskContactIsIncluded`.
 *
 * @param {string} name - The new name to assign in the `assigned_to` array.
 */
async function updateTasks(name) {
  for (let index = 0; index < taskContactIsIncluded.length; index++) {
    let currentContactIndex = taskContactIsIncluded[index].assigned_to.indexOf(currentEditName)
    let currentTaskPath = BASE_URL + "tasks/" + taskContactIsIncluded[index].firebaseKey + "/assigned_to/" + currentContactIndex;
    let response = await fetch(currentTaskPath + ".json", {
      method: "PUT",
      header: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(name)
    });
  }}

/**
 * Saves the edited contact to the database.
 * @param {Object} updatedContact - Contact object.
 */
async function saveEditedContact(updatedContact) {
  try {
    await fetch(`${BASE_URL}contacts/${currentEditKey}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedContact)
    });
    closeEditContact();
    await fetchContacts();
    showContact(updatedContact, updatedContact.color, currentEditKey);
  } catch (error) { }
}

/**
 * Deletes a contact by its key.
 * @param {string} key - Contact key.
 */
async function deleteContact(key) {
  try {
    await fetch(`${BASE_URL}contacts/${key}.json`, { method: "DELETE" });
    document.getElementById("contactView").innerHTML = errorTamplate();
    await fetchContacts();
  } catch (error) { }
}

/**
 * Generates a database-safe key from a contact name.
 * @param {string} name - Contact name.
 * @returns {string} - Sanitized key.
 */
function generateKeyFromName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "_");
}

/**
 * Creates a new contact from form input.
 */
async function createContact() {
  const name = getInputValue("contactName");
  const mail = getInputValue("contactEmail");
  const phone = getInputValue("contactPhone");
  if (!name || !mail || !phone) {
    alert(); return;}
  if (!emailPattern.test(mail)) {
    alertValidMail(); return;}
  if (!digitPattern.test(phone)) {
    alertValidNumber(); return;}
  createNewContact(name, mail, phone);
}

/**
 * Builds and saves a new contact to the database.
 * @param {string} name 
 * @param {string} mail 
 * @param {string} phone 
 */
async function createNewContact(name, mail, phone) {
  const newContact = buildContactObject(name, mail, phone);
  const key = generateKeyFromName(name);
  await saveContact(key, newContact);
  await fetchContacts();
}

/**
 * Gets the value of an input field by ID.
 * @param {string} id - Element ID.
 * @returns {string} - Trimmed input value.
 */
function getInputValue(id) {
  return document.getElementById(id).value.trim();
}