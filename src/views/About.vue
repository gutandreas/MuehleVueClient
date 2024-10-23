<template>
  <div class="grid-container">
    <AboutComponent class="full-panel" />
  </div>
</template>


<script>

import AboutComponent from "@/components/AboutComponent.vue";

export default {
  name: 'About',
  components: {AboutComponent},

};
</script>





<style scoped>


.grid-container {
  display: grid;
  grid-template-columns: 1fr; /* Setzt die Breiten der Spalten */
  grid-template-rows: auto; /* Auto Höhe basierend auf dem Inhalt */
  grid-template-areas:
    "left center right";
  width: 100%;
}

.left-panel {
  grid-area: left;
  width: 100%;
  border-right: 2px solid #fff; /* Optional: Border zur Trennung */
}

.center-panel {
  grid-area: center;
  align-items: center; /* Zentriert das Spielfeld vertikal */
  justify-content: center; /* Zentriert das Spielfeld horizontal */
  width: 100%;
  height: 100%;
  border-top: 2px solid #fff; /* Optional: Border zur Trennung */
}

.right-panel {
  grid-area: right;
  width: 100%;
  border-left: 2px solid #fff; /* Optional: Border zur Trennung */
}

.full-panel {
  grid-area: 1 / 1 / 2 / 2; /* Nimmt den gesamten Platz ein */
  width: 100%;
  height: 100%; /* Optional: Stellt sicher, dass die Höhe des Panels 100% beträgt */
}
</style>