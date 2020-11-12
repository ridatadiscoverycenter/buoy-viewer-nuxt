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
    BaseLogo
  }
};
</script>
