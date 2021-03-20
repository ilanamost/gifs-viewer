<template>
  <div class="history">
    <ul class="history-list" v-if="lastUserSearches.length > 0">
      <li
        v-for="(item, index) in lastUserSearches"
        :key="index"
        @click="navigateToMainPage(item)"
        class="list-item flex justify-center align-center"
      >
        <span class="item-text"> {{ item }} </span>
      </li>
    </ul>

    <div v-if="lastUserSearches.length === 0" class="message">
      <p>There are currently no search items to display</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "HistoryGifs",
  methods: {
    navigateToMainPage(item) {
      this.$router.replace({ name: "main", params: { searchedItem: item } });
    },
  },
  computed: {
    lastUserSearches() {
      return this.$store.getters.lastUserSearches;
    }
  }
};
</script>

<style lang="scss" scoped>
.history-list {
  margin-top: 30px;
  display: grid;
  margin: 30px auto 0 auto;
  row-gap: 7vh;
  padding: 10px;
  grid-template-columns: repeat(3, 1fr);
  transition: all 0.8s;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    width: 90%;
    margin: 0 auto;
  }

  @media (max-width: 780px) {
    width: 100%;
    grid-template-columns: 1fr;
  }

  .list-item {
    border: solid 1px white;
    padding: 5px;
    background-color: #8a2be254;
    width: 80%;
    margin: 2vh auto;
    border-radius: 15px;
    text-transform: uppercase;
    font-weight: bold;
    height: 100%;

    &:hover {
      cursor: pointer;
      background-color: #8a2be287;
      transform: scale(1.1);
      transition: all 0.5s;
    }
  }
}

.message {
  padding: 1vw;
  background-color: #a970e28f;
  width: 80%;
  margin: 0 auto;
  border-radius: 10px;
  border: 2px solid #000000;
}
</style>