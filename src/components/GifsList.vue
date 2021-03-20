
<template>
  <div class="gifs-list-container">
    <div v-for="gif in gifs" :key="gif.id">
      <GifItem :gif="gif" />
    </div>
  </div>
</template>

<script>
import GifItem from "../components/GifItem";
export default {
  name: "Gifs",
  props: {
    gifs: Array
  },
  components: {
    GifItem
  },
  methods: {}
};
</script>

<style scoped lang="scss">
.gifs-list-container {
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
}
</style>
