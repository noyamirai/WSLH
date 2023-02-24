import { getDataFromStorage, getResultKey } from "../scripts/storage.js";
import { getCurrentDate } from "./utils.js";

export async function getData(query = '') {

    const apiData = getApiData(query, null, true);
    let result;


    // no query provided
    if (query == '' || query.length > 0) {
        result = await performMultipleCalls(apiData);

    // specific query
    } else {
        result = await singleApiCall(apiData);
    }

    if (query == 'league_teams' || query.includes('league_teams') || query == '') {

        let teamData = [];

        result.forEach((item) => {
            const dataKey = Object.keys(item)[0];
            
            if (item.identifier == 'male_team_data' || item.identifier == 'league_teams') {
                const key =  (item.identifier == 'male_team_data' ? 'men' : 'women');
                teamData.push({ [key] : item[dataKey]});
            }
        });

        const updatedLeagueTeams = await addAditionalData(teamData);

        result.forEach((item, key) => {

            const dataKey = Object.keys(item)[0];
            
            if (item.identifier == 'league_teams') {
                result[key][dataKey] = updatedLeagueTeams;
            } else if (item.identifier == 'male_team_data') {
                result.splice(key, 1);
            }

        });

    }

    return result;

}

async function addAditionalData(teamData) {

    teamData.forEach((object, key) => {

        if (object.women) {
            object.women.forEach((womenTeam, wKey) => {
                
                const arrayKey = (key == (teamData.length - 1) ? key-1 : key+1);

                teamData[arrayKey].men.forEach(menTeam => {
                    const containsSubstring = womenTeam.strTeam.includes(menTeam.strTeam);

                    if (containsSubstring) {
                        teamData[key].women[wKey].strTeamShort = menTeam.strTeamShort;
                    }
                });
            });
            
        }
    });

    const womenData = teamData.filter((item) => {
        if (item.women) {
            return item;
        }
    });

    return womenData[0].women;
}

export async function getTeamDetails(idTeam, target = null) {

    let result;
    const fetchedLeagueTeams = getDataFromStorage('league_teams');
    const objectKey = getResultKey(fetchedLeagueTeams);

    // No fetched teams
    if (target) {

        try {

            const apiData = {
                'prev_games_by_team': {
                    apiUrl: 'https://www.thesportsdb.com/api/v1/json/60130162/eventslast.php',
                    params: `?id=${idTeam}`,
                    identifier: 'prev_games_by_team'
                },
                'next_games_by_team': {
                    apiUrl: 'https://www.thesportsdb.com/api/v1/json/60130162/eventsnext.php',
                    params: `?id=${idTeam}`,
                    identifier: 'next_games_by_team'
                },
                'team_squad': {
                    apiUrl: 'https://www.thesportsdb.com/api/v1/json/60130162/lookup_all_players.php',
                    params: `?id=${idTeam}`,
                    identifier: 'team_squad'
                }
            }

            const data = await performMultipleCalls(apiData);

            fetchedLeagueTeams[objectKey].forEach(teamObject => {
                if (teamObject.idTeam == idTeam) {
                    data.push({ team: teamObject, 'identifier': 'team_details' });
                }
            });


            console.log(data);
            let squadArray = {};
            
            data.forEach((object, key) => {
                const resultKey = getResultKey(object);

                if (object.identifier == 'team_squad') {
                    object[resultKey].forEach(player => {

                        if (squadArray[player.strPosition]) {
                            squadArray[player.strPosition].push(player);
                        // create position in array
                        } else {
                            squadArray[player.strPosition] = [];
                            squadArray[player.strPosition].push(player);
                        }

                    });

                    data[key][resultKey] = squadArray;
                }
            });

            return data;
            
        } catch (error) {
            console.log('ERROR???');
            console.log(error);
        }
        

    } else {


        const teamFound = fetchedLeagueTeams[objectKey].some(function(item) {
            return item.idTeam === idTeam;
        }); 

        if (!teamFound) {
            console.log('fetch team');

            const apiData = {
                apiUrl: 'https://www.thesportsdb.com/api/v1/json/60130162/lookupteam.php',
                params: `?id=${idTeam}`,
                identifier: 'team_details'
            }

            const data = await singleApiCall(apiData);
            const resultKey = getResultKey(data);

            return data[resultKey][0];

        } else {
            fetchedLeagueTeams[objectKey].forEach(teamObject => {
                if (teamObject.idTeam == idTeam) {
                    result = teamObject;
                }
            });
        }
        
    }


    return result;
}

export function getApiData(query = '', args = '', newData = false) {
    
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
        if (newData || newData && query == 'league_teams') {
            dataArray.male_team_data = {};
            dataArray.male_team_data.apiUrl = 'https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php'
            dataArray.male_team_data.params =`?l=English%20Premier%20League`
            dataArray.male_team_data.identifier = 'male_team_data';
        }

        return dataArray;
    }

    if (typeof query != 'string' && Array.isArray(query)) {

        if (newData || newData && query.includes('league_teams')) {
            dataArray.male_team_data = {};
            dataArray.male_team_data.apiUrl = 'https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php'
            dataArray.male_team_data.params =`?l=English%20Premier%20League`
            dataArray.male_team_data.identifier = 'male_team_data';
        }
    
        return Object.fromEntries(Object.entries(dataArray).filter(([key, value]) => query.includes(key)));
    }

    return {[query]: dataArray[query] };
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

        let url = urlData.apiUrl + urlData.params;

        const response = await fetch(url, options);

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