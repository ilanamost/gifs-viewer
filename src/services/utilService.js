import HttpService from "@/services/httpService";

// CONSTANTS //
export const PASSWORD_VALIDATOR = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{8,}$/;
export const EMAIL_VALIDATOR = /\S+@\S+\.\S+/;
export const NUMBER_OF_MILISECONDS_IN_SECOND = 1000;
export const SEARCHES_KEY = "searches_key";
export const MAX_LENGTH = 10;
export const API_KEY = "k6NkccErMkT4yZyDItzzYusqjYvk7bDi";
export const GIPHY_API_URL = "https://api.giphy.com/v1/gifs/";
export const TOKEN_KEY = "token";
export const EXPIRATION_KEY = "expiration";
export const LOADER_TIMEOUT = 1000;

/**
* Move the user the a different route
*/
const moveToRoute = next => {
  // if user is logged in
  if (HttpService.getIsAuth()) {
    // move him to the next route
    next(true);
  } else {
    // if not, move him to login
    next({
      path: "/login"
    });
  }
};

export default {
  moveToRoute
}