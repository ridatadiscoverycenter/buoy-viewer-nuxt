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
      <li>
        <nuxt-link
          :to="{
            name: 'summary'
          }"
          ><span>Historical Bouy Data</span></nuxt-link
        >
      </li>
      <li><a>Phytoplankton TimeSeries</a></li>
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
      route: this.$route.name
    };
  }
};
</script>

<style lang="scss" scoped></style>
