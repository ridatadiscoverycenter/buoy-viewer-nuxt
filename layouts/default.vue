<template>
  <div>
    <a class="logo-container" href="https://ridatadiscovery.org">
      <span class="brand-title">Rhode Island Data Discovery Center</span>
      <BaseLogo />
    </a>
    <nuxt />
  </div>
</template>
<script>
import BaseLogo from '@/components/base/BaseLogo';

export default {
  components: {
    BaseLogo,
  },
};
</script>

<style lang="scss" scoped>
.logo-container {
  @extend .is-flex;
  @extend .px-2;
  @extend .py-2;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #a4b1bf;
}
</style>
