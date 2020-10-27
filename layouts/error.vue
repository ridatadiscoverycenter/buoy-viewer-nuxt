<template>
  <div>Error Page. {{ error.statusCode }}</div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['error']
};
</script>

<style lang="scss" scoped></style>
