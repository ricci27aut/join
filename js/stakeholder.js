const email ="join.issue.aicollector@gmail.com"


function init(){
    loadRequestCount();
}

async function loadRequestCount(){
 try {
    const response = await fetch("https://join-13fcf-default-rtdb.europe-west1.firebasedatabase.app/count.json");
    const data = await response.json();

    renderUserFeedback(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

function openGmail() {
  const email = "join.issue.aicollector@gmail.com";

  const gmailUrl =
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;

  window.open(gmailUrl, "_blank");
}

function renderUserFeedback(data) {
    const contentRef = document.getElementById("userFeedback");
    contentRef.innerHTML = ``;
    contentRef.innerHTML = `<p class="font-bold">${data.count}</p> of <p class="font-bold">10</p> requests used today`;

    if (data.count >= 10) {
        fullRequest(contentRef);
    }
}

function fullRequest(contentRef) {
const sectionOne = document.getElementById("section-one");
const sectionTwo = document.getElementById("section-two");

sectionOne.classList.add("dnone");
sectionTwo.classList.remove("dnone");
contentRef.classList.add("red-text");
}