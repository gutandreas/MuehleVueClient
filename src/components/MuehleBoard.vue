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
import {translateIndexToRingAndField, tranlasteRingAndFieldToIndex} from '@/jsTools/muehleBoardTools';
import {mapActions} from "vuex";


export default {
  name: 'MuehleBoard',
  data() {
    return {
      phase: "set",
    };
  },
  methods: {

    ...mapActions(['sendAction', "updateBoard"]),
    handlePointClick(index) {
      console.log("Index: " + index)
      let position = translateIndexToRingAndField(index)
      console.log(position.ring + "/" + position.field);
      const message = {
        type: "put",
        ring: position.ring,
        field: position.field,
        gamecode: "72YBWG",
        uuid: "bbc6137c-e75c-4d9b-a734-f676c64d97a2"
      }
      this.sendAction(message);

    },
    /*updateBoard(boardArray){
      for (let i = 0; i < boardArray.length; i++) {
        for (let j = 0; j < boardArray[0].length; j++) {
          console.log(boardArray[i][j]);
          switch (boardArray[i][j]) {
            case "FREE":
                this.removeStone(i, j)
                break;
            case "PLAYER1":
                this.putStone(i, j)
                break;

          }

        }

      }
    },*/

    putStone(ring, field) {
      let index = tranlasteRingAndFieldToIndex(ring, field);
      this.setImageToIndex(index, 'StoneBlack')

    },
    removeStone(ring, field) {
      let index = tranlasteRingAndFieldToIndex(ring, field);
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
      stompService.subscribe('/topic/game/boardupdate', (message) => {
        try {
          // Direkte Verarbeitung als Array
          const parsedMessage = typeof message.body === 'string' ? JSON.parse(message.body) : message.body;

          console.log(parsedMessage)
          this.updateBoard(parsedMessage)

        } catch (error) {
          console.error("Failed to process message:", error);
        }
      });
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
