export function revealSection(section) {

    const contentContainer = section.querySelector('.js-content');
    const messageEl = section.querySelector('.js-message');
    const loaderEl = section.querySelector('.loader');

    setTimeout(() => {
        
        if (loaderEl)
            loaderEl.classList.add('hide');
        
        if (contentContainer)
            contentContainer.classList.remove('hide');
    
        if (messageEl)
            messageEl.classList.remove('hide');
            
    }, 200);

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

export function toggleSpecificLoader(loaderDiv, state) {
    const loaderEl = document.querySelector(loaderDiv);

    if (state == 'on') {
        loaderEl.classList.remove('hide');
    } else {
        loaderEl.classList.add('hide');
    }
}