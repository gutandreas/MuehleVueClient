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
            @click="handlePointClick(index)"
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
import stompService from '../stomp/stompService';
import { isIndexValidPosition, translateIndexToRingAndField } from '@/jsTools/muehleBoardTools';
import { mapGetters, mapActions } from "vuex";

export default {
  name: 'MuehleBoard',
  computed: {
    ...mapGetters(['getBoard', "getGamecode", "getUuid"]),
  },
  methods: {
    ...mapActions(['sendAction', 'updateGame']),

    handlePointClick(index) {
      if (!isIndexValidPosition(index)){
        console.log("Ungültige Position angeklickt")
        return
      }
      console.log("Index: " + index);
      let position = translateIndexToRingAndField(index);
      console.log(position.ring + "/" + position.field);
      const message = {
        type: "put",
        ring: position.ring,
        field: position.field,
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
    }
  },
  mounted() {
    stompService.subscribe('/topic/game/gameupdate', (message) => {
      try {
        const parsedMessage = JSON.parse(message.body);
        this.updateGame(parsedMessage);
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
