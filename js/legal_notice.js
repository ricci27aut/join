/**
 * render the functions checkLogged() and header() into the HTML
 * render the burger menu
 */
function initTask () {
  document.getElementById("menuTemplate").innerHTML = checkLogged();
  document.getElementById("headerTemplate").innerHTML = header();
  initAvatarSlider();
}

/**
 * Function to toggle the burger menu
 */
function initAvatarSlider() {
  const avatar = document.getElementById("userAvatar");
  const slider = document.getElementById("userSlider");
    avatar.addEventListener("click", (e) => {
      e.stopPropagation();
      slider.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      const isClickInside = slider.contains(e.target) || avatar.contains(e.target);
      if (!isClickInside) {
        slider.classList.remove("open");
      }});
}

/**
 * highlight the legal notice link at the menu 
 */
function highlightLink() {
    if (window.innerWidth > 1350) {
        const currentLink = document.getElementById('legal');
        if (currentLink) {
            currentLink.classList.add('activeLink');
        }
    }
}