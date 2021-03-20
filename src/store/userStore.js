import HttpService from "@/services/httpService.js";

export default {
    state: {
        isAuthenticated: HttpService.getIsAuth()
    },
    mutations: {
        setAuthStatus(state, { isAuthenticated }) {
            state.isAuthenticated = isAuthenticated;
        }
    },
    actions: {
        autoAuthUser(store) {
            const isAuthenticated = true;
            store.commit({type: "setAuthStatus", isAuthenticated});
        },
        login(store, { email, password }) {
            return new Promise((resolve, reject) => {
                HttpService.login(email, password)
                    .then((res) => {
                        const isAuthenticated = true;
                        store.commit({type: "setAuthStatus", isAuthenticated});
                        resolve(true);
                    })
                    .catch((error) => {
                        console.log("error", error);
                        const isAuthenticated = false;
                        store.commit({type: "setAuthStatus", isAuthenticated});
                        reject(false);
                    });
            });
        },
        logout(store) {
            return new Promise((resolve, reject) => {
            HttpService.logout().then((res) => {
                const isAuthenticated = false;
                store.commit({type: "setAuthStatus", isAuthenticated});
                resolve(true);
                
              }).catch((error) => {
                console.log('error', error);
                reject(false);
              });
            });
        }
    },
    getters: {
        userAuthStatus(state) {
            return state.isAuthenticated;
        }
    }
}
