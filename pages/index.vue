<template>
  <main class="hero grid-container">
    <div class="item1 pt-4">
      <div class="center">
        <h1 class="title pb-4">NarrBay Buoy Data Explorer</h1>
        <h2 class="subtitle pb-4">
          Explore historical data collected from multiple buoys in the
          Narragansett Bay
        </h2>
        <nuxt-link
          :class="{ disabled: summary.length == 0 }"
          class="button is-warning action-button"
          :to="{
            name: 'summary'
          }"
        >
          <span>Start Exploring</span>
          <font-awesome-icon
            class="ml-3"
            icon="compass"
            :spin="summary.length == 0"
          />
        </nuxt-link>
      </div>
    </div>
    <Map class="item2" :points="coordinates" />
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
    ...mapState('variables', ['buoys']),
    ...mapState('buoy', ['coordinates']),
    dataArr: {
      get() {
        return 0;
      },
      set() {
        return this.summary.reduce((a, b) => _.concat(a, b)).length();
      }
    }
  },
  created() {
    this.$store.dispatch('buoy/fetchBuoyCoordinates', {
      ids: this.buoys
    });
  },
  beforeMount() {
    if (process.browser && this.summary.length < 13) {
      try {
        const summary = JSON.parse(localStorage.getItem('riddcBuoy'));
        summary
          .reduce((a, b) => a.concat(b))
          .forEach((datum) => {
            datum.date = new Date(datum.date);
            this.$store.dispatch('worker/setSummary', datum);
          });
        this.$store.dispatch('worker/loaded', true);
      } catch {
        this.$store.dispatch('worker/loaded', false);
      }
    }
  },
  mounted() {
    const buoyChunks = _.chunk(this.buoys, 1);
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
@import 'bulma';
.title {
  font-size: $size-1 * 1.5;
}
.subtitle {
  font-size: $size-5 * 1.5;
}
.action-button {
  font-size: $size-4;
}
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
  display: grid;
  justify-content: center;
}
</style>
