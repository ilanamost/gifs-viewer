
<template>
  <div class="modal-container">
    <div class="modal-content">
      <div class="content-container">
        <p class="title flex-justify-center"> Sorry <span> :( </span></p>

        <img src="@/../public/img/cat-with-fish.jpg" class="message-image" />

        <p class="title flex-justify-center">
          There are no Gifs for the current search value
        </p>

        <div class="buttons-container flex space-between">
          <button @click="closeModal" class="btn btn-danger">
            Cancel
         </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Message",
  props: {},
  components: {},
  methods: {
    closeModal() {
      // notify the parent component to close the message modal
      this.$emit("closeModal");
    },
  },
};
</script>

<style scoped lang="scss">
.modal-container {
  position: fixed;
  z-index: 1;
  padding-top: 8.5vh;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: $historyMessageContainerBackgroundColor;

  @media (max-width: 1200px) {
     padding-top: 15vh;
  }

  .modal-content {
    background-color: $modalBackgroundColor;
    margin: auto;
    padding: 20px;
    border: 1px solid $modalBorderColor;
    width: 80%;
    font-size: calc(16px + 1vw);
    border-radius: 40px;

    .message-image {
      width: 30%;
    }

    .buttons-container {
      .btn-success {
        margin-right: 30px;
      }
    }
  }
}
</style>