const email = "join.issue.aicollector@gmail.com"


/**
 * Initializes the stakeholder page and loads the current request count.
 *
 * @returns {void}
 */
function init() {
  loadRequestCount();
}

/**
 * Fetches the current request count from Firebase and renders it on the page.
 *
 * @async
 * @returns {Promise<Object|undefined>} The request-count data, or undefined if the request fails.
 */
async function loadRequestCount() {
  try {
    const response = await fetch("https://join-13fcf-default-rtdb.europe-west1.firebasedatabase.app/count.json");
    const data = await response.json();

    renderUserFeedback(data);
    return data;
  } catch (error) {
  }
}

/**
 * Opens a new Gmail compose window addressed to the issue collector.
 *
 * @returns {void}
 */
function openGmail() {
  const email = "join.issue.aicollector@gmail.com";

  const gmailUrl =
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;

  window.open(gmailUrl, "_blank");
}

/**
 * Displays the number of requests used in the desktop and mobile views.
 * Shows the request-limit state when the daily maximum has been reached.
 *
 * @param {{count: number}} data - The request-count data returned by Firebase.
 * @returns {void}
 */
function renderUserFeedback(data) {
  const contentRef = document.getElementById("userFeedback");
  const contentRefMobile = document.getElementById("userFeedbackMobile");
  contentRef.innerHTML = ``;
  contentRef.innerHTML = `<p class="font-bold">${data.count}</p> of <p class="font-bold">10</p> requests used today`;
  contentRefMobile.innerHTML = ``;
  contentRefMobile.innerHTML = `<p class="font-bold">${data.count}</p> of <p class="font-bold">10</p> requests used today`;

  if (data.count >= 10) {
    fullRequest(contentRef, contentRefMobile);
  }
}

/**
 * Updates the page to indicate that the daily request limit has been reached.
 *
 * @param {HTMLElement} contentRef - The request counter in the desktop view.
 * @param {HTMLElement} contentRefMobile - The request counter in the mobile view.
 * @returns {void}
 */
function fullRequest(contentRef, contentRefMobile) {
  const sectionOne = document.getElementById("section-one");
  const sectionTwo = document.getElementById("section-two");

  sectionOne.classList.add("dnone");
  sectionTwo.classList.remove("dnone");
  contentRef.classList.add("red-text");
  contentRefMobile.classList.add("red-text");
}
