document.addEventListener('DOMContentLoaded', () => {

    let lastUpdated = localStorage.getItem("lastUpdated"); 
    let currentDate = getDate();

    // If never been updated -> fetch data
    if (lastUpdated === null) {
        console.log('FETCH DATA AND SET LASTUPDATED KEY TO NOW');

        saveAndDisplayData('', true);

        localStorage.setItem('lastUpdated', currentDate);

    // User has fetched data before
    } else {

        // SOURCE: chat.openai.com/chat
        const lastUpdatedDate = new Date(lastUpdated.split('/').reverse().join('/'));
        currentDate = new Date(currentDate.split('/').reverse().join('/'));

        // Last updated in the past -> fetch new data
        if (lastUpdatedDate > currentDate) {
            console.log('fetched data is outdated!');

        // Last updated today -> get data from localstorage
        } else {
            console.log('data is still fresh');
            saveAndDisplayData('', false);
        }
    }

});

/**
 * 
 * @param {string} query what kind of data are you fetching
 * @param {boolean} needsNewData
 */
async function saveAndDisplayData(query = '', needsNewData = false) {

    try {

        let result;
        let data;

        // Check whether or not it requires brand new data
        if (needsNewData) {
            console.log('NEEDS NEW DATA');
            data = await getData(query);

            if (query == '') {
                saveDataToStorage(data);
                result = data;

            } else {
                saveDataToStorage(data, query);
                result = [data];
            }
            
        // User still has fresh data -> read from localstorage
        } else {

            console.log('GET DATA FROM LOCALSTORAGE');
            const urlData = getApiData(query);
            result = [];

            let toFetch = [];

            // Save which keys are missing from storage (aka data no longer saved, need new data again)
            for (const key in urlData) {
                const item = urlData[key];
                let localStorageKey = localStorage.getItem(item.identifier); 

                if (localStorageKey === null || localStorageKey === undefined || localStorageKey == '' || localStorageKey == 'undefined') {
                    delete urlData[item.identifier];
                    toFetch.push(item);
                }
            }

            // Get all available data saved in localstorage
            if (query == '') {

                for (const key in urlData) {
                    const item = urlData[key];
                    const jsonData = localStorage.getItem(item.identifier);
                    result.push(JSON.parse(jsonData));
                }
                
            // Get specific key data from localstorage
            } else {
                const jsonData = localStorage.getItem(query);
                result.push(JSON.parse(jsonData));
            }

            // Remaining data to fetch (new data)
            if (toFetch.length > 0) {
                console.log('DATA MISSING FROM LOCALSTORAGE');
                let newData;

                if (toFetch.length == 1) {
                    newData = await singleApiCall(toFetch[0]);
                    saveDataToStorage(newData, toFetch[0].identifier);

                } else {
                    newData = await performMultipleCalls(toFetch);
                    saveDataToStorage(newData);
                }

                result.push(newData);
            }

        }

        console.log('DATA TO WORK WITH:');
        console.log(result);

        displayData(result);
        
    // TODO: error handling
    } catch (error) {
        console.log('WEE WEOO WEE WOO');
        console.log(error);
    }

}

function displayData(data) {
    // Set data based on identifier
    for (const key in data) {
        const item = data[key];
        const identifier = Object.keys(item)[1];
        const apiData = Object.keys(item)[0];

        if (item[identifier] == 'standings') {
            displayStandings(item, apiData);
        } else if (item[identifier] == 'league_teams') {
            displayLeagueTeams(item, apiData);
        }
    }
}

/**
 * 
 * @param {array} data 
 * @param {string} storageKey what kind of data did you fetch? needed when array.length==1
 * @returns 
 */
function saveDataToStorage(data, storageKey) {

    if (data.length > 0) {
        data.forEach((dataObject, key) => {
            const jsonData = JSON.stringify(data[key]);
            localStorage.setItem(dataObject.identifier, jsonData);
        });
    } else {
        const jsonData = JSON.stringify(data);
        localStorage.setItem(storageKey, jsonData);
    }

    return;
}

async function getData(query = '') {

    const apiData = getApiData(query);
    let result;

    // no query provided
    if (query == '') {
        result = await performMultipleCalls(apiData);

    // specific query
    } else {
        result = await singleApiCall(apiData);
    }
    
    return result;

}

function getApiData(query = '') {

    const dataArray = {
        'standings': {
            api: 'thesportsdb',
            apiUrl: 'https://www.thesportsdb.com/api/v1/json/3/lookuptable.php',
            params:'?l=4849&s=2022-2023',
            identifier: 'standings'
        },
        // 'standings': {
        //     api: 'livescore',
        //     apiUrl: 'https://livescore6.p.rapidapi.com/leagues/v2/',
        //     params:'search_all_teams.php?l=English_Womens_Super_League'
        // },
        'league_teams': {
            api: 'thesportsdb',
            apiUrl: 'https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php',
            params: '?l=English_Womens_Super_League',
            identifier: 'league_teams'
        }
    };

    if (query == '') {
        return dataArray;
    }

    return dataArray[query];
}

async function performMultipleCalls(apiData) {

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
async function singleApiCall(urlData) {

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

function displayStandings (data, key) {

    const standingsTableBody = document.querySelector('.js-standings-body');

    data[key].forEach((teamObject) => {

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
    }); 

}

function displayLeagueTeams (data, key) {


    const teamListUl = document.querySelector('.js-teamlist');
    let listItems = [];

    data[key].forEach((teamObject) => {
        const listData = `<li class="teamlist__item"><img src="${teamObject.strTeamBadge}" alt="${teamObject.strTeam}"></li>`;
        listItems.push(listData);
    }); 

    // TODO: load badges from root instead of extern?
    
    // setTimeout(() => {
        document.querySelector('.teamlist__item--load').remove();

        listItems.forEach((element, key) => {
            teamListUl.innerHTML += element;
        });
        
    // }, 500);

}

// SOURCE: somewhere from the depths of stackoverflow
function getDate () {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = dd + '/' + mm + '/' + yyyy;

    return formattedToday;
}
