<template>
  <div id="nav">
    <router-link to="/" v-if="isUserAuthenticated"> Main </router-link>
    <router-link to="/gifs-history" v-if="isUserAuthenticated">
      History
    </router-link>
    <router-link to="/login" v-if="!isUserAuthenticated"> Login / Signup </router-link>
    <router-link to="/login" @click="onLogout" v-if="isUserAuthenticated">
      Logout
    </router-link>
  </div>
  <router-view />
</template>

<script>
import HttpService from "@/services/httpService.js";

export default {
  name: "App",
  created() {
    HttpService.autoAuthUser();
    this.$store.dispatch({ type: "autoAuthUser" });
  },
  methods: {
    onLogout() {
      this.$store
        .dispatch({ type: "logout" })
        .then(() => {
          this.$store.dispatch({ type: "clearGifs" });
          this.$store.dispatch({ type: "clearAuthStatus" });
          // navigate to the login page
          this.$router.replace("/login");
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  },
  computed: {
    isUserAuthenticated() {
      return this.$store.getters.userAuthStatus;
    },
  },
};
</script>

<style lang="scss">
@import "./styles/main.scss";
#app {
  text-align: center;
  color: $appFontColor;
  height: 100%;
  font-family: cursive;
}

#nav {
  padding: 30px;
  background-color: #8a2be287;
  margin-bottom: 7vh;

  a {
    font-weight: bold;
    color: #2c3e50;
    margin: 0 2vw;

    &.router-link-exact-active {
      color: #6f16c2;
    }

    &:hover {
      color: #110f1d;
    }
  }
}

body {
  height: 100%;
  margin: 0;
}
</style>
