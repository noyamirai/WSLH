
/**
 * 
 * @param {array} data 
 * @param {string} storageKey what kind of data did you fetch? needed when array.length==1
 * @returns 
 */
export function saveDataToStorage(data, storageKey) {

    if (Array.isArray(data) || (typeof data != 'object' && data.length > 0)) {
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

/**
 * Determines which keys are missing from local storage and updates the data object with only already available API endpoints
 * @param {Object} data Object containing API endpoints
 * @returns {Object}
 */
export function checkMissingData(data) {

    let toFetch = [];
    let newData = [];

    for (const key in data) {
        const item = data[key];
        let localStorageKey = localStorage.getItem(item.identifier); 

        if (localStorageKey === null || localStorageKey === undefined || localStorageKey == '' || localStorageKey == 'undefined') {
            delete data[item.identifier];
            toFetch.push(item);
        } else {
            newData.push(item);
        }
    }

    return { 'toFetch': toFetch, 'updatedData': newData };
}

/**
 * Lists all data from local storage based on API endpoint identifiers
 * 
 * @param {Object} data Object containing API endpoints
 * @returns {Array} Data from local storage
 */
export function listAllDataFromStorage(data) {

    let result = [];

    for (const key in data) {
        const item = data[key];
        const jsonData = localStorage.getItem(item.identifier);
        result.push(JSON.parse(jsonData));
    }

    return result;
}

/**
 * Gets specific key from local storage
 * 
 * @param {string} key Object containing API endpoints
 * @returns {*} Data from local storage
 */
export function getDataFromStorage(key) {

    const jsonData = localStorage.getItem(key);
    return JSON.parse(jsonData);

}

/**
 * Returns result key from API data object
 * 
 * @param {Object} dataObject Object containing API results
 * @returns {string} Object key which can be used to retrieve data
 */
export function getResultKey(dataObject) {

    let objectKey;

    for (const key in dataObject) {
        objectKey = Object.keys(dataObject)[0];
    }

    return objectKey;
}