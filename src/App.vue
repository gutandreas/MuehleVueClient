<template>
  <div id="app">
    <NavigationBar class="nav" />
    <div class="main-content">
      <router-view />
    </div>
    <Footer class="footer" />
  </div>
</template>

<script>
import NavigationBar from '@/components/NavigationBar.vue';


export default {
  name: 'App',
  components: {
    NavigationBar
  }
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Stellt sicher, dass der Container die volle Höhe des Viewports einnimmt */
  width: 100%; /* Stellt sicher, dass der Container die volle Breite einnimmt */
}

.main-content {
  flex: 1; /* Erlaubt dem Hauptinhalt, den verfügbaren Platz einzunehmen */
  display: flex;
  flex-direction: column; /* Falls du einen flexiblen Inhalt hast */
  width: 100%; /* Stellt sicher, dass der Inhalt die volle Breite einnimmt */
}
</style>
