
export function displayData(data) {


    // Set data based on identifier
    for (const key in data) {
        const item = data[key];
        const identifier = Object.keys(item)[1];
        const apiData = Object.keys(item)[0];

        if (item[identifier] == 'standings') {
            // displayStandings(item, apiData);
        } else if (item[identifier] == 'league_teams') {
            displayLeagueTeams(item, apiData);
        }
    }
}


export function displayStandings (data, key) {

    const standingsSection = document.querySelector('.js-standings-section');
    const standingsTableBody = document.querySelector('.js-standings-body');
    let isFinished = false;

    data[key].forEach((teamObject, i) => {

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

        if ((i + 1) == data[key].length) {
            isFinished = true;
        }
    }); 

    if (isFinished) {
        standingsSection.querySelector('.loader').remove();
        standingsSection.querySelector('.js-standings-table').classList.remove('hide');
    }
}

export function displayLeagueTeams (data, key) {

    const teamSection = document.querySelector('.js-teams-section');
    const teamListUl = document.querySelector('.js-teamlist');
    let listItems = [];

    data[key].forEach((teamObject) => {
        const listData = `<li class="teamlist__item"><img src="${teamObject.strTeamBadge}" alt="${teamObject.strTeam}"></li>`;
        listItems.push(listData);
    }); 

    let isFinished = false;

    listItems.forEach((element, key) => {
        teamListUl.innerHTML += element;

        if ((key + 1) == listItems.length) {
            isFinished = true;
        }
    });

    teamSection.querySelector('h2').innerHTML += ` <span class="identifier">(${data[key].length})</span>`;

    if (isFinished) {
        teamSection.querySelector('.loader').remove();
        teamListUl.classList.remove('hide');
    }
}