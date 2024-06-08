<template>
  <div id="app">
    <exampleNavbar />
    <router-view />
  </div>
</template>

<script>
import exampleNavbar from './components/exampleNavbar.vue';

export default {
  components: {
    exampleNavbar,
  }
}
</script>

<style>
/* App.vue의 스타일을 추가할 수 있습니다. */
</style>
