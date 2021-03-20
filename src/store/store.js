import { createStore } from 'vuex';
import userStore from "@/store/userStore.js";
import gifsStore from "@/store/gifsStore.js";

export const store = createStore({
  strict: true,
  state: {},

  mutations: {},

  actions: {},

  getters: {},

  modules: {
    userStore,
    gifsStore
  }
})


