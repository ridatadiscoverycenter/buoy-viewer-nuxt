<template>
  <div>
    line charts and fish photos, oh my! (could also incorporate this into the
    summary page if its not too much)
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  // async fetch() {
  //   try {
  //     this.loading = true;
  //     const payload = {
  //       fish: this.$route.query.fish
  //     };
  //     await this.$store.dispatch('fish/fetchFishData', payload);
  //     this.loading = false;
  //   } catch (e) {
  //     this.loading = false;
  //     this.$nuxt.context.error({
  //       statusCode: 503,
  //       message: 'Unable to fetch data at this time. Try again later.'
  //     });
  //   }
  // },
  data() {
    return {
      loading: false,
      fish: ''
    };
  },
  computed: {
    ...mapState('fish', ['coordinates', 'samples']),
    fishData() {
      // TODO: given this.fish, get the subset of data cared about (or use fetch to get data from store/api)
      return [];
    }
  },
  watch: {
    '$route.query': function(newQuery, oldQuery) { // eslint-disable-line
      this.fish = newQuery.fish;
      // this.$fetch();
    }
  }
};
</script>
