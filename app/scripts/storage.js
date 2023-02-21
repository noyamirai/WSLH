
/**
 * 
 * @param {array} data 
 * @param {string} storageKey what kind of data did you fetch? needed when array.length==1
 * @returns 
 */
export function saveDataToStorage(data, storageKey) {

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

export function checkMissingData(data) {

    let result = [];

    for (const key in data) {
        const item = data[key];
        let localStorageKey = localStorage.getItem(item.identifier); 

        if (localStorageKey === null || localStorageKey === undefined || localStorageKey == '' || localStorageKey == 'undefined') {
            delete data[item.identifier];
            result.push(item);
        }
    }

    return { 'toFetch': result, 'updatedData': data };
}

export function listAllDataFromStorage(data) {

    let result = [];

    for (const key in data) {
        const item = data[key];
        const jsonData = localStorage.getItem(item.identifier);
        result.push(JSON.parse(jsonData));
    }

    return result;
}

export function getDataFromStorage(key) {

    const jsonData = localStorage.getItem(key);
    return JSON.parse(jsonData);

}

export function getResultKey(dataObject) {

    let objectKey;

    for (const key in dataObject) {
        objectKey = Object.keys(dataObject)[0];
    }

    return objectKey;
}