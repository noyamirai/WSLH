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

export function setActiveMenu(target) {
    const allMenuItems = document.querySelectorAll('.menu__item');

    allMenuItems.forEach(menuItem => {
        if (menuItem.classList.contains('active')) {
            menuItem.classList.remove('active');
        }

        const anchorTag = menuItem.querySelector('a');
        const hashPart = anchorTag.href.split('#')[1];

        if (hashPart == target) {
            menuItem.classList.add('active');
        }
    });
}

export function showPage(target) {

    const allArticles = document.querySelectorAll('article');
    allArticles.forEach(articleEl => {
        if (!articleEl.classList.contains('window')) {
            articleEl.classList.add('hide');
        } else {
            articleEl.classList.remove('window--open');
        }

        if (target == '' && articleEl.id == 'home-page') {
            articleEl.classList.remove('hide');   
        } else if (target == 'team-details' && articleEl.id == (target + '-page')) {
            articleEl.classList.add('window--open');
        } else if (articleEl.id == (target + '-page')) {
            articleEl.classList.remove('hide'); 
        }
    });

    window.scrollTo(0, 0);

}