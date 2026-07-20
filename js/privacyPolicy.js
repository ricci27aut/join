/**
 * highlight the privacy policy link at the menu 
 */
function highlightLink() {
    if (window.innerWidth > 1350) {
        const currentLink = document.getElementById('privacy');
        if (currentLink) {
            currentLink.classList.add('activeLink');
        }
    }
}