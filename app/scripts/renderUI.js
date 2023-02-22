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