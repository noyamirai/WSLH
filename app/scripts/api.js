import { getDataFromStorage, getResultKey, saveDataToStorage } from "../scripts/storage.js";
import { getCurrentDate } from "./utils.js";

/**
 * This function fetches data from one or more APIs, depending on the query parameter. 
 * If the query is a string (specific target), it performs a single API call
 * If the query consists of multiple targets (Array), it performs multiple API calls and merges the results into a single Array containing objects per call. 
 * 
 * @param {string|array} query A string that determines which APIs to fetch data from. If empty, all APIs will be fetched. 
 * @returns {Promise<Array>} A Promise that resolves with an array of objects containing data from API calls.
 */
export async function fetchData(query = '') {
    // Get API endpoints based on query parameter
    const apiData = getApiUrls(query, true);
    const apiDataKeys = Object.keys(apiData);
    let result;

    // Check if its an object with multiple keys
    if (apiDataKeys.length > 1) {
        result = await performMultipleCalls(apiData);

    // Specific API call
    } else {
        result = await singleApiCall(apiData[query]);
    }

    // Check if the query asks to fetch league_teams
    if (apiDataKeys.length > 0 && apiDataKeys.includes('league_teams')) {

        // Process the results to combine male and female team data
        let teamData = [];

        result.forEach((item) => {
            const dataKey = getResultKey(item);
            
            if (item.identifier == 'male_team_data' || item.identifier == 'league_teams') {

                // Determine whether this is male or female team data and set as key
                const key =  (item.identifier == 'male_team_data' ? 'men' : 'women');
                teamData.push({ [key] : item[dataKey]});
            }
        });

        // Add additional team data (from male teams) to the results
        const updatedLeagueTeams = await addAditionalTeamData(teamData);

        // Update the results to include the new team data
        result.forEach((item, key) => {

            const dataKey = Object.keys(item)[0];
            
            if (item.identifier == 'league_teams') {

                // Update league_teams with the new team data
                result[key][dataKey] = updatedLeagueTeams;

            } else if (item.identifier == 'male_team_data') {

                // Remove male data from the results -> does not need to be saved in storage
                result.splice(key, 1);
            }

        });

    }

    return result;
}

/**
 * Adds additional data to the women's teams based on the names of the men's teams
 * 
 * @param {Array.<Object>} teamData 
 * @returns {Promise<Array>} A Promise that resolves with an array of objects containing additional data for the women's teams.
 */
async function addAditionalTeamData(teamData) {

    teamData.forEach((object, key) => {

        // Make sure to edit in women's team data
        if (object.women) {
            object.women.forEach((womenTeam, wKey) => {
                
                // Index of the object that contains men's team data
                const arrayKey = (key == (teamData.length - 1) ? key-1 : key+1);

                teamData[arrayKey].men.forEach(menTeam => {

                    // Check if the women's team name includes the men's team name
                    const containsSubstring = womenTeam.strTeam.includes(menTeam.strTeam);

                    // If it does, add the men's team short name to the women's team object
                    if (containsSubstring) {
                        teamData[key].women[wKey].strTeamShort = menTeam.strTeamShort;
                    }
                });
            });
            
        }
    });

    // Filter the array to only include women's team data
    const womenData = teamData.filter((item) => {
        if (item.women) {
            return item;
        }
    });

    return womenData[0].women;
}

/**
 *  This function fetches all teams for the WSL, saves it to local storage, and returns the data.
 * @returns {Promise<Array>}
 */
async function fetchLeagueTeams() {
    let result;

     // Define the API endpoint to call
    const apiData = {
        apiUrl: 'https://www.thesportsdb.com/api/v1/json/60130162/search_all_teams.php',
        params: '?l=English_Womens_Super_League',
        identifier: 'league_teams'
    }

    result = await singleApiCall(apiData);

    // Save the data to local storage with key
    saveDataToStorage(result, 'league_teams');

    return result;
}

/**
 * Get details about a team based on a given idTeam
 * 
 * @param {number} idTeam - The ID of the team to fetch details for
 * @param {string|null} target - If specified, it will be fetch additional data about a team
 * @returns {Promise<*>} - The team details, either as an array of objects or a single object
 */
export async function getTeamDetails(idTeam, target = null) {

    let result;
    const fetchedLeagueTeams = getDataFromStorage('league_teams');
    let leagueTeams = fetchedLeagueTeams;

    if (target) {

        // Fetch league teams if not found in storage
        if (fetchedLeagueTeams === null) {
            leagueTeams = await fetchLeagueTeams();
        }

         // Define the API endpoints to call
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

        // Find the object key for the result of the API call (always different)
        const objectKey = getResultKey(leagueTeams);

        leagueTeams[objectKey].forEach(teamObject => {
            if (teamObject.idTeam == idTeam) {
                data.push({ team: teamObject, 'identifier': 'team_details' });
            }
        });

        let squadArray = {};
        
        // Transform the squad array into an object with keys based on player positions
        data.forEach((object, key) => {
            const resultKey = getResultKey(object);

            if (object.identifier == 'team_squad') {
                object[resultKey].forEach(player => {

                    // create position in array
                    if (!squadArray[player.strPosition]) {
                        squadArray[player.strPosition] = [];
                    }

                    squadArray[player.strPosition].push(player);

                });

                data[key][resultKey] = squadArray;
            }
        });

        return data;

    } else {

        // Fetch league teams if not found in storage
        if (fetchedLeagueTeams === null) {
            leagueTeams = await fetchLeagueTeams();
        }

        // Find the object key for the result of the API call (always different)
        const objectKey = getResultKey(leagueTeams);

        // Quickly check if team exists in league teams (in case of foreign team)
        const teamFound = leagueTeams[objectKey].some(function(item) {
            return item.idTeam === idTeam;
        }); 

        if (!teamFound) {

            const apiData = {
                apiUrl: 'https://www.thesportsdb.com/api/v1/json/60130162/lookupteam.php',
                params: `?id=${idTeam}`,
                identifier: 'team_details'
            }

            const data = await singleApiCall(apiData);
            const resultKey = getResultKey(data);

            // Always one team
            // TODO: error handling
            return data[resultKey][0];

        } else {
            leagueTeams[objectKey].forEach(teamObject => {
                if (teamObject.idTeam == idTeam) {
                    result = teamObject;
                }
            });
        }
    }

    return result;
}

/**
 * Handles missing data from local storage by either fetching a single item or 
 * performing multiple API calls to retrieve the data. 
 * 
 * @param {array} missingData - An array of objects containing API endpoints
 * @returns {array|object} - Returns an array of objects or a single object representing the missing data.
 */
export async function handleMissingData (missingData) {
    console.log('DATA MISSING FROM LOCALSTORAGE');
    let newData;

    // If there is only one item of missing data
    if (missingData.length == 1) {
        newData = await fetchData(missingData[0].identifier);

        // Save to storage with key
        saveDataToStorage(newData, missingData[0].identifier);

    } else {
        newData = await performMultipleCalls(missingData);
        saveDataToStorage(newData);
    }

    return newData;
}

/**
 * Returns an object with API endpoints based on a given query or a boolean flag indicating new data should be fetched.
 *
 * @param {string} query - (optional) The key in the data array of the API to retrieve.
 * @param {boolean} newData - (optional) A boolean flag indicating whether to fetch new data or not.
 * @returns {Object} - An object containing the API endpoints.
 */
export function getApiUrls(query = '', newData = false) {
    
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

    // If new data is requested, add an additional API endpoint to fetch male team data.
     if (newData && query.includes('league_teams') || newData && query == 'league_teams' || newData) {
        dataArray.male_team_data = {};
        dataArray.male_team_data.apiUrl = 'https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php'
        dataArray.male_team_data.params =`?l=English%20Premier%20League`
        dataArray.male_team_data.identifier = 'male_team_data';
    }

    // If no query is provided, return the entire dataArray object.
    if (query == '') { 
        return dataArray;
    }

    // If an array of query keys is provided, filter the dataArray object to only include those keys.
    if (typeof query != 'string' && Array.isArray(query)) {
        return Object.fromEntries(Object.entries(dataArray).filter(([key, value]) => query.includes(key)));
    }

    // If new data is requested for the league_teams key, return an object containing both league_teams and male_team_data.
    if (newData && query == 'league_teams') {
        return {[query]: dataArray[query], 'male_team_data': dataArray['male_team_data'] };
    }

    // Otherwise, return an object with only the API URL specified by the query.
    return {[query]: dataArray[query] };
}

/**
 * Takes an object containing API endpoints and performs multiple API calls using the singleApiCall function.
 * @param {Object} apiData
 * @returns {Promise}
 */
export async function performMultipleCalls(apiData) {

    const promises = Object.values(apiData).map(async data => {
        return await singleApiCall(data);
    });

    return Promise.all(promises);
}

/**
 * Makes a single API call using the provided URL data.
 * 
 * @param {object} urlData - The URL data object containing the API URL, parameters, and identifier.
 * @returns {object} The data returned from the API call, with the identifier included.
 * @throws {Error} If there is an HTTP error or if there is an error in processing the response.
 */
export async function singleApiCall(urlData) {

    try {
        
        let url = urlData.apiUrl + urlData.params;
        console.log(urlData.apiUrl);

        const response = await fetch(url);

        if (response.ok) {
            console.log('RESPONSE OK!!');

            // Convert the response to JavaScript Object
            const data = await response.json();

            // Add the identifier to the data object
            data.identifier = urlData.identifier;

            return data;
        } else {
            // If the response is not successful, throw an error with the HTTP status code
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
    } catch (error) {
        // If there is an error in processing the response, throw an error with the message
        throw new Error(error);
    }

}