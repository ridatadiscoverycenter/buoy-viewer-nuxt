<template>
  <Dashboard>
    <template #main-nav>
      <nuxt-link
        class="plot-nav is-size-5 py-5"
        :to="{
          name: 'index',
        }"
        ><span>Home</span></nuxt-link
      ></template
    >
    <template #main-header><h1 class="title">Volume Viewer</h1></template>
    <template #main-section>
      <iframe
        src="./unity-volume-viewer-web-app/index.html"
        width="1000"
        height="800"
      ></iframe>
    </template>
  </Dashboard>
</template>

<script>
import Dashboard from '~/components/base/BaseDashboard.vue';

export default {
  components: {
    Dashboard,
  },
  layout: 'dashboard',
};
</script>

<style scoped></style>
