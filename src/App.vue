<template>
  <div id="app">
    <Menu v-if="!$route.meta.hideMenu" /> <!-- Solo se muestra si hideMenu es false -->
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Menu from './components/layout/Menu.vue';

export default {
  components: {
    Menu,
  },
};
</script>

<style src="./assets/main.css"></style>
