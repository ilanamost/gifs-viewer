
<template>
  <div class="gif-container">
    <img :src="gif" :key="gif.id" class="grid-item" />
  </div>
</template>

<script>
export default {
  name: "GifItem",
  props: {
    gif: String
  }
};
</script>

<style scoped lang="scss">
.grid-item {
  font-size: 30px;
  width: 55%;
  height: 30vh;
  border-radius: 50%;
  border: 10px solid $gifItemBorderColor;
  box-shadow: 10px 10px 5px 0px $gifItemBoxShadow;

  &:hover {
    transform: scale(1.1);
    transition: all 0.5s;
  }

  @media (max-width: 1200px) {
    max-width: 60%;
    max-height: 25vh;
  }

  @media (max-width: 780px) {
    width: 40%;
  }

  @media (max-width: 430px) {
    width: 80%;
  }
}
</style>
