import { getDataFromStorage, getResultKey } from "../scripts/storage.js";
import { formatDate } from "./utils.js";
import { getTeamDetails } from "../scripts/api.js";
import { revealSection, showErrorMessage } from "../scripts/renderUI.js";

export function displayData(target, data) {

    if (!Array.isArray(data)) {
        const dataKey = getResultKey(data);

        if (data.identifier == 'standings') {

            if (target == 'standings') {
                displayStandings(data[dataKey]);
            } else {
                displayTopThreeTeams(data[dataKey].slice(0, 3));
            }

        } else if (data.identifier  == 'league_teams') {
            displayLeagueTeams(data[dataKey]);

        } else if (data.identifier  == 'prev_games') {

            let prevGames = data[dataKey].slice(0,10);
            displayPreviousGames(prevGames);

        } else if (data.identifier  == 'games_today') {
            displayCurrentGames(data[dataKey]);
        }
        
    } else {
        // Set data based on identifier
        for (const key in data) {
            const item = data[key];
            const identifier = Object.keys(item)[1];
            const dataKey = Object.keys(item)[0];
    
            if (item[identifier] == 'standings') {
    
                if (target == 'standings') {
                    console.log(item);
                    displayStandings(item[dataKey]);
                } else {
                    displayTopThreeTeams(item[dataKey].slice(0, 3));
                }
    
            } else if (item[identifier] == 'league_teams') {
                displayLeagueTeams(item[dataKey]);
    
            } else if (item[identifier] == 'prev_games') {
    
                let prevGames = item[dataKey].slice(0,10);
                displayPreviousGames(prevGames);
    
            } else if (item[identifier] == 'games_today') {
                displayCurrentGames(item[dataKey]);
            }
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

    if (!data || data.length == 0) {
        showErrorMessage(teamSection, 'No data found...');
        revealSection(teamSection);
        return;   
    }

    standingsTableBody.innerHTML = '';

    data.forEach((teamObject, i) => {

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

    const fetchedLeagueTeams = getDataFromStorage('league_teams');

    if (!leagueTeams || leagueTeams.length == 0 || !fetchedLeagueTeams || fetchedLeagueTeams.length == 0) {
        showErrorMessage(teamSection, 'No teams found...');
        revealSection(teamSection);
        return;
    }

    const objectKey = getResultKey(fetchedLeagueTeams);

    leagueTeams.forEach(leagueTeamObject => {

        // Get team details for better pic
        fetchedLeagueTeams[objectKey].forEach(teamObject => {
            if (leagueTeamObject.idTeam == teamObject.idTeam) {
                const listData = `
                                <li class="card__item">
                                    <img class="team__logo" src="${teamObject.strTeamBadge}" alt="${teamObject.strTeam}">
                                    <div class="card__details">
                                        <h3>${teamObject.strTeam}</h3>
                                        <p class="text__bubble">${leagueTeamObject.intPoints} points</p>
                                    </div>
                                </li>`;
                listItems.push(listData);
            }
        });

    });

    teamListUl.innerHTML = '';

    listItems.forEach((element, key) => {
        teamListUl.innerHTML += element;
    });

    revealSection(teamSection);
    
}

function displayPreviousGames(events) {

    const prevMatchSection = document.querySelector('.js-prev-matches-section');
    const prevMatchList = document.querySelector('.js-prev-matches-list');
    let listItems = [];

    try {

        listItems = events.map(async (eventObject) => {
        
            const fetches = []
        
            fetches.push(await getTeamDetails(eventObject.idHomeTeam));
            fetches.push(await getTeamDetails(eventObject.idAwayTeam));

            let listItem = Promise.all(fetches).then(data => {
                const homeTeam = data[0];
                const awayTeam = data[1];
                const eventDate = formatDate(eventObject.dateEventLocal, 'dd/mm/yyyy');

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

        Promise.all(listItems).then(data => {

            prevMatchList.innerHTML = '';

            data.forEach((element, key) => {
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
    
                data.forEach((element, key) => {
                    matchList.innerHTML += element;
                });

                revealSection(matchSection);
    
            })
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