<template>
  <nav
    class="navbar is-transparent"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <a class="navbar-item" :href="application.baseURL">
        <BaseLogo />
        <span class="navbar-title">{{ application.title }}</span>
      </a>

      <a
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
        @click="expand"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div
      id="navbarBasicExample"
      class="navbar-menu"
      :class="{ 'is-active': isActive }"
    >
      <div class="navbar-end">
        <router-link class="navbar-item" to="/">Home</router-link>
        <router-link class="navbar-item" to="/about">About</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex';
import BaseLogo from '@/components/base/BaseLogo';
export default {
  components: {
    BaseLogo
  },
  data() {
    return {
      isActive: false
    };
  },
  computed: mapState('variables', ['application']),
  methods: {
    expand() {
      this.isActive = !this.isActive;
    }
  }
};
</script>

<style lang="sass">
.navbar-item
    font-weight: bold
    font-size: 1rem
.navbar-menu
    width: 10rem
    right: 0
    background-color: transparent
    position: absolute
    .navbar-item
        text-transform: uppercase
.navbar-title
    margin-left: 1rem
    font-size: 1.2rem
</style>
