<template>
  <div class="loader-container flex justify-center align-center">
    <div class="bubble bubble-1"></div>
    <div class="bubble bubble-2"></div>
    <div class="bubble bubble-3"></div>
    <div class="bubble bubble-4"></div>
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
}

div.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.loader-container > .bubble {
  width: 3vw;
  height: 3vw;
  border-radius: 100%;
  margin: 2vw;
  background-image: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  animation: bounce 1.5s 0.5s linear infinite;

  &.bubble-2 {
    animation-delay: 0.1s;
  }

  &.bubble-3 {
    animation-delay: 0.2s;
  }

  &.bubble-4 {
    animation-delay: 0.3s;
  }
}
</style>