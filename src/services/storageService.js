// store value in localStorage
const store = ((key, val) => {
    if (!localStorage[key]) {
        localStorage[key] = JSON.stringify(val);
    }
})

// store value in localStorage in array
const storeInArray = ((key, val, maxLength) => {
    return new Promise((resolve, reject) => {
        // if the localStorage doesn't have value under the given key

        if (!localStorage[key]) {
            // convert the value to a string, 
            // and save in the localStorage under the given key
            localStorage[key] = JSON.stringify(val);
            resolve(true);
        } else {
            let storedData = load(key);

            // if the localStorage has a value under the given key
            // and it is an array, return it as it is, 
            // otherwise put it inside an array
            storedData = (Array.isArray(storedData)) ? storedData : [storedData];

            // if the array length is under the maximal allowed value,
            // and the given value doesn't exist in the array
            if (storedData.length < maxLength &&
                storedData.indexOf(val) === -1) {

                // add the given value to the data array
                storedData.push(val);

                // store the updated data in the localStorage ,as a string, under the given key
                localStorage[key] = JSON.stringify(storedData);
                resolve(true);
            }
        }
        reject(false);
    })
})

// load value from localStorage
const load = ((key) => {
    let str = localStorage[key] || null;
    return JSON.parse(str);
})

// delete item from localStorage
const deleteFromStorage = ((key) => {
    localStorage.removeItem(key);
})

// clear all items from localStorage
const clearStorage = (() => {
    localStorage.clear();
})

export default {
    store,
    storeInArray,
    load,
    deleteFromStorage,
    clearStorage
}