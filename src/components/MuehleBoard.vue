<template>
  <div class="muehle-board rounded-3">
    <!-- Hintergrundbild -->
    <div class="container">
      <div class="background-image"></div>
      <div class="grid-overlay">
        <!-- Grid-Items werden hier dynamisch hinzugefügt -->
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <div class="grid-item"></div>
        <!-- Füge hier weitere Grid-Items hinzu, falls nötig -->
      </div>
    </div>
  </div>
</template>

<script>
import stompService from '../stomp/stompService';

export default {
  name: 'MuehleBoard',
  data() {
    return {
      phase: "set",
    };
  },
  methods: {
    handlePointClick(ring, field) {
      console.log(ring + "/" + field);
      const message = JSON.stringify({
        ring: ring,
        field: field,
      });
      stompService.send('/app/game/action', message);
    },
    translateRingAndFieldToGridColumnAndRow(ring, field) {
      let factor = 0;
      let column = ring;
      let row = ring;
      switch (ring) {
        case 0:
          factor = 3;
          break;
        case 1:
          factor = 2;
          break;
        case 2:
          factor = 1;
          break;
      }

      switch (field) {
        case 0:
          row = ring;
          column = ring;
          break;
        case 1:
          column += 1 * factor;
          break;
        case 2:
          column += 2 * factor;
          break;
        case 3:
          row += + 1 * factor;
          column += 2 * factor;
          break;
        case 4:
          row += 2 * factor;
          column += 2 * factor;
          break;
        case 5:
          row += 2 * factor;
          column += 1 * factor;
          break;
        case 6:
          row += 2 * factor;
          break;
        case 7:
          row += 1 * factor;
          break;
      }

      return { row, column };
    },
    setStone(ring, field) {
      const { row, column } = this.translateRingAndFieldToGridColumnAndRow(ring, field);
      const gridItems = document.querySelectorAll('.grid-item');
      const index = row * 7 + column; // Index im Grid berechnen

      if (gridItems[index]) {
        const img = document.createElement('img');
        img.src = require('@/assets/game_images/StoneBlack.png');
        gridItems[index].innerHTML = ''; // Vorhandenen Inhalt löschen
        gridItems[index].appendChild(img);
      }
    }
  },
  mounted() {
    // Beispiel: Setze einen Stein auf Position (0, 1)
    this.setStone(0, 0);
    this.setStone(0, 2);
    this.setStone(1, 2);
    this.setStone(2,7)
  }
};
</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%; /* Macht das Element quadratisch */
  background-color: #f0f0f0;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('../assets/game_images/Spielfeld.png') no-repeat center center;
  background-size: cover;
  z-index: 1;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* Anzahl der Spalten */
  grid-template-rows: repeat(7, 1fr);    /* Anzahl der Reihen */
  z-index: 2;
}

.grid-item {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0); /* Optional: Gitterlinien */
  overflow: hidden; /* Verhindert, dass Bild über die Zelle hinausgeht */
}

.grid-item img {
  object-fit: contain; /* Bild soll die gesamte Zelle ausfüllen, ohne Verzerrung */
}
</style>
