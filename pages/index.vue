<template>
  <main class="hero grid-container">
    <div class="item1">
      <div class="center">
        <h1 class="title">NarrBay Buoy Data Viewer</h1>
        <h2 class="subtitle">
          Explore historical data collected from multiple buoys in the
          Narragansett Bay
        </h2>
        <nuxt-link
          :class="{ disabled: !loaded }"
          class="button is-warning"
          :to="{
            name: 'summary'
          }"
        >
          <span>Explore data availabilty for each buoy</span>
          <font-awesome-icon v-if="!loaded" icon="play-circle" size="2x" spin />
        </nuxt-link>
      </div>
    </div>
    <Map class="item2" />
  </main>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';
import Map from '@/components/Map.vue';
export default {
  components: {
    Map
  },
  computed: {
    ...mapState('worker', ['loaded', 'summary']),
    ...mapState('variables', ['buoys'])
  },
  created() {
    const buoyChunks = _.chunk(this.buoys, this.buoys.length);
    if (process.browser) {
      if (this.summary.length === 0) {
        buoyChunks.forEach((chunk) => {
          const worker = this.$worker.createWorker();
          this.$store.dispatch('worker/loaded', false);
          worker.addEventListener('message', this.workerResponseHandler);
          worker.postMessage({ buoys: chunk });
        });
      } else {
        this.$store.dispatch('worker/loaded', true);
      }
    }
  },
  methods: {
    workerResponseHandler(event) {
      this.$store.dispatch('worker/loaded', true);
      this.$store.dispatch('worker/setSummary', event.data);
    }
  }
};
</script>

<style lang="scss" scoped>
.disabled {
  background-color: #efefef !important;
  cursor: not-allowed;
  svg {
    margin-left: 1rem;
  }
}
.grid-container {
  display: grid;
  grid-template-columns: 1fr 4fr 5fr 1fr;
  grid-template-rows: 2rem auto;
  grid-template-areas:
    '. . . . '
    '. area1 area2 .';
}

.item1 {
  display: grid;
  grid-area: area1;
  align-content: start;
  justify-items: start;
  grid-template-columns: 1fr 9fr 1fr;
  grid-template-rows: 8rem auto 5rem;
  grid-template-areas:
    '. top .'
    '. center .'
    '. bottom .';
}
.center {
  grid-area: center;
}
.item2 {
  grid-area: area2;
}
</style>
