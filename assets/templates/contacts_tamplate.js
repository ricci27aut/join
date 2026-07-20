function showContact(contact, color, key) {
  document.getElementById("contactView").innerHTML = `
    <div class="contact-view">
      <div class="contact-info">
        <div class="contact-avatar avatar-style" style="background:${color};">
          ${getInitials(contact.name)}
        </div>
        <div class="contact-name-buttons">
          <h2>${contact.name}</h2>
          <button class="contact-name-buttons-edit" onclick="alertremoveEdit(); editContact('${key}','${contact.name}');">Edit</button>
          <button class="contact-name-buttons-delete" onclick="deleteContact('${key}')">Delete</button>
        </div>
      </div>
      <p class="contact-info-subtitle">Contact Information</p>
      <div class="contact-info-block">        
        <p><strong>Email:</strong><br><br><a class="contacts-mail" href="mailto:${contact.mail}">${contact.mail}</a></p><br>
        <p><strong>Phone:</strong><br><br>${contact.phone_number || '-'}</p>
      </div>
    </div>
  `;

  const editBtn = document.querySelector("#contactsSlider .edit-menu-btn");
  const deleteBtn = document.querySelector("#contactsSlider .delete-menu-btn");

  if (editBtn) editBtn.onclick = () => editContact(key);
  if (deleteBtn) deleteBtn.onclick = () => deleteContact(key);

  if (window.innerWidth < 930) {
    document.querySelector(".contacts-list").classList.remove("show");
    document.getElementById("contactDetails").classList.add("show");
  }
}

function listTamplate(color, contact){
 return `
    <span class="contact-avatar margen-avatar" style="background:${color}">${getInitials(contact.name)}</span>
    <div>
      <p class="contacts-name">${contact.name}</p>
      <p class="contacts-mail">${contact.mail}</p>
    </div>
  `
}

function errorTamplate(){
 return `
    <p>Select a contact from the list</p>
  `;
}

function noKontaktTamplate() {
  return `
    <p>No contacts found</p>
  `;
}

function warningText() {
  return `
    <p class="warning">Please fill in all fields!</p>
  `;
}

function alertValidMailText() {
  return `
    <p class="warning">Please enter a valid email address!</p>
  `;
}

function  alertValidNumberText() {
   return `
    <p class="warning">Please enter a valid phone number</p>
  `;
}
