import HttpService from "@/services/httpService";

// CONSTANTS //
export const PASSWORD_VALIDATOR = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{8,}$/;
export const EMAIL_VALIDATOR =
    /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
export const NUMBER_OF_MILISECONDS_IN_SECOND = 1000;
export const SEARCHES_KEY = "searches_key";
export const MAX_LENGTH = 10;

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

