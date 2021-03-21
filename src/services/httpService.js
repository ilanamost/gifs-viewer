const DEV_BACKEND_URL = "http://localhost:3000";
const PROD_BACKEND_URL = "https://gifs-viewer-backend.herokuapp.com";
const API = "/api";

// define base url and environment for development and production mode
const baseUrl = process.env.NODE_ENV === "development" ? DEV_BACKEND_URL + API : PROD_BACKEND_URL + API;

// define urls for the application
const urls = {
    auth: baseUrl + "/user/"
}

let isAuthenticated = false;
let token = '';
let tokenTimer = null;
const axios = require("axios");
import { NUMBER_OF_MILISECONDS_IN_SECOND, EXPIRATION_KEY, TOKEN_KEY } from "@/services/utilService.js";
import StorageService from "@/services/storageService.js";

// Getters //
const getToken = (() => {
    return token;
});

/**
 * Get authentication status
 */
const getIsAuth = (() => {
    return isAuthenticated;
});

/**
 * Login the user in the server
 * 
 * @param {string}            email                 The users' email
 * @param {string}            password              The users' password
 */
const login = ((email, password) => {
    return new Promise(async (resolve, reject) => {
        const authData = { email: email, password: password };
        try {
            const response = await axios.post(urls.auth + "login", authData);

            // save the response token
            token = response.data.token;

            // if there is a token in the response
            if (token) {
                // get the token's expiration date
                const expiresInDuration = response.data.expiresIn;

                // Create a timer for the token validity
                setAuthTimer(expiresInDuration);

                // set the user status as authenticated
                isAuthenticated = true;

                const now = new Date();

                // calculate the time that remains between now and the token's expiration date
                const expirationDate = new Date(now.getTime() + expiresInDuration * NUMBER_OF_MILISECONDS_IN_SECOND);

                // Save the authentication data in the localStorage without the user name
                _saveAuthData(token, expirationDate);

            }
            resolve({ isAuthenticated: true });

        } catch (err) {
            isAuthenticated = false;
            reject(err);
        }
    });
});

/**
 * Create a new user in the server
 * 
 * @param {string}            email                 The users' email
 * @param {string}            password              The users' password
 * @param {string}            userName              The users' user name
 */
const signup = ((userName, email, password) => {
    return new Promise(async (resolve, reject) => {
        const authData = { email: email, password: password, userName: userName };
        try {
            const response = await axios.post(urls.auth + "signup", authData);
            resolve({ isAuthenticated: true });

        } catch (err) {
            isAuthenticated = false;
            reject({ isAuthenticated: false, message: err });
        }
    });
});

/**
 * Create a timer for the token validity, and logout the user when it finishes
 * 
 * @param {number}            duration              The amount of time the token is valid 
 */
const setAuthTimer = ((duration) => {
    tokenTimer = setTimeout(() => {
        logout();
    }, duration * NUMBER_OF_MILISECONDS_IN_SECOND);
});

/**
 * Save the authentication data in the localStorage
 * 
 * @param {string}            token                 The application token
 * @param {Date}              expirationDate        The token's expiration date
 */
const _saveAuthData = ((token, expirationDate) => {
    StorageService.store(TOKEN_KEY, token);
    // save the expiration date in ISO format: 2011-10-05T14:48:00.000Z
    StorageService.store(EXPIRATION_KEY, expirationDate.toISOString());
});


/**
 * Logout the user
 */
const logout = (() => {
    return new Promise((resolve, reject) => {
        // reset the token and the authentication status
        token = null;
        isAuthenticated = false;

        // cancel the token timer
        clearTimeout(tokenTimer);

        // remove all data from the localStorage
        StorageService.clearStorage();

        resolve({ isAuthenticated: false });
    });
});

/**
 * Automatically authenticate the user if he has a valid token
 */
const autoAuthUser = (() => {
    // Get the current users' authentication data
    const authInformation = getAuthData();

    // if there is no data, return from the function
    if (!authInformation) {
        return;
    }

    const now = new Date();

    // calculate the time that remains between now and the token's expiration date
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    // if the remaining time is above zero seconds
    // the token is not yet expired
    if (expiresIn > 0) {
        // save the token
        token = authInformation.token;

        // set the user status as authenticated
        isAuthenticated = true;

        // create a timer for the token validity
        setAuthTimer(expiresIn / NUMBER_OF_MILISECONDS_IN_SECOND);
    }
});

/**
* Get the current users' authentication data
*/
const getAuthData = (() => {
    // get the authentication data from the localStorage
    const token = localStorage.getItem(TOKEN_KEY);
    const expirationDate = localStorage.getItem(EXPIRATION_KEY);

    // if there is no token or expiration date, 
    // return from the function
    if (!token || !expirationDate) {
        return;
    }

    // return the authentication data
    return {
        token: token,
        expirationDate: new Date(expirationDate)
    }
    
});

export default {
    login,
    signup,
    logout,
    autoAuthUser,
    getToken,
    getIsAuth
}