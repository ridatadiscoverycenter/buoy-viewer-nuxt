<template>
  <div>
    <div class="has-text-right">
      <button type="button" class="button bars" @click="toggle">
        <fa v-if="!collapsed" :icon="['fas', 'times']" />
        <fa v-else :icon="['fas', 'bars']" />
      </button>
    </div>
    <div class="sidebar-body">
      <p v-if="!collapsed" class="menu-label">Narragansett Bay Data Explorer</p>
      <p v-else class="menu-label">
        <abbr title="Narragansett Bay Data Explorer">NBDE</abbr>
      </p>
      <ul class="menu-list">
        <li>
          <nuxt-link
            :to="{
              name: 'index',
            }"
          >
            <fa :icon="['fas', 'home']" />
            <span v-if="!collapsed">Home</span>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link
            :to="{
              name: 'about',
            }"
          >
            <fa :icon="['fas', 'info-circle']" />
            <span v-if="!collapsed">About</span></nuxt-link
          >
        </li>
      </ul>
      <p v-if="!collapsed" class="menu-label">Exploration Datasets</p>
      <p v-else class="menu-label">
        <abbr title="Exploration Datasets">DATA</abbr>
      </p>
      <ul class="menu-list">
        <li v-for="item in datasets" :key="item.route">
          <nuxt-link
            v-if="item.available"
            :class="{ 'is-active': route === item.route }"
            :aria-disabled="!item.available"
            :to="{
              name: item.route,
            }"
          >
            <span v-if="!collapsed">{{ item.name }}</span>
            <span v-else
              ><abbr :title="item.name" class="collapsed-flex-item">
                <fa :icon="['fas', 'poll']" class="mr-1" />
                <span>{{ item.name | initials }}</span>
              </abbr></span
            >
          </nuxt-link>
          <a
            v-else
            disabled
            :aria-disabled="!item.available"
            class="not-allowed-cursor"
          >
            <span v-if="!collapsed">{{ item.name }}</span>
            <span v-else
              ><abbr :title="item.name" class="collapsed-flex-item">
                <fa :icon="['fas', 'poll']" class="mr-1" />
                <span>{{ item.name | initials }}</span>
              </abbr></span
            >
            <span v-if="!collapsed" class="tag is-light is-warning ml-2"
              >coming soon</span
            ></a
          >
        </li>
      </ul>
      <p v-if="!collapsed" class="menu-label">Resources</p>
      <p v-else class="menu-label">
        <abbr title="Resources">Src</abbr>
      </p>
      <ul class="menu-list">
        <li>
          <a href="https://pricaimcit.services.brown.edu/erddap/index.html">
            <span v-if="!collapsed">
              <fa :icon="['fas', 'database']" class="mr-1" />
              ERDDAP Server</span
            >
            <span v-else>
              <abbr title="ERDDAP Server" class="collapsed-flex-item">
                <fa :icon="['fas', 'database']" class="mr-1" />
                <span> {{ 'ERDDAP Server' | initials }}</span>
              </abbr></span
            >
          </a>
        </li>
        <li>
          <a href="https://ridatadiscovery.org">
            <span v-if="!collapsed"
              ><abbr title="Rhode Island Data Discovery Center"
                ><fa :icon="['fas', 'water']" class="mr-1" />RIDDC</abbr
              >
              Home</span
            >
            <span v-else>
              <abbr
                title="Rhode Island Data Discovery Center Home"
                class="collapsed-flex-item"
              >
                <fa :icon="['fas', 'water']" class="mr-1" />
                <span> {{ 'RIDDC Home' | initials }}</span>
              </abbr></span
            ></a
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    initials(str) {
      return str
        .split(' ')
        .map((s) => s[0].toUpperCase())
        .join('');
    },
  },
  data() {
    return {
      collapsed: false,
      datasets: [
        {
          name: 'Historical Buoy Data',
          route: 'datasets-historical-buoy-data',
          available: true,
        },
        {
          name: 'Ocean State Ocean Model',
          route: 'datasets-osom-data',
          available: true,
        },
        {
          name: 'Plankton Time Series',
          route: 'datasets-plankton',
          available: true,
        },
        {
          name: 'Domoic Acid',
          route: 'datasets-domoic-acid',
          available: true,
        },
        {
          name: 'Volume Viewer',
          route: 'datasets-volume-viewer',
          available: true,
        },
      ],
    };
  },
  computed: {
    route() {
      return this.$route.name.replace('-dashboard', '');
    },
  },
  methods: {
    toggle() {
      this.collapsed = !this.collapsed;
      return this.$emit('toggle', this.collapsed);
    },
  },
};
</script>

<style lang="scss">
@import 'bulma';
.is-active {
  background-color: rgb(89, 81, 139) !important;
}
.not-allowed-cursor {
  cursor: not-allowed;
}
.bars {
  border: none !important;
  background-color: whitesmoke !important;
}
.collapsed-flex-item {
  display: flex;
  align-items: center;
  justify-items: center;
  margin-left: -0.35rem;
  span {
    font-size: 0.6rem;
  }
}
</style>
