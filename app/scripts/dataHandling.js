
export function displayData(target, data) {

    // Set data based on identifier
    for (const key in data) {
        const item = data[key];
        const identifier = Object.keys(item)[1];
        const dataKey = Object.keys(item)[0];

        if (item[identifier] == 'standings') {

            if (target == 'standings') {
                displayStandings(item[dataKey]);
            } else {
                displayTopThreeTeams(item[dataKey].slice(0, 3));
            }
        } else if (item[identifier] == 'league_teams') {
            displayLeagueTeams(item[dataKey]);
        }
    }

    setActiveMenu(target);
    showPage(target);
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
        articleEl.classList.add('hide');

        if (target == '' && articleEl.id == 'home-page') {
            articleEl.classList.remove('hide');   
        } else if (articleEl.id == (target + '-page')) {
            articleEl.classList.remove('hide');
        }
    });

    window.scrollTo(0, 0);

}

export function displayStandings (data) {

    const standingsSection = document.querySelector('.js-standings-section');
    const standingsTableBody = document.querySelector('.js-standings-body');
    let isFinished = false;

    standingsTableBody.innerHTML = '';

    data.forEach((teamObject, i) => {

        const tableRow = document.createElement('tr');
        tableRow.id = teamObject.idTeam;

        const tableData = `
            <td>
                <span>${teamObject.intRank}</span>
                <img src="${teamObject.strTeamBadge}" alt="${teamObject.strTeam}">
                ${teamObject.strTeam}
            </td>
            <td>${teamObject.intPlayed}</td>
            <td>${teamObject.intGoalDifference}</td>
            <td>${teamObject.intPoints}</td>`;

        tableRow.innerHTML = tableData;

        standingsTableBody.appendChild(tableRow);

        if ((i + 1) == data.length) {
            isFinished = true;
        }
    }); 

    if (isFinished) {
        standingsSection.querySelector('.loader').classList.add('hide');
        standingsSection.querySelector('.js-standings-table').classList.remove('hide');
    }
}

export function displayLeagueTeams (data) {

    const teamSection = document.querySelector('.js-teams-section');
    const teamListUl = document.querySelector('.js-teamlist');
    let listItems = [];


    data.forEach((teamObject) => {
        const listData = `<li class="teamlist__item"><img src="${teamObject.strTeamBadge}" alt="${teamObject.strTeam}"></li>`;
        listItems.push(listData);
    }); 

    let isFinished = false;
    teamListUl.innerHTML = '';

    listItems.forEach((element, key) => {
        teamListUl.innerHTML += element;

        if ((key + 1) == listItems.length) {
            isFinished = true;
        }
    });

    teamSection.querySelector('h2').innerHTML = `WSL Teams <span class="identifier">(${data.length})</span>`;

    if (isFinished) {
        teamSection.querySelector('.loader').classList.add('hide');
        teamListUl.classList.remove('hide');
    }
}

export function displayTopThreeTeams(leagueTeams) {

    const teamSection = document.querySelector('.js-top-three-section');
    const teamListUl = document.querySelector('.js-top-three');
    let listItems = [];


    leagueTeams.forEach(teamObject => {
        const listData = `
                        <li class="team-highlight__item">
                            <img src="${teamObject.strTeamBadge}" alt="${teamObject.strTeam}">
                            <div class="highlight__details">
                                <h3>${teamObject.strTeam}</h3>
                                <p>${teamObject.intPoints} points</p>
                            </div>
                        </li>`;
        listItems.push(listData);
    });

    let isFinished = false;
    teamListUl.innerHTML = '';

    listItems.forEach((element, key) => {
        teamListUl.innerHTML += element;

        if ((key + 1) == listItems.length) {
            isFinished = true;
        }
    });


    if (isFinished) {
        teamSection.querySelector('.loader').classList.add('hide');
        teamListUl.classList.remove('hide');
    }

    
}