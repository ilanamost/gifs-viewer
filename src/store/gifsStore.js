import StorageService from "@/services/storageService.js";
import { SEARCHES_KEY, MAX_LENGTH } from "@/services/utilService.js";

export default {
    state: {
        searchedGifs: StorageService.load(SEARCHES_KEY) || []
    },
    mutations: {
        saveGifSearch(state, { searchTerm }) {
           state.searchedGifs.push(searchTerm);
        },
        clearGifs(state) {
           state.searchedGifs = [];
        }
    },
    actions: {
        saveGifSearch(store, { searchTerm }) {
            StorageService.storeInArray(SEARCHES_KEY, searchTerm, MAX_LENGTH).then((res) => {
                store.commit({ type: "saveGifSearch", searchTerm });
            }).catch((error) => {});
        },
        clearGifs(store) {
            store.commit({ type: "clearGifs" });
        }
    },
    getters: {
        lastUserSearches(state) {
            return state.searchedGifs;
        }
    }
}
