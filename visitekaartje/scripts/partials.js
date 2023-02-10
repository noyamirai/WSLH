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

const getPercentageBars = (percentage) => {

    let result = '';
    const nPercentage = percentage/10;

    for (let i = 1; i <= 10; i++) {

        if (i <= nPercentage) {
            if (i == 1)
                result += '<span class="green">';

            result += '=';

            if (i == nPercentage)
                result += '</span>';
        } else {
            result += '-';
        }
    }

    return result;
}

const setPercentageBars = () => {
    const skillIndicators = document.querySelectorAll('.js-skill-level-container');

    skillIndicators.forEach(container => {
        const levelBar = container.querySelector('.js-level');
        const assignedLevel = parseInt(container.dataset.percentage);
        const levelBarContent = getPercentageBars(assignedLevel);
        const percentageText = container.nextElementSibling;

        percentageText.innerHTML = assignedLevel + '%';
        levelBar.innerHTML = levelBarContent; 
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

    const promptHtml = '<fieldset class="prompt"><div><label class="prompt__label" for="term-prompt"><span class="blue">guest</span><span class="green">@term.noya:</span><span class="blue">~</span></label><div class="growing-input js-growingInputContainer"><input class="prompt__input" type="text" name="user_prompt" id="promptInputField-'+ id +'" placeholder="help"></div></div><p class="prompt__time js-current_time">' + currentTime + '</p></fieldset>';

    return {'html' : promptHtml, 'promptId': id};
}

const insertPromptPartial = async () => {
    const promptHtml = setPromptPartial();

    let htmlObject = document.createElement('form');
    htmlObject.method = 'GET';
    htmlObject.id = 'prompt-form-' + promptHtml.promptId;

    htmlObject.innerHTML = promptHtml.html;
    articleElement.appendChild(htmlObject);

    // document.querySelector('form:last-of-type').scrollIntoView(false);
    // articleElement.scroll({ top: articleElement.scrollHeight, behavior: 'smooth' });
    // document.querySelector('form:last-of-type').scrollIntoView({ behavior: 'smooth', block: 'end' });


}

const getSectionHeading = (sectionId) => {

    const headings = {
        'help': 'Command list',
        'about': 'Get to know me',
        'projects': 'Projects I am proud of',
        'skills': 'Things Im good at',
        'contact': 'Contact'
    }

    return headings[sectionId];
}

const getSkills = () => {

    const skillData = [
        {
            'title': 'HTML',
            'percentage': '80'
        },
        {
            'title': 'CSS',
            'percentage': '60'
        },
        {
            'title': 'Javascript',
            'percentage': '80'
        },
        {
            'title': 'Node.js',
            'percentage': '50'
        },
        {
            'title': 'PHP',
            'percentage': '50'
        },
        {
            'title': 'SQL',
            'percentage': '50'
        }
    ];

    let skillHtml = '<ul class="skills">';

    skillData.forEach(skillItem => {
        
        skillHtml += '<li class="skill__item"><p>' + skillItem.title + '</p>';
        skillHtml += '<div class="skill__level"><span class="skill__level__indicator js-skill-level-container" data-percentage="' + skillItem.percentage +'"><span class="blue">[</span>';

        const levelBarContent = getPercentageBars(skillItem.percentage);

        skillHtml += '<span class="js-level">' + levelBarContent + '</span>';
        skillHtml += '<p class="skill__level__percentage js-level-percentage">' + skillItem.percentage + '%</p>';
        skillHtml += '<span class="blue">]</span>';

        skillHtml += '</div> </li>';
    });


    return skillHtml;
}

const getContent = (sectionId) => {

    const content = {
        'help': '<ul class="generic-list generic-list--help"><li class="list__item"><h3>help</h3></li><li class="list__item"><h3>about</h3></li><li class="list__item"><h3>projects</h3></li><li class="list__item"><h3>skills</h3></li><li class="list__item"><h3>contact</h3></li><li class="list__item"><h3>clear</h3></li></ul>',
        'projects': '<ul class="generic-list"> <li class="list__item"> <a href="https://www.cmd-amsterdam.nl/portfolio/cmd-online/"> <h3>&#128279; CMD Online <span>~A browser based matching application that helps teachers of CMD create well-balanced project teams based on skills of students.</span></h3> </a> <ul class="list__item__tags"> <li class="tag tag--yellow"> GDA 2022 Nominee </li> <li class="tag tag--red"> HTML </li> <li class="tag tag--purple"> CSS </li> <li class="tag tag--blue"> JS </li> <li class="tag tag--green"> Node.js </li> </ul> </li> <li class="list__item"> <h3>&gt;_Activibes <span>~A tool used at work to let other know how you&#39;re feeling everyday in order to improve team awareness and closeness.</span></h3> <ul class="list__item__tags"> <li class="tag tag--red"> HTML </li> <li class="tag tag--purple"> CSS </li> <li class="tag tag--blue"> JS </li> <li class="tag tag--green"> Node.js </li> </ul> </li> <li class="list__item"> <h3>&gt;_Actiscan <span>~Web application that helps standholders scan leads via QR codes and form connections while being at an event.</span></h3> <ul class="list__item__tags"> <li class="tag tag--red"> HTML </li> <li class="tag tag--purple"> CSS </li> <li class="tag tag--blue"> JS </li> <li class="tag tag--green"> Node.js </li> </ul> </li> <li class="list__item"> <a href="https://www.cmd-amsterdam.nl/portfolio/hacking-simulator-1-0/" target="_blank"> <h3>&#128279; Hacking Simulator <span>~A Cyberpunk 2077 inspired “simulator” I made in JS for a school assignment.</span></h3> </a> <ul class="list__item__tags"> <li class="tag tag--yellow"> GDA 2021 Nominee </li> <li class="tag tag--red"> HTML </li> <li class="tag tag--purple"> CSS </li> <li class="tag tag--blue"> JS </li> <li class="tag tag--green"> Node.js </li> </ul> </li> </ul>',
        'contact': '<p>&gt;_Want to get in touch? Cool! You can contact me by sending me an <a href="mailto:planet1109@hotmail.com" target="_blank">e-mail</a>, and I will get back to you as soon as possible.</p> <p>&gt;_You might be curious about my socials as well. Don&#39;t worry, I&#39;ve got you covered!</p> <ul class="generic-list generic-list--link"> <li class="list__item"> <a href="https://www.linkedin.com/in/maijla-ikiz-775bab178/" target="_blank"> <h3>&#128279; LinkedIn</h3> </a> </li> <li class="list__item"> <a href="https://github.com/noyamirai" target="_blank"> <h3>&#128279; Github</h3> </a> </li> </ul>',
        'about': '<p>&gt;_Hello! I guess you&#39;re here to read a little more about who I am and what I do.</p> <p>&gt;_My name is Maijla Ikiz, I am a 24 y/o <s>nerd</s> full-stack web developer + designer by day and average video game enthusiast by night :)</p> <p>&gt;_I am currently a third year Communication &amp; Multimedia Design student at the Amsterdam University of Applied Sciences. In the meantime I have also been working as a part-time web developer @ <a target="_blank" title="https://activo.nl" href="https://activo.nl">Activo</a> for over 4 years now.</p>',
        'hello': '<p>hi there :)!</p>',
        'stinky': '<p>you stinky</p>',
        'hehe': '<p>hehehe</p>',
    }

    return content[sectionId];
}

const fetchAboutContent = async () => {
    // const corsTrick = 'https://cors-anywhere.herokuapp.com/';
    const url = 'https://whois.fdnd.nl/api/v1/member?id=cldepgz223wz20bw5mmlfm503';

    let data = await fetch(url);
    data = await data.json();
    
    if (data) {
        return data;
    }
}

const setSectionPartial = async (sectionId) => {

    const allSpecificSections = document.querySelectorAll('.js-' + sectionId);

    const nId = sectionId +  '-' + (allSpecificSections.length + 1);
    let heading = getSectionHeading(sectionId);

    let hashtagString = getHashtags(heading.length);
    heading = heading.replace(/ /g, '&#x2022;');
    heading = '#&#x2022;' + heading + '&#x2022;#';

    hashtagString += '####';

    let sectionHtml = '<div class="info__heading comment"> <span class="comment__text comment__hashtags">' + hashtagString  + '</span> <h2 class="comment__text comment__heading">' + heading + '</h2> <span class="comment__text comment__hashtags">' + hashtagString + '</span> </div><div class="info__content">'
    
    // fetch
    if (sectionId == 'about') {

        try {
            let result = await fetchAboutContent();

            sectionHtml += result.member.bio.html;
            sectionHtml += '</div>';
            return { 'html' : sectionHtml, 'sectionId': 'js-' + nId};

        } catch (error) {
            sectionHtml += getContent(sectionId);
            sectionHtml += '</div>';
            return { 'html' : sectionHtml, 'sectionId': 'js-' + nId};
        }
            
    } else if (sectionId == 'skills') {
        sectionHtml += getSkills();

    } else {
        sectionHtml += getContent(sectionId);
    }

    sectionHtml += '</div>';
    return { 'html' : sectionHtml, 'sectionId': 'js-' + nId};

};

const revealSection = async (sectionId) => {

    try {

        const sectionHtml = await setSectionPartial(sectionId);

        let htmlObject = document.createElement('section');
        htmlObject.id = sectionHtml.sectionId;
        htmlObject.innerHTML = sectionHtml.html;
        articleElement.appendChild(htmlObject);

        return true;

    } catch (error) {
        return false;
    }

}

const showError = () => {

    let errorHtml = '<p>command not found. type "help" to see available commands.</p></section>';

    let htmlObject = document.createElement('section');
    htmlObject.classList.add(['info', 'info--message', 'error'])
    htmlObject.innerHTML = errorHtml;
    articleElement.appendChild(htmlObject);

    insertPromptPartial();
}

const revealSillyContent = (contentId) => {

    if (contentId == 'hi') {
        contentId = 'hello';
    }

    let contentHtml = getContent(contentId);

    let htmlObject = document.createElement('section');
    htmlObject.innerHTML = contentHtml;
    articleElement.appendChild(htmlObject);

}