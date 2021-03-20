// store value in localStorage
const store = ((key, val) => {
    if (!localStorage[key]) {
        localStorage[key] = JSON.stringify(val);
    }
})

// store value in localStorage in array
const storeInArray = ((key, val, maxLength) => {
    return new Promise((resolve, reject) => {
        if (!localStorage[key]) {
            localStorage[key] = [JSON.stringify(val)];
            resolve(true);
        } else {
            let storedData = load(key);
            storedData = (Array.isArray(storedData)) ? storedData : [storedData];
            if (storedData.length < maxLength &&
                storedData.indexOf(val) === -1) {
                storedData.push(val);
                localStorage[key] = [JSON.stringify(storedData)];
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