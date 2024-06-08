<template>
  <div id="app">
    <SiteNavbar />
    <router-view />
  </div>
</template>

<script>
import SiteNavbar from './components/SiteNavbar.vue';

export default {
  components: {
    SiteNavbar
  }
}
</script>

<style>
/* App.vue의 스타일을 추가할 수 있습니다. */
</style>
