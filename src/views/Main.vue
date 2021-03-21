<template>
  <div class="gifs">
    <div class="controls-container">
      <input
        type="text"
        v-model="searchTerm"
        @input="fetchGifs"
        @keyup.enter="fetchGifs"
        @paste="resetData"
        class="search-input"
      />

      <p class="page-number" v-if="gifsOffset >= 0">
        Page Number: {{ gifsOffset + 1 }}
      </p>

      <div class="buttons-container flex space-between">
        <button
          type="button"
          @click="fetchPrevGifs"
          class="btn"
          :disabled="gifsOffset === 0"
        >
          Previous
        </button>

        <button
          type="button"
          @click="fetchNextGifs"
          class="btn btn-sucess"
          :disabled="gifsOffset === gifsTotalCount"
        >
          Next
        </button>
      </div>
    </div>

    <GifsList :gifs="gifs" v-if="!displayMessage" />
    <Message v-if="displayMessage" @closeModal="closeModal" />
  </div>
</template>

<script>
import GifsList from "../components/GifsList";
import Message from "../components/Message";
import { API_KEY, MAX_LENGTH, GIPHY_API_URL } from "@/services/utilService.js";
const axios = require("axios");

export default {
  name: "Main",
  components: {
    GifsList,
    Message,
  },
  data() {
    return {
      gifs: [],
      searchTerm: "",
      gifsOffset: 0,
      gifsTotalCount: 0,
      displayMessage: false
    };
  },
  created() {
    // if the route has a search term parameter 
    if(this.$route.params && this.$route.params.searchedItem) {
      // save the search term
      this.searchTerm = this.$route.params.searchedItem;

      // reset the search term parameter in the current route
      this.$router.replace({ name: 'main', params: { searchedItem: '' } });

      // fetch gifs from the api
      this.fetchGifs();
    }
  },
  methods: {
    closeModal() {
      this.displayMessage = false;
    },
    fetchPrevGifs() {
      if (this.gifsOffset > 0) {
        // decrement the gifs offset until 0
        this.gifsOffset--;

        // fetch gifs from the api
        this.fetchGifs();
      }
    },
    fetchNextGifs() {
      if (this.gifsOffset < this.gifsTotalCount) {

        // increment the gifs offset until the gifs total count
        this.gifsOffset++;

        // fetch gifs from the api
        this.fetchGifs();
      }
    },
    async fetchGifs() {
      try {
        const url = `${GIPHY_API_URL}search?q=${this.searchTerm}&api_key=${API_KEY}&limit=${MAX_LENGTH}&offset=${this.gifsOffset}`;
        
        // get the response from the giphy API
        const response = await axios.get(url);

        // save the gifs total count from the pagination data
        this.gifsTotalCount =
          response.data &&
          response.data.pagination &&
          response.data.pagination.total_count
          ? response.data.pagination.total_count
          : 0;

        // map the gifs data to an array of the gifs sources
        this.buildGifs(response.data);

        // save the last searched term
        this.saveLastSearch();
      } catch (err) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          console.log("Server Error:", err);
        } else if (err.request) {
          // client never received a response, or request never left
          console.log("Network Error:", err);
        } else {
          console.log("Client Error:", err);
        }
      }
    },
    buildGifs(json) {
      // if there is no data in the response,
      // there is a search term 
      // and the giffs offset is under the total gifs count
      if (
        json.data.length === 0 &&
        this.searchTerm &&
        this.gifsOffset <= this.gifsTotalCount) {

        // display error message 
        this.displayMessage = true;
        return;
      }

      // map the gifs data to an array of the gifs sources
      this.gifs = json.data
        .map((gif) => gif.id)
        .map((gifId) => {
          return `https://media.giphy.com/media/${gifId}/giphy.gif`;
        });
    },
    resetData() {
      // reset all the page data
      this.gifs = [];
      this.searchTerm = "";
      this.gifsOffset = 0;
      this.gifsTotalCount = 0;
      this.displayMessage = false;
    },
    saveLastSearch() {
      // if there is no error message and there is a searched term
      if(!this.displayMessage && this.searchTerm) {

        // dispatch an action to save the gif search
        const searchTerm = this.searchTerm;
        this.$store.dispatch({ type: "saveGifSearch", searchTerm });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.gifs {
  height: 100%;
  font-family: cursive;

  .search-input {
    width: 80%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    margin: 0 auto;
    font-family: sweetCheeks;
  }

  .page-number {
    background-color: #8a2be287;
    width: 80%;
    margin: 0 auto;
    padding: 1vw;
    border-radius: 4px;
    font-weight: bold;
  }

  .buttons-container {
    margin: 2vh auto;
    width: 15%;

    @media (max-width: 1200px) {
      width: 30%;
    }

    @media (max-width: 780px) {
      width: 50%;
    }
  }
}
</style>
