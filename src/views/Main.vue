<template>
  <div class="gifs">
    <div class="controls-container">
      <input
        type="text"
        v-model="searchTerm"
        @input="disableButtons"
        @paste="resetData"
        class="search-input"
      />

      <button
        type="button"
        class="btn search-btn"
        @click="changePage(true)"
        :disabled="!searchTerm || isLoading"
      >
        <span class="btn-text"> Go </span>
      </button>

      <p class="page-number" v-if="gifsOffset >= 0 && gifsTotalCount > 0">
        Page Number: {{ Number(pageNumber) }} / {{ Number(totalPages) }}
      </p>

      <div class="buttons-container flex space-between">
        <button
          type="button"
          @click="fetchPrevGifs"
          class="btn"
          :disabled="disablePaginationButtons || pageNumber === 1"
        >
          Previous
        </button>

        <button
          type="button"
          @click="fetchNextGifs"
          class="btn btn-sucess"
          :disabled="
            pageNumber === totalPages ||
            gifsTotalCount === 0 ||
            disablePaginationButtons
          "
        >
          Next
        </button>
      </div>
    </div>

    <GifsList :gifs="gifs" v-if="!displayMessage" />
    <Message v-if="displayMessage" @closeModal="closeModal" />
    <Loader v-if="isLoading" />
  </div>
</template>

<script>
import GifsList from "@/components/GifsList";
import Message from "@/components/Message";
import Loader from "@/components/Loader";
import {
  API_KEY,
  MAX_LENGTH,
  GIPHY_API_URL,
  LOADER_TIMEOUT,
  FIRST_PAGE_OFFSET,
  FIRST_PAGE_NUMBER,
} from "@/services/utilService.js";
const axios = require("axios");

export default {
  name: "Main",
  components: {
    GifsList,
    Message,
    Loader,
  },
  data() {
    return {
      gifs: [],
      searchTerm: "",
      gifsOffset: FIRST_PAGE_OFFSET,
      gifsTotalCount: 0,
      displayMessage: false,
      isLoading: false,
      disablePaginationButtons: false,
      pageNumber: FIRST_PAGE_NUMBER,
      totalPages: 0,
    };
  },
  watch: {
    $route(to, from) {
      // if the route has a page number
      if (this.$route.params && this.$route.params.pageNumber) {
        // save the page number
        this.pageNumber = Number(this.$route.params.pageNumber);
      }

      this.fetchGifsForSearchTerm();
    },
  },
  created() {
    this.fetchGifsForSearchTerm();
  },
  methods: {
    fetchGifsForSearchTerm() {
      // if the route has a search term parameter
      if (this.$route.params && this.$route.params.searchedItem) {
        // save the search term
        this.searchTerm = this.$route.params.searchedItem;

        // fetch gifs from the api
        this.fetchGifs();
      }
    },
    changePage(isFromGoBtn) {
      // if the page change occured after pressing on the Go btn
      if (isFromGoBtn) {
        // reset all data except the serch term
        this.resetData(false);
      }

      // change the route to have the current pageNumber and searchTerm as parameters
      this.$router.push({
        name: "main",
        params: {
          searchedItem: this.searchTerm,
          pageNumber: this.pageNumber,
        },
      });
    },
    disableButtons() {
      this.disablePaginationButtons = true;

      if (!this.searchTerm) {
        this.resetData();

        // reset the parameters in the current route
        this.$router.push({
          name: "main",
          params: { searchedItem: "", pageNumber: "" },
        });
      }
    },
    closeModal() {
      this.displayMessage = false;
    },
    updateOffset() {
      // update the gifs offset according to the page number
      this.gifsOffset = (this.pageNumber - 1) * MAX_LENGTH;
    },
    updatePageNumber() {
      // update the page number according to the gifs offset
      this.pageNumber = (this.gifsOffset - 1) / MAX_LENGTH + 1;
    },
    fetchPrevGifs() {
      if (this.pageNumber > FIRST_PAGE_NUMBER) {
        // decrement the page number down to 1
        this.pageNumber--;

        // update the gifs offset according to the page number
        this.updateOffset();

        // change the page
        this.changePage(false);
      }
    },
    fetchNextGifs() {
      if (this.pageNumber < this.totalPages) {
        // increment the page number up to the total pages number
        this.pageNumber++;

        // update the gifs offset according to the page number
        this.updateOffset();

        // change the page
        this.changePage(false);
      }
    },
    async fetchGifs() {
      this.disablePaginationButtons = false;

      try {
        const url = `${GIPHY_API_URL}search?q=${this.searchTerm}&api_key=${API_KEY}&limit=${MAX_LENGTH}&offset=${this.gifsOffset}`;

        // display loader
        this.isLoading = true;

        // get the response from the giphy API
        const response = await axios.get(url);

        setTimeout(
          // hide the loader after getting the result
          // and waiting for a given amount of time
          () => {
            this.isLoading = false;
          },
          LOADER_TIMEOUT
        );

        // save the gifs total count from the pagination data
        this.gifsTotalCount =
          response.data &&
          response.data.pagination &&
          response.data.pagination.total_count
            ? response.data.pagination.total_count
            : 0;

        // calculate the number of the total pages
        this.totalPages = Math.ceil(this.gifsTotalCount / MAX_LENGTH);

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
      // and the giffs offset is under the total gifs count or the total gifs count is zero
      if (
        json.data.length === 0 &&
        this.searchTerm &&
        (this.gifsOffset <= this.gifsTotalCount || !this.gifsTotalCount)
      ) {
        // display error message
        this.displayMessage = true;

        this.disablePaginationButtons = true;
      }

      // map the gifs data to an array of the gifs sources
      this.gifs =
        json.data.length > 0
          ? json.data
              .map((gif) => gif.id)
              .map((gifId) => {
                return `https://media.giphy.com/media/${gifId}/giphy.gif`;
              })
          : [];
    },
    resetData(resetSearchTerm = true) {
      // reset all the page data
      this.gifs = [];
      this.searchTerm = resetSearchTerm ? "" : this.searchTerm;
      this.gifsOffset = 0;
      this.gifsTotalCount = 0;
      this.displayMessage = false;
      this.isLoading = false;
      this.pageNumber = FIRST_PAGE_NUMBER;
      this.totalPages = 0;
    },
    saveLastSearch() {
      // if there is no error message and there is a searched term
      if (!this.displayMessage && this.searchTerm) {
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

  .controls-container {
    .search-input {
      width: 80%;
      padding: 12px;
      border: 1px solid $searchInputBorderColor;
      border-radius: 4px;
      font-size: 16px;
      margin: 0 auto;
      font-family: sweetCheeks;
    }

    .search-btn {
      width: 8%;
      height: 46px;

      .btn-text {
        margin: -2vw;
      }
    }

    .page-number {
      background-color: $navbarBackgroundColor;
      width: 88%;
      margin: 0 auto;
      padding: 1vw;
      border-radius: 4px;
      font-weight: bold;

      @media (max-width: 430px) {
        width: 91.5%;
      }
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
}
</style>
