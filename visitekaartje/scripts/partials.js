const articleElement = document.querySelector('article');

const getHashtags = (charCount) => {
    let result = '';

    for (let i = 0; i < charCount; i++) {
        result += '#';
    }

    return result;
}

const setCommentHeading = (headingContainer) => {

    const heading = headingContainer.querySelector('.comment__heading');
    const hashtags = headingContainer.querySelectorAll('.comment__hashtags');

    heading.innerHTML = heading.textContent.replace(/ /g, '&#x2022;');
    heading.innerHTML = '#&#x2022;' + heading.textContent + '&#x2022;#';

    const charCount = heading.textContent.length;
    const hashtagString = getHashtags(charCount);

    // Set hashtags
    hashtags.forEach(spanEl => {
        spanEl.textContent = hashtagString;
    });

}

const setPromptPartial = () => {

    const allPromptInputs = document.querySelectorAll('form');
    const index = 0;
    const firstId = allPromptInputs[index].id;
    let id;

    if (firstId == 'prompt-form') {
        id = allPromptInputs.length + 1;
    } else {
        if (allPromptInputs.length == 1) {
            id = parseInt(allPromptInputs[index].id.split('-').pop().trim()) + 1;
        } else {
            const lastFormElement = document.querySelector('form:last-of-type');
            id = parseInt(lastFormElement.id.split('-').pop().trim()) + 1;
        }
    }

    
    const currentTime = getCurrentTime();

    const promptHtml = '<form action="GET" id="prompt-form-' + id + '"><fieldset class="prompt"><div><label class="prompt__label" for="term-prompt"><span class="blue">guest</span><span class="green">@term.noya:</span><span class="blue">~</span></label><div class="growing-input js-growingInputContainer"><input class="prompt__input" type="text" name="user_prompt" id="promptInputField-'+ id +'" placeholder="help"></div></div><p class="prompt__time js-current_time">' + currentTime + '</p></fieldset></form>';

    return promptHtml;
}

const insertPromptPartial = async () => {
    const promptHtml = setPromptPartial();
    articleElement.innerHTML += promptHtml;
}

const getSectionHeading = (sectionId) => {

    const headings = {
        'help': 'Command list',
        'about': 'Get to know me',
        'projects': 'Projects I am proud of',
        'skills': 'Things Im good at'
    }

    return headings[sectionId];
}

const getContent = (sectionId) => {

    const content = {
        'help': '<ul class="generic-list generic-list--help"><li class="list__item"><h3>help</h3></li><li class="list__item"><h3>about</h3></li><li class="list__item"><h3>projects</h3></li><li class="list__item"><h3>skills</h3></li></ul>',
        'about': '<p  id="text">&gt;_Hello! I guess you&#39;re here to read a little more about who I am and what I do.</p><p >&gt;_My name is Maijla Ikiz, I am a 24 y/o <s>nerd</s> full-stack web developer + designer by day and average video game enthusiast by night :)</p><p >&gt;_I am currently a third year Communication &amp; Multimedia Design student at the Amsterdam University of Applied Sciences. In the meantime I have also been working as a part-time web developer @ <a target="_blank" title="https://activo.nl" href="https://activo.nl">Activo</a> for over 4 years now.</p>',
        'projects': '<ul class="generic-list"> <li class="list__item"> <a href="#"> <h3>&gt;_CMD Online <span>~A browser based matching application that helps teachers of CMD create well-balanced project teams based on skills of students.</span></h3> </a> <ul class="list__item__tags"> <li class="tag tag--yellow"> GDA 2022 Nominee </li> <li class="tag tag--red"> HTML </li> <li class="tag tag--purple"> CSS </li> <li class="tag tag--blue"> JS </li> <li class="tag tag--green"> Node.js </li> </ul> </li> <li class="list__item"> <a href="#"> <h3>&gt;_CMD Online <span>~A browser based matching application that helps teachers of CMD create well-balanced project teams based on skills of students.</span></h3> </a> <ul class="list__item__tags"> <li class="tag tag--yellow"> GDA 2022 Nominee </li> <li class="tag tag--red"> HTML </li> <li class="tag tag--purple"> CSS </li> <li class="tag tag--blue"> JS </li> <li class="tag tag--green"> Node.js </li> </ul> </li> <li class="list__item"> <a href="#"> <h3>&gt;_CMD Online <span>~A browser based matching application that helps teachers of CMD create well-balanced project teams based on skills of students.</span></h3> </a> <ul class="list__item__tags"> <li class="tag tag--yellow"> GDA 2022 Nominee </li> <li class="tag tag--red"> HTML </li> <li class="tag tag--purple"> CSS </li> <li class="tag tag--blue"> JS </li> <li class="tag tag--green"> Node.js </li> </ul> </li> </ul>',
        'skills': '<ul class="skills"> <li class="skill__item"> <p>HMTL</p> <div class="skill__level"> <span class="skill__level__indicator js-skill-level-container" data-percentage="80"> <span class="blue">[</span> <span class="js-level">----------</span> <span class="blue">]</span> </span> <p class="skill__level__percentage js-level-percentage">0%</p> </div> </li> <li class="skill__item"> <p>CSS</p> <div class="skill__level"> <span class="skill__level__indicator js-skill-level-container" data-percentage="60"> <span class="blue">[</span> <span class="js-level">----------</span> <span class="blue">]</span> </span> <p class="skill__level__percentage js-level-percentage">0%</p> </div> </li> <li class="skill__item"> <p>Javascript</p> <div class="skill__level"> <span class="skill__level__indicator js-skill-level-container" data-percentage="80"> <span class="blue">[</span> <span class="js-level">----------</span> <span class="blue">]</span> </span> <p class="skill__level__percentage js-level-percentage">0%</p> </div> </li> <li class="skill__item"> <p>Node.js</p> <div class="skill__level"> <span class="skill__level__indicator js-skill-level-container" data-percentage="50"> <span class="blue">[</span> <span class="js-level">----------</span> <span class="blue">]</span> </span> <p class="skill__level__percentage js-level-percentage">0%</p> </div> </li> <li class="skill__item"> <p>PHP</p> <div class="skill__level"> <span class="skill__level__indicator js-skill-level-container" data-percentage="50"> <span class="blue">[</span> <span class="js-level">----------</span> <span class="blue">]</span> </span> <p class="skill__level__percentage js-level-percentage">0%</p> </div> </li> <li class="skill__item"> <p>SQL</p> <div class="skill__level"> <span class="skill__level__indicator js-skill-level-container" data-percentage="50"> <span class="blue">[</span> <span class="js-level">----------</span> <span class="blue">]</span> </span> <p class="skill__level__percentage js-level-percentage">0%</p> </div> </li> </ul>'
    }

    return content[sectionId];
}

const setSectionPartial = (sectionId) => {

    const allSpecificSections = document.querySelectorAll('.js-' + sectionId);

    const nId = sectionId +  '-' + (allSpecificSections.length + 1);
    let heading = getSectionHeading(sectionId);

    let hashtagString = getHashtags(heading.length);
    heading = heading.replace(/ /g, '&#x2022;');
    heading = '#&#x2022;' + heading + '&#x2022;#';

    hashtagString += '####';

    let sectionHtml = '<section class="info js-' + nId + '"> <div class="info__heading comment"> <span class="comment__text comment__hashtags">' + hashtagString  + '</span> <h2 class="comment__text comment__heading">' + heading + '</h2> <span class="comment__text comment__hashtags">' + hashtagString + '</span> </div><div class="info__content">'
    sectionHtml += getContent(sectionId);
    sectionHtml += '</div></section>';

    return sectionHtml;

};

const revealSection = (sectionId) => {

    const sectionHtml = setSectionPartial(sectionId);
    articleElement.innerHTML += sectionHtml;

}

const showError = () => {

    let errorHtml = '<section class="info info--message error"><p>command not found. type "help" to see available commands.</p></section>';
    articleElement.innerHTML += errorHtml;

    insertPromptPartial();
}