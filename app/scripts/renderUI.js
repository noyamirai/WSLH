export function revealSection(section) {

    const contentContainer = section.querySelector('.js-content');
    const messageEl = section.querySelector('.js-message');
    const loaderEl = section.querySelector('.loader');

    if (loaderEl)
        loaderEl.classList.add('hide');
    
    if (contentContainer)
        contentContainer.classList.remove('hide');

    if (messageEl)
        messageEl.classList.remove('hide');
}

export function showErrorMessage(section, text) {
    let messageEl = section.querySelector('.message');

    if (!messageEl) {
        
        messageEl = document.createElement('div');
        messageEl.className = 'message message--empty js-message hide';
        messageEl.innerHTML = `<i class="icon fa-solid fa-heart-crack"></i><p>${text}</p>`;
        section.appendChild(messageEl);
    }

}