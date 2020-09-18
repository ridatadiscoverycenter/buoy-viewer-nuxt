<template>
  <div>
    <p class="menu-label">
      Narraganssett Bay Data Explorer
    </p>
    <ul class="menu-list">
      <li>
        <nuxt-link
          :to="{
            name: 'index'
          }"
          ><span>Home</span></nuxt-link
        >
      </li>
      <li>
        <nuxt-link
          :to="{
            name: 'about'
          }"
          ><span>About</span></nuxt-link
        >
      </li>
    </ul>
    <p class="menu-label">
      Datasets
    </p>
    <ul class="menu-list">
      <li v-for="item in datasets" :key="item.route">
        <nuxt-link
          v-if="item.available"
          :class="{ 'is-active': route === item.route }"
          :aria-disabled="!item.available"
          :to="{
            name: item.route
          }"
          ><span>{{ item.name }}</span></nuxt-link
        >
        <a
          v-else
          disabled
          :aria-disabled="!item.available"
          class="not-allowed-cursor"
          ><span>{{ item.name }}</span
          ><span class="tag is-light is-warning ml-2">comming soon</span></a
        >
      </li>
    </ul>
    <p class="menu-label">Resources</p>
    <ul class="menu-list">
      <li>
        <a href="https://pricaimcit.services.brown.edu/erddap/index.html"
          >ERDDAP Server</a
        >
      </li>
      <li><a href="https://ridatadiscovery.org">RIDDC Home</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      route: this.$route.name,
      datasets: [
        {
          name: 'Historical Buoy Data',
          route: 'datasets-historical-buoy-data-dashboard',
          available: true
        },
        {
          name: 'Phytoplankton TS',
          route: 'datasets-phytoplankton-timeseries-dashboard',
          available: false
        }
      ]
    };
  }
};
</script>

<style lang="scss">
.not-allowed-cursor {
  cursor: not-allowed;
}
</style>
