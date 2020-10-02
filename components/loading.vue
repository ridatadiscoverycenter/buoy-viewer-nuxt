<template>
  <div v-if="loading" class="loading-container">
    <font-awesome-icon icon="compass" spin class="compass-loading" />
  </div>
</template>
<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'bulma';
.loading-container {
  display: flex;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(82, 69, 99, 0.4);
  z-index: 1000;
  justify-content: center;
}
.compass-loading {
  @extend .mt-6;
  justify-self: center;
  align-self: center;
  font-size: 20rem !important;
  color: $link;
}
</style>
