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

<style>
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

/* used by download form and explore form fields */
.control-item {
  width: 100%;
}
</style>
