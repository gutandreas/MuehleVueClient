<template>
  <div class="muehle-board rounded-3">
    <div class="container">
      <div class="background-image"></div>
      <div class="grid-overlay">
        <!-- Grid-Items werden hier dynamisch hinzugefügt -->
        <div
            v-for="index in 49"
            :key="index"
            class="grid-item"
            :class="getGridItemClass(index)"
            @click="getRunning && handlePointClick(index)"

        >
          <img v-if="getGridItemState(index) === 'PLAYER1'" src="@/assets/game_images/StoneBlack.png" />
          <img v-if="getGridItemState(index) === 'PLAYER2'" src="@/assets/game_images/StoneWhite.png" />
          <img v-if="getGridItemState(index) === 'FREE'" src="@/assets/game_images/FullyTransparent.png" />
          <img v-if="getGridItemState(index) === 'NO POSITION'" src="@/assets/game_images/FullyTransparent.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { isIndexValidPosition, translateIndexToRingAndField } from '@/jsTools/muehleBoardTools';
import { mapGetters, mapActions } from "vuex";

export default {
  name: 'MuehleBoard',
  data(){
    return {
      moveFrom: null,

    }
  },
  computed: {
    ...mapGetters(['getBoard', "getGamecode", "getUuid", 'getRunning', 'getPhase', 'getIndex', 'getStateOnPosition']),
  },
  methods: {
    ...mapActions(['sendAction', 'updateGame']),

    handlePointClick(index) {
      if (!isIndexValidPosition(index)){
        console.log("Ungültige Position angeklickt")
        return
      }
      console.log("Index: " + index);
      let clickedPosition = translateIndexToRingAndField(index);
      console.log(clickedPosition.ring + "/" + clickedPosition.field);

      if (this.getPhase === "WAIT"){
        alert("Warten Sie, bis Sie an der Reihe sind!")
      } else if (this.getPhase === "PUT") {
        this.sendMessage(clickedPosition, "PUT")
      } else if (this.getPhase === "MOVE") {
          if (this.moveFrom == null) {
            if (!this.isThisMyStone(index)){
              alert("Das ist nicht Ihr Stein...")
              return;
            }
            if (!this.isThereAFreeNeighbourPosition(index)){
              alert("Dieser Stein hat keine freien Nachbarsfelder...")
              return;
            }
            this.moveFrom = clickedPosition;
            // HIER
          } else {
            this.sendMoveOrJumpMessage("MOVE", this.moveFrom, clickedPosition)
            this.moveFrom = null;
          }
      } else if (this.getPhase === "KILL"){
        this.sendMessage(clickedPosition, "KILL")
      } else if (this.getPhase === "JUMP"){
        if (this.moveFrom == null) {
          if (!this.isThisMyStone(index)){
            alert("Das ist nicht Ihr Stein...")
            return;
          }
          this.moveFrom = clickedPosition;
          // HIER
        } else {
          this.sendMoveOrJumpMessage("JUMP", this.moveFrom, clickedPosition)
          this.moveFrom = null;
        }
      }

    },
    sendMessage(position, type){
      const message = {
        type: type,
        ring: position.ring,
        field: position.field,
        gamecode: this.getGamecode,
        uuid: this.getUuid
      };
      this.sendAction(message);
    },
    sendMoveOrJumpMessage(type, from, to){
      const message = {
        type: type,
        from: from,
        to: to,
        gamecode: this.getGamecode,
        uuid: this.getUuid
      };
      this.sendAction(message);
    },
    getGridItemState(index) {
      if (!this.getBoard) return "NO POSITION";
      if (!isIndexValidPosition(index)) return "NO POSITION";
      let position = translateIndexToRingAndField(index);
      return this.getBoard[position.ring][position.field];
    },
    getGridItemClass(index) {
      if (this.moveFrom) {
        const position = translateIndexToRingAndField(index);
        if (isIndexValidPosition(index) && this.moveFrom.ring === position.ring && this.moveFrom.field === position.field) {
          return 'blinking';
        }
      }
      return '';
    },
    isThisMyStone(index){
      const ownState = this.getIndex === 1 ? 'PLAYER1' : 'PLAYER2';
      return this.getGridItemState(index) === ownState
    },
    isThereAFreeNeighbourPosition(index){
      const position = translateIndexToRingAndField(index)
      const ring = position.ring
      const field = position.field

      let fieldMinusNeighbour = false;
      let fieldPlusNeighbour = false;
      let ringMinusNeighbour = false;
      let ringPlusNeighbour = false;

      if (field - 1 >= 0 ){
        fieldMinusNeighbour = this.getStateOnPosition(ring, field-1) === 'FREE'
      } else {
        fieldMinusNeighbour = this.getStateOnPosition(ring, 7) === 'FREE'
      }

      if (field + 1 <= 7){
        fieldPlusNeighbour = this.getStateOnPosition(ring, field+1) === 'FREE'
      } else {
        fieldPlusNeighbour = this.getStateOnPosition(ring, 0) === 'FREE'
      }

      if (ring % 2 == 1){
        if (ring - 1 >= 0){
          ringMinusNeighbour = this.getStateOnPosition(ring-1, field) === 'FREE'
        }
        if (ring + 1 <= 3){
          ringPlusNeighbour = this.getStateOnPosition(ring+1, field) === 'FREE'
        }
      }

      return fieldMinusNeighbour || fieldPlusNeighbour || ringMinusNeighbour || ringPlusNeighbour;


    },
  },
};
</script>

<style scoped>

.blinking {
  animation: blinker 2s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0.5;
  }
}

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
  width: 100%; /* Bild auf die Breite der Zelle strecken */
  height: 100%; /* Bild auf die Höhe der Zelle strecken */
  object-fit: cover; /* Bild so anpassen, dass es die gesamte Zelle ausfüllt */
}
</style>
