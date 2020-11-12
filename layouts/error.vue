<template>
  <main class="error-container">
    <div class="error-content">
      <fa
        :icon="['fad', 'life-ring']"
        size="5x"
        class="mr-2 life-ring has-text-danger"
      />
      <p>{{ error.message }}</p>
      <p v-if="error.statusCode >= 500">
        Make sure you selected a data range for which we have data.
      </p>
    </div>
    <a @click="goBack">
      <fa :icon="['fas', 'arrow-left']" class="mr-2" />
      Back
    </a>
    <nuxt-link to="/">
      <fa :icon="['fas', 'home']" class="mr-2" />
      Home</nuxt-link
    >
  </main>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['error'],
  methods: {
    goBack() {
      this.$router.back();
    }
  }
};
</script>

<style lang="scss">
.error-content,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.error-container {
  padding: 3rem;
  margin-top: 5rem;
  height: 100%;
}
.error-content {
  font-size: 3rem;
}
</style>
