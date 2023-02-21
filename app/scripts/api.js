
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

export function getApiData(query = '') {

    const dataArray = {
        'standings': {
            api: 'thesportsdb',
            apiUrl: 'https://www.thesportsdb.com/api/v1/json/60130162/lookuptable.php',
            params:'?l=4849&s=2022-2023',
            identifier: 'standings'
        },
        'league_teams': {
            api: 'thesportsdb',
            apiUrl: 'https://www.thesportsdb.com/api/v1/json/60130162/search_all_teams.php',
            params: '?l=English_Womens_Super_League',
            identifier: 'league_teams'
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
 * @param {api} urlData.api
 * @param {apiUrl} urlData.apiUrl
 * @param {query} urlData.params
 * 
 * @note in case of livescore api a different header will be sent
 * 
 * @returns api data or throws error <Promise>
 */
export async function singleApiCall(urlData) {

    let options = {};

    if (urlData.api == 'livescore') {
        options = {
            method: 'GET',
            headers: {
            }
        };
    } else {
        options = {
            method: 'GET'
        };
    }

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