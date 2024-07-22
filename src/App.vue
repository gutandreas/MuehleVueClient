<template>
  <div id="app">
    <div class="layout-container">
      <NavigationBar class="nav" />
      <MuehleBoard />

      <div class="main-content">
        <div><SetupForm class="left-panel" /></div>
        <div><MuehleBoard class="center-panel"/></div>
        <div><status-display class="right-panel" /></div>
      </div>

    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import NavigationBar from "@/components/NavigationBar.vue";
import SetupForm from "@/components/SetupForm.vue";
import MuehleBoard from "@/components/MuehleBoard.vue";
import StatusDisplay from "@/components/StatusDisplay.vue";

export default {
  name: 'App',
  components: {
    NavigationBar, SetupForm, MuehleBoard, StatusDisplay,
  }
}
</script>

<style>
/* Grid-Layout für das gesamte Layout */
.layout-container {
  display: grid;
  grid-template-rows: auto 1fr; /* Navigation oben, Rest des Inhalts flexibel */
  grid-template-columns: auto 1fr; /* SetupForm links, MuehleBoard rechts */
  height: 100vh; /* Volle Höhe des Viewports */
  grid-template-areas:
    "nav nav nav"
    "left center right";
}

.nav {
  grid-area: nav;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  grid-template-areas: "left center right";
  height: 100%;
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
