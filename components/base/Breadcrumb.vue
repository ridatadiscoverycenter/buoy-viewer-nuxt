<template>
  <div>
    <span v-for="link in links" :key="'link-' + link.name">
      <span v-if="link.target">
        <nuxt-link
          class="plot-nav is-size-5"
          :to="{
            name: link.target,
          }"
        >
          <span>{{ link.name }}</span></nuxt-link
        >
        <span class="mx-4 is-size-5">/</span>
      </span>
      <span v-else class="plot-nav is-size-5">{{ link.name }}</span>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    path: {
      type: String,
      required: true,
    },
  },
  computed: {
    links() {
      const links = [{ name: 'Home', target: 'index' }];
      const pathParts = this.path.split('/').filter((part) => part.length > 0);
      if (pathParts.length === 3) {
        links.push({
          name: 'Summary',
          target: pathParts.slice(0, 2).join('-'),
        });
        links.push({ name: 'Explore' });
      } else {
        links.push({ name: 'Summary' });
      }

      return links;
    },
  },
};
</script>
