import { getDataFromStorage, getResultKey } from "../scripts/storage.js";
import { getCurrentDate } from "./utils.js";

export async function getData(query = '') {

    const apiData = getApiData(query);
    let result;

    // no query provided
    if (query == '' || query.length > 0) {
        result = await performMultipleCalls(apiData);

    // specific query
    } else {
        result = await singleApiCall(apiData);
    }
    
    return result;

}

export async function getTeamDetails(idTeam) {

    // console.log('inside team details');
    const fetchedLeagueTeams = getDataFromStorage('league_teams');

    let result;

    // No fetched teams
    if (fetchedLeagueTeams === null) {

        console.log('NEW FETCH');
        const apiData = getApiData('league_teams');
        const teamData = await singleApiCall(apiData);

        console.log('GOT DATA ');
        // console.log(teamData);

    } else {

        const objectKey = getResultKey(fetchedLeagueTeams);

        fetchedLeagueTeams[objectKey].forEach(teamObject => {
            if (teamObject.idTeam == idTeam) {
                result = teamObject;
            }
        });

    }


    return result;
}

export function getApiData(query = '') {
    
    let currentDate = getCurrentDate(true);

    const dataArray = {
        'standings': {
            apiUrl: 'https://www.thesportsdb.com/api/v1/json/60130162/lookuptable.php',
            params:'?l=4849&s=2022-2023',
            identifier: 'standings'
        },
        'league_teams': {
            apiUrl: 'https://www.thesportsdb.com/api/v1/json/60130162/search_all_teams.php',
            params: '?l=English_Womens_Super_League',
            identifier: 'league_teams'
        },
        'prev_games': {
            apiUrl: 'https://www.thesportsdb.com/api/v1/json/60130162/eventspastleague.php',
            params: '?id=4849',
            identifier: 'prev_games'
        },
        'games_today': {
            apiUrl: 'https://www.thesportsdb.com/api/v1/json/60130162/eventsday.php',
            params: `?d=${currentDate}&l=4849`,
            identifier: 'games_today'
        }
    };

    if (query == '') {
        return dataArray;
    }

    if (query.length > 0) {
        return Object.fromEntries(Object.entries(dataArray).filter(([key, value]) => query.includes(key)));
    }

    return dataArray[query];
}

export async function performMultipleCalls(apiData) {

    const promises = Object.values(apiData).map(async data => {
        return await singleApiCall(data);
    });

    return Promise.all(promises);
}

/**
 * 
 * @param {object} urlData
 * @param {apiUrl} urlData.apiUrl
 * @param {query} urlData.params
 *  
 * @returns api data or throws error <Promise>
 */
export async function singleApiCall(urlData) {

    let options = {};

    try {

        const response = await fetch(`${urlData.apiUrl}${urlData.params}`, options);

        if (response.ok) {
            console.log('RESPONSE OK!!');

            // Convert the response to JavaScript Object
            const data = await response.json();
            data.identifier = urlData.identifier;
            return data;
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
    } catch (error) {
        throw new Error(error);
    }

}