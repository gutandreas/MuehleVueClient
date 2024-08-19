<template>
  <div class="muehle-board rounded-3">
    <!-- Hintergrundbild -->
    <div class="container">
      <div class="background-image"></div>
      <div class="grid-overlay">

        <!-- Grid-Items werden hier dynamisch hinzugefügt -->
        <div
            v-for="index in 49"
            :key="index"
            class="grid-item"
            @click="handlePointClick(index)"
        >

        <!-- Füge hier weitere Grid-Items hinzu, falls nötig -->
      </div>
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
    handlePointClick(index) {
      console.log("Index: " + index)
      let position = this.translateIndexToRingAndField(index)
      console.log(position.ring + "/" + position.field);
      const message = JSON.stringify({
        ring: position.ring,
        field: position.field,
      });
      stompService.send('/app/game/action', message);
    },
    translateIndexToRingAndField(index){
      switch (index){
        case 1: return {ring: 0, field: 0};
        case 4: return {ring: 0, field: 1};
        case 7: return {ring: 0, field: 2};
        case 28: return {ring: 0, field: 3};
        case 49: return {ring: 0, field: 4};
        case 46: return {ring: 0, field: 5};
        case 44: return {ring: 0, field: 6};
        case 22: return {ring: 0, field: 7};

        case 9: return {ring: 1, field: 0};
        case 11: return {ring: 1, field: 1};
        case 13: return {ring: 1, field: 2};
        case 27: return {ring: 1, field: 3};
        case 41: return {ring: 1, field: 4};
        case 39: return {ring: 1, field: 5};
        case 37: return {ring: 1, field: 6};
        case 23: return {ring: 1, field: 7};

        case 17: return {ring: 2, field: 0};
        case 18: return {ring: 2, field: 1};
        case 19: return {ring: 2, field: 2};
        case 26: return {ring: 2, field: 3};
        case 33: return {ring: 2, field: 4};
        case 32: return {ring: 2, field: 5};
        case 30: return {ring: 2, field: 6};
        case 24: return {ring: 2, field: 7};
      }
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
    tranlasteRingAndFieldToIndex(ring, field){
      const { row, column } = this.translateRingAndFieldToGridColumnAndRow(ring, field);
      const index = row * 7 + column;
      return index;
    },
    putStone(ring, field) {
      let index = this.tranlasteRingAndFieldToIndex(ring, field);
      this.setImageToIndex(index, 'StoneBlack')

    },
    removeStone(ring, field) {
      let index = this.tranlasteRingAndFieldToIndex(ring, field);
      this.setImageToIndex(index, 'FullyTransparent')
    },

    setImageToIndex(index, file){
      const gridItems = document.querySelectorAll('.grid-item');

      if (gridItems[index]) {
        const img = document.createElement('img');
        img.src = require('@/assets/game_images/' + file + '.png');
        gridItems[index].innerHTML = ''; // Vorhandenen Inhalt löschen
        gridItems[index].appendChild(img);
      }
    }
  },
  mounted() {
    this.putStone(0, 0);
    this.putStone(0, 2);
    this.putStone(1, 2);
    this.putStone(2,7);
    this.removeStone(2,7);
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
