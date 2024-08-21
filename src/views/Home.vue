<template>
  <div class="grid-container">
    <component :is="gameRunning ? 'GameResults' : 'SetupForm'"></component>
    <MuehleBoard class="center-panel"/>
    <StatusDisplay class="right-panel"/>
  </div>
</template>

<script>

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import SetupForm from "@/components/SetupForm.vue";
import MuehleBoard from "@/components/MuehleBoard.vue";
import StatusDisplay from "@/components/StatusDisplay.vue";
import GameResults  from "@/components/GameResults.vue";

import { mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    SetupForm, MuehleBoard, StatusDisplay, GameResults
  },

  data() {
    return {
      messages: [], // Messages received from the WebSocket server
    };
  },
  computed: {
    ...mapGetters(['getRunning']),
    gameRunning() {
      return this.getRunning;
    }
  },

}

</script>

<style>

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
