document.addEventListener('DOMContentLoaded', () => {

    // localStorage.removeItem('lastUpdated');
    // localStorage.removeItem('league_teams');
    // localStorage.removeItem('standings');

    let lastUpdated = localStorage.getItem("lastUpdated"); 
    let currentDate = getDate();

    // If never been updated -> fetch data
    if (lastUpdated === null) {
        console.log('FETCH DATA AND SET LASTUPDATED KEY TO NOW');

        // apiCall('league_teams');
        // saveAndDisplayData();

        // localStorage.setItem('lastUpdated', currentDate);

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

            const jsonData = localStorage.getItem('league_teams');
            const data = JSON.parse(jsonData);
            console.log(data);
        }
    }

});

async function saveAndDisplayData(query = '') {

    try {

        let result;
        const data = await getData(query);
        console.log('DATA!!!!');

        // Save to localstorage
        if (query == '') {

            console.log('multiple');

            // Save data in localstorage
            // data.forEach((dataObject, key) => {
            //     const jsonData = JSON.stringify(data[key]);
            //     localStorage.setItem(dataObject.identifier, jsonData);
            // });

            result = data;

        } else {

            result = [data];
            
            console.log('single');

            // const jsonData = JSON.stringify(data);
            // localStorage.setItem(query, jsonData);

        }

        // TODO: display data!
        console.log(result);
        
    // TODO: error handling
    } catch (error) {
        console.log('WEE WEOO WEE WOO');
    }

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

async function performMultipleCalls(apiData) {

    const promises = Object.values(apiData).map(async data => {
        return await singleApiCall(data);
    });

    return Promise.all(promises);
}

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
            return data;
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
    } catch (error) {
        throw new Error(error);
    }

}


function getApiData(query = '') {

    const dataArray = {
        'standings': {
            api: 'thesportsdb',
            apiUrl: 'https://www.thesportsdb.com/api/v1/json/3/',
            params:'lookuptable.php?l=4849&s=2022-2023',
            identifier: 'standings'
        },
        // 'standings': {
        //     api: 'livescore',
        //     apiUrl: 'https://livescore6.p.rapidapi.com/leagues/v2/',
        //     params:'search_all_teams.php?l=English_Womens_Super_League'
        // },
        'league_teams': {
            api: 'thesportsdb',
            apiUrl: 'https://www.thesportsdb.com/api/v1/json/3/',
            params: 'search_all_teams.php?l=English_Womens_Super_League',
            identifier: 'league_teams'
        }
    };

    if (query == '') {
        return dataArray;
    }

    return dataArray[query];
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
