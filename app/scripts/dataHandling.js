import { getDataFromStorage, getResultKey } from "../scripts/storage.js";
import { formatDate } from "./utils.js";
import { getTeamDetails } from "../scripts/api.js";
import { revealSection, showErrorMessage, setActiveMenu, showPage } from "../scripts/renderUI.js";

export function displayData(target, data) {

    if (target == 'team-details') {
        displayTeamDetails(data);
    }

    if (!Array.isArray(data)) {
        displayDataBasedOnIdentifier(data, target)
        
    } else {
        for (const key in data) {
            const item = data[key];
            displayDataBasedOnIdentifier(item, target);
        }
    }

    setActiveMenu(target);
    showPage(target);
}

function displayDataBasedOnIdentifier(data, target) {
    const dataKey = getResultKey(data);

    switch (data.identifier) {
        case 'standings':

            if (target == 'standings') {
                displayStandings(data[dataKey]);
            } else {
                displayTopThreeTeams(data[dataKey].slice(0, 3));
            }
            
            break;
    
        case 'league_teams': 
            displayLeagueTeams(data[dataKey]);
            break;
        case 'prev_games':
            let prev10Games = data[dataKey].slice(0,10);
            displayPreviousGames(prev10Games);
            break;
        case 'games_today': 
            displayCurrentGames(data[dataKey]);
            break;
        default:
            break;
    }

}

export function displayStandings (data) {

    const standingsSection = document.querySelector('.js-standings-section');
    const standingsTableBody = document.querySelector('.js-standings-body');

    // If there's no data
    if (!data || data.length == 0) {
        showErrorMessage(standingsSection, 'No data found...');
        revealSection(standingsSection);
        return;   
    }

    standingsTableBody.innerHTML = '';

    data.forEach((teamObject) => {

        const tableRow = document.createElement('tr');
        tableRow.id = teamObject.idTeam;

        const tableData = `
            <td>
                <span>${teamObject.intRank}</span>
                <img class="team__logo" src="${teamObject.strTeamBadge}" alt="${teamObject.strTeam}">
                ${teamObject.strTeam}
            </td>
            <td>${teamObject.intPlayed}</td>
            <td>${teamObject.intGoalDifference}</td>
            <td>${teamObject.intPoints}</td>`;

        tableRow.innerHTML = tableData;

        standingsTableBody.appendChild(tableRow);
    }); 

    revealSection(standingsSection);
}

export function displayLeagueTeams (data) {

    const teamSection = document.querySelector('.js-teams-section');
    const teamListUl = document.querySelector('.js-teamlist');
    let listItems = [];

    // If there's no data
    if (!data || data.length == 0) {
        showErrorMessage(teamSection, 'No teams found...');
        revealSection(teamSection);
        return;   
    }

    data.forEach((teamObject) => {
        const listData = `
                    <li class="card__item">
                        <a href="#team-details/${teamObject.idTeam}">
                            <img class="team__logo" src="${teamObject.strTeamBadge}" alt="${teamObject.strTeam}">
                        </a>
                    </li>
        `;
        listItems.push(listData);
    }); 

    teamListUl.innerHTML = '';

    listItems.forEach((element, key) => {
        teamListUl.innerHTML += element;
    });

    teamSection.querySelector('h2').innerHTML = `WSL Teams <span class="identifier">(${data.length})</span>`;
    revealSection(teamSection);

}

export function displayTopThreeTeams(leagueTeams) {

    const teamSection = document.querySelector('.js-top-three-section');
    const teamListUl = document.querySelector('.js-top-three');
    let listItems = [];

    // If there's no data but also no data in storage
    if (!leagueTeams || leagueTeams.length == 0) {
        showErrorMessage(teamSection, 'No teams found...');
        revealSection(teamSection);
        return;
    }

    leagueTeams.forEach(leagueTeamObject => {

        const listData = `
                        <li class="card__item">
                            <img class="team__logo" src="${leagueTeamObject.strTeamBadge.replace('/tiny', '')}" alt="${leagueTeamObject.strTeam}">
                            <div class="card__details">
                                <h3>${leagueTeamObject.strTeam}</h3>
                                <p class="text__bubble">${leagueTeamObject.intPoints} points</p>
                            </div>
                        </li>`;
        listItems.push(listData);

    });

    teamListUl.innerHTML = '';

    listItems.forEach((element) => {
        teamListUl.innerHTML += element;
    });

    revealSection(teamSection);
    
}

async function getPreviousGameHtml (events) {
    // shoutout naar Robert voor deze
    const listItems = events.map(async (eventObject) => {

        const fetches = [];
    
        fetches.push(await getTeamDetails(eventObject.idHomeTeam));
        fetches.push(await getTeamDetails(eventObject.idAwayTeam));

        let listItem = Promise.all(fetches).then(data => {
            const homeTeam = data[0];
            const awayTeam = data[1];
            const eventDate = formatDate(eventObject.dateEvent, 'dd/mm/yyyy');

            return `
                <li class="card__item ${eventObject.strStatus.toLowerCase() == 'match postponed' ? 'card__item--postponed' : ''}">
                    <div class="card__group">
                        <div>
                            <img class="team__logo" src="${homeTeam.strTeamBadge}" alt="">

                            <div class="team__score team__score--result ${ eventObject.intHomeScore > eventObject.intAwayScore ? 'team__score--win' : (eventObject.intHomeScore == eventObject.intAwayScore ? '' : 'team__score--loss') }">
                                <p>${eventObject.intHomeScore ?? 0 }</p>
                            </div>
                        </div>

                        <div>
                            <img class="team__logo" src="${awayTeam.strTeamBadge}" alt="">

                            <div class="team__score team__score--result ${ eventObject.intAwayScore > eventObject.intHomeScore ? 'team__score--win' : (eventObject.intHomeScore == eventObject.intAwayScore ? '' : 'team__score--loss') }">
                                <p>${eventObject.intAwayScore ?? 0 }</p>
                            </div>
                        </div>
                    </div>

                    <span>${eventObject.strStatus.toLowerCase() == 'match postponed' ? 'Postponed' : eventDate }</span>
                </li>
            `;
        })

        return listItem;
    });

    return listItems;

}

async function displayPreviousGames(events) {

    const prevMatchSection = document.querySelector('.js-prev-matches-section');
    const prevMatchList = document.querySelector('.js-prev-matches-list');

    try {

        const listItems = await getPreviousGameHtml(events);
        Promise.all(listItems).then(data => {
            prevMatchList.innerHTML = '';

            data.forEach((element) => {
                prevMatchList.innerHTML += element;
            });

            revealSection(prevMatchSection);
        })
       
    } catch (error) {
        showErrorMessage(prevMatchSection, 'Something went wrong!');
        revealSection(prevMatchSection);

        console.log('WEEWOOWEEOWW DISPLAY ERROR');
        console.log(error);
    }
}

function displayCurrentGames(events) {

    const matchSection = document.querySelector('.js-matches-section');
    const matchList = document.querySelector('.js-matchlist');
    let listItems = [];

    try {

        if (events) {
            
            listItems = events.map(async (eventObject) => {
            
                const fetches = [];
            
                fetches.push(await getTeamDetails(eventObject.idHomeTeam));
                fetches.push(await getTeamDetails(eventObject.idAwayTeam));
    
                let listItem = Promise.all(fetches).then(data => {
                    const homeTeam = data[0];
                    const awayTeam = data[1];
                    const startTime = eventObject.strTime.substr(0, eventObject.strTime.lastIndexOf(":"));
    
                    return `
                        <li class="card__item">
                            <div class="event__teamname">
                                <p>${eventObject.strHomeTeam}</p>
                            </div>
    
                            <div class="event__details">
                                <img class="team__logo" src="${homeTeam.strTeamBadge}" alt="">
    
                                <div class="event__details__time">
                                    <p>${startTime}</p>
                                </div>
    
                                <img class="team__logo" src="${awayTeam.strTeamBadge}" alt="">
    
                            </div>
    
                            <div class="event__teamname">
                                <p>${eventObject.strAwayTeam}</p>
                            </div>
    
                        </li>
                    `;
                })
    
                return listItem;
            });
    
            Promise.all(listItems).then(data => {
    
                matchList.innerHTML = '';
    
                data.forEach((element) => {
                    matchList.innerHTML += element;
                });

                revealSection(matchSection);
    
            });

        // No games
        } else {

            showErrorMessage(matchSection, 'No games today');

            if (matchList)
                matchList.remove();

            revealSection(matchSection);
        
        }

    } catch (error) {
        showErrorMessage(matchSection, 'Something went wrong!');
        revealSection(matchSection);

        console.log('WEEWOOWEEOWW DISPLAY ERROR');
        console.log(error);
    }
}

async function displayTeamDetails(teamData) {

    const teamDetailsPage = document.querySelector('#team-details-page');
    const teamDetailsSection = document.querySelector('.js-team-details-section');
    const teamDetailsContent = document.querySelector('.js-team-details-content');

    // TODO: error handling

    teamData.forEach(async (data) => {
        const resultKey = getResultKey(data);

        if (data.identifier == 'team_details') {

            const headerLogo = teamDetailsPage.querySelector('.js-teamlogo');
            const teamName = teamDetailsPage.querySelector('.js-teamname');

            let teamObject = data[resultKey];
            
            headerLogo.src = teamObject.strTeamBadge;
            teamName.innerHTML = teamObject.strTeam;

        } else if (data.identifier == 'prev_games_by_team') {
            const listItems = await getPreviousGameHtml(data[resultKey]);

            Promise.all(listItems).then(data => {

                const prevMatchList = teamDetailsPage.querySelector('.js-prev-team-games');

                prevMatchList.innerHTML = '';

                data.forEach((element, key) => {
                    prevMatchList.innerHTML += element;
                });

                const section = document.querySelector('.js-team-prev-games-section');
                revealSection(section);

            });
        } else if (data.identifier == 'team_squad') {
            const squadList = teamDetailsPage.querySelector('.js-squad-list');
            squadList.innerHTML = '';

            let listHtml = '';

            for (const key in data[resultKey]) {
                const playerGroup = data[resultKey][key];
             
                listHtml += `
                    <div class="card-wrapper">
                        <h3>${key}</h3>
                        <ul class="cards cards--overview">   
                `;

                playerGroup.forEach((squadMember) => {
                    const listItem = `
                        <li class="card__item card__item--column">
                            <picture class="player__cutout">
                                <img class="${!squadMember.strCutout ? 'normal-photo' : ''}" src="${squadMember.strCutout ?? squadMember.strThumb }" alt="${squadMember.strPlayer} cutout">
                            </picture>

                            <div class="card__details">
                                <h3>${squadMember.strPlayer}</h3>
                                <p>${squadMember.strPosition}</p>
                            </div>
                        </li>
        
                    `;

                    listHtml += listItem;

                });

                listHtml += '</ul></div>';

            }

            squadList.innerHTML += listHtml;

            const section = document.querySelector('.js-team-details-content');
            revealSection(section);

        }

    });

    return;
    
}