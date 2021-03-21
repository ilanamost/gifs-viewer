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
    if(this.$route.params && this.$route.params.searchedItem) {
      this.searchTerm = this.$route.params.searchedItem;
      this.$router.replace({ name: 'main', params: { searchedItem: '' } });
      this.fetchGifs();
    }
  },
  methods: {
    closeModal() {
      this.displayMessage = false;
    },
    fetchPrevGifs() {
      if (this.gifsOffset > 0) {
        this.gifsOffset--;
        this.fetchGifs();
      }
    },
    fetchNextGifs() {
      if (this.gifsOffset < this.gifsTotalCount) {
        this.gifsOffset++;
        this.fetchGifs();
      }
    },
    async fetchGifs() {
      try {
        const url = `${GIPHY_API_URL}search?q=${this.searchTerm}&api_key=${API_KEY}&limit=${MAX_LENGTH}&offset=${this.gifsOffset}`;
        const response = await axios.get(url);

        this.gifsTotalCount =
          response.data &&
          response.data.pagination &&
          response.data.pagination.total_count
          ? response.data.pagination.total_count
          : 0;

        this.buildGifs(response.data);
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
      if (
        json.data.length === 0 &&
        this.searchTerm &&
        this.gifsOffset <= this.gifsTotalCount) {
        this.displayMessage = true;
      }

      this.gifs = json.data
        .map((gif) => gif.id)
        .map((gifId) => {
          return `https://media.giphy.com/media/${gifId}/giphy.gif`;
        });
    },
    resetData() {
      this.gifs = [];
      this.searchTerm = "";
      this.gifsOffset = 0;
      this.gifsTotalCount = 0;
      this.displayMessage = false;
    },
    saveLastSearch() {
      if(!this.displayMessage && this.searchTerm) {
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
