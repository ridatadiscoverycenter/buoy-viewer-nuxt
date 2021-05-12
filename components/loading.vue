<template>
  <div v-if="loading || manualLoad" class="loading-container">
    <fa icon="compass" spin class="compass-loading" />
  </div>
</template>
<script>
export default {
  props: {
    manualLoad: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    loading: false,
  }),
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import 'bulma';
.loading-container {
  display: flex;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(82, 69, 99, 0.4);
  z-index: 1000;
  justify-content: center;
}
.compass-loading {
  @extend .mt-6;
  align-self: center;
  font-size: 20rem !important;
  color: rgb(89, 81, 139);
}
</style>
