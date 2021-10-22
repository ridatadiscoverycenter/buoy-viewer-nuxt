<template>
  <div class="base-form">
    <div class="base-form-inputs">
      <slot name="inputs"></slot>
    </div>
    <div class="base-form-buttons">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.base-form-inputs {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
}

.base-form-buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
