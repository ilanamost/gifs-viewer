import HttpService from "@/services/httpService.js";

export default {
    state: {
        // get the users' authentication status from the http service
        isAuthenticated: HttpService.getIsAuth()
    },
    mutations: {
        setAuthStatus(state, { isAuthenticated }) {
            // change the user authentication status
            state.isAuthenticated = isAuthenticated;
        }
    },
    actions: {
        autoAuthUser(store) {
            // commit the change in the user state to set the user as authenticated
            const isAuthenticated = true;
            store.commit({type: "setAuthStatus", isAuthenticated});
        },
        login(store, { email, password }) {
            return new Promise((resolve, reject) => {
                // login the user 
                HttpService.login(email, password)
                    .then((res) => {
                        // commit the change in the user state to set the user as authenticated
                        const isAuthenticated = true;
                        store.commit({type: "setAuthStatus", isAuthenticated});
                        resolve(true);
                    })
                    .catch((error) => {
                        console.log("error", error);

                        // commit the change in the user state to set the user as NOT authenticated
                        const isAuthenticated = false;
                        store.commit({type: "setAuthStatus", isAuthenticated});
                        reject(false);
                    });
            });
        },
        logout(store) {
            return new Promise((resolve, reject) => {
            HttpService.logout().then((res) => {
                // commit the change in the user state to set the user as NOT authenticated
                const isAuthenticated = false;
                store.commit({type: "setAuthStatus", isAuthenticated});
                resolve(true);
                
              }).catch((error) => {
                console.log('error', error);
                reject(false);
              });
            });
        },
        clearAuthStatus(store) {
            // commit the change in the user state to set the user as NOT authenticated
            const isAuthenticated = false;
            store.commit({type: "setAuthStatus", isAuthenticated});
        }
    },
    getters: {
        userAuthStatus(state) {
            // return the users' authentication status 
            return state.isAuthenticated;
        }
    }
}
