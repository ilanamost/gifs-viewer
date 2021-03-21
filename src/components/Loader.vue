<template>
  <div class="loader-container flex justify-center align-center">
    <div class="loader"></div>
  </div>
</template>

<script>
export default {
  name: "Loader",
};
</script>

<style scoped lang="scss">
.loader-container {
  height: 100%;
  width: 100%;
  position: fixed;
  z-index: 1;
  padding-top: 8.5vh;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: $historyMessageContainerBackgroundColor;

  .loader {
    border: 16px solid #f3f3f3;
    border-top: 16px solid #3498db;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
  }
}
</style>