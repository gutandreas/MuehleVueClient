<template>
  <div class="grid-container">
    <DatabaseComponent class="center-panel" />
  </div>
</template>


<script>

import DatabaseComponent from "@/components/DatabaseComponent.vue";

export default {
  name: 'Admin',
  components: {DatabaseComponent},

};
</script>





<style scoped>

.grid-container {
  display: grid;
  grid-template-columns: 0.5fr 1fr 0.5fr; /* Setzt die Breiten der Spalten */
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
</style>