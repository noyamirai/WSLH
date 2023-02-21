import { getCurrentDate } from "./utils.js";
import { getData, getApiData, performMultipleCalls, singleApiCall } from './api.js';
import { displayData } from "./dataHandling.js";
import { saveDataToStorage, checkMissingData, listAllDataFromStorage, getDataFromStorage } from "./storage.js";

const sections = document.querySelectorAll('section');

document.addEventListener('DOMContentLoaded', () => {

    let lastUpdated = localStorage.getItem("lastUpdated"); 
    let currentDate = getCurrentDate();

    routie({
        '': function() {
            console.log('DEFAULT');
            initialCall('home', lastUpdated, currentDate);
        },
        'home': function() {
            console.log('HOME PAGE');
            const toFetch = ['league_teams', 'standings', 'prev_games', 'games_today'];

            initialCall('home', lastUpdated, currentDate, toFetch);
        },
        'standings': function() {
            console.log('STANDINGS PAGE');
            console.log('FETCH: standings');   
            
            initialCall('standings', lastUpdated, currentDate, 'standings');     
        }
    });

});

window.addEventListener("load", event => {
    const sections = document.querySelectorAll('section');

    sections.forEach((section) => {
        const images = section.querySelectorAll('img');
        // let loaded = [];
        let loadStatus = [];
        
        images.forEach((image)=> {
            let isLoaded = image.complete && image.naturalHeight !== 0;

            if (isLoaded) {
                loadStatus.push(isLoaded);
            }
        });

        if (loadStatus.length == images.length) {
            const contentContainer = section.querySelector('.js-content');

            section.querySelector('.loader').classList.add('hide');

            if (contentContainer) {
                contentContainer.classList.remove('hide');
            }
                
        }
    });
});

function initialCall(target, lastUpdated, currentDate, query = '') {

    // If never been updated -> fetch data
    if (lastUpdated === null) {
        console.log('FETCH DATA AND SET LASTUPDATED KEY TO NOW');

        saveAndDisplayData(target, query, true);

        localStorage.setItem('lastUpdated', currentDate);

    // User has fetched data before
    } else {

        // SOURCE: chat.openai.com/chat
        const lastUpdatedDate = new Date(lastUpdated.split('/').reverse().join('/'));
        currentDate = new Date(currentDate.split('/').reverse().join('/'));

        // Last updated in the past -> fetch new data
        // TODO: fetch on standings every time
        if (currentDate > lastUpdatedDate) {
            console.log('fetched data is outdated!');

            saveAndDisplayData(target, query, true);
            localStorage.setItem('lastUpdated', currentDate);

        // Last updated today -> get data from localstorage
        } else {
            console.log('data is still fresh');
            saveAndDisplayData(target, query, false);
        }
    }
}

/**
 * 
 * @param {string} query what kind of data are you fetching
 * @param {boolean} needsNewData
 */
async function saveAndDisplayData(target, query = '', needsNewData = false) {

    try {

        let result;
        let data;

        // Check whether or not it requires brand new data
        if (needsNewData) {
            console.log('NEEDS NEW DATA');
            data = await getData(query);

            if (query == '' || query.length > 0) {
                saveDataToStorage(data);
                result = data;

            } else {
                saveDataToStorage(data, query);
                result = [data];
            }
            
        // User still has fresh data -> read from localstorage
        } else {

            console.log('GET DATA FROM LOCALSTORAGE');
            let urlData = getApiData(query);

            result = [];

            // Save which keys are missing from storage (aka data no longer saved, need new data again)
            let missingData = checkMissingData(urlData);

            urlData = missingData.updatedData;
            missingData = missingData.toFetch;
            
            const hasUrlData = Object.keys(urlData).length > 0;

            if (hasUrlData) {

                // Get all available data saved in localstorage
                if (query == '' || query.length > 0) {
                    result = listAllDataFromStorage(urlData);
                    
                // Get specific key data from localstorage
                } else {
                    result = getDataFromStorage(query);
                }
            }

            // Remaining data to fetch (new data)
            if (missingData.length > 0) {
                console.log('DATA MISSING FROM LOCALSTORAGE');
                let newData;

                if (missingData.length == 1) {
                    newData = await singleApiCall(missingData[0]);
                    saveDataToStorage(newData, missingData[0].identifier);

                    result.push(newData);

                } else {
                    newData = await performMultipleCalls(missingData);
                    saveDataToStorage(newData);

                    result = newData;
                }

            }
        }

        console.log('DATA TO WORK WITH:');
        console.log(result);

        displayData(target, result);
        
    // TODO: error handling
    } catch (error) {
        console.log('WEE WEOO WEE WOO');
        console.log(error);
    }

}
