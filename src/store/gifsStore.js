import StorageService from "@/services/storageService.js";
import { SEARCHES_KEY, MAX_LENGTH } from "@/services/utilService.js";

export default {
    state: {
        // load the initial value for the searched gifs from the localStorage
        searchedGifs: StorageService.load(SEARCHES_KEY) || []
    },
    mutations: {
        saveGifSearch(state, { searchTerm }) {
           // add the given searched term to the stores' state
           state.searchedGifs.push(searchTerm);
        },
        clearGifs(state) {
           // clear all searched gifs values in the stores' state
           state.searchedGifs = [];
        }
    },
    actions: {
        saveGifSearch(store, { searchTerm }) {
            // store the current searched term in the localStorage
            StorageService.storeInArray(SEARCHES_KEY, searchTerm, MAX_LENGTH).then((res) => {

                // the searched term was stored successfully,
                // commit the current searched term to the store
                store.commit({ type: "saveGifSearch", searchTerm });
            }).catch((error) => {});
        },
        clearGifs(store) {
            // commit the store to clear all searched gifs values
            store.commit({ type: "clearGifs" });
        }
    },
    getters: {
        lastUserSearches(state) {
            // return the last searched gifs
            return state.searchedGifs;
        }
    }
}
