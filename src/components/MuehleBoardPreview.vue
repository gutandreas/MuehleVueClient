<template>
  <div class="muehle-board rounded-3">
    <!-- Hintergrundbild -->
    <div class="board-background"></div>

    <!-- Punkte auf dem Spielfeld -->
    <div
        v-for="(point, index) in points"
        :key="index"
        class="point"
        :style="getPointStyle(point)"
    >
      <!-- Bedingte Anzeige der Steine -->
      <img
          :src="imagePath(boardPositionsStates[point.ring][point.field])"
          class="stone"
          alt="Stone"
      />
    </div>
  </div>
</template>

<script>
import stompService from '../stomp/stompService';
import {mapGetters} from "vuex";

export default {
  name: 'MuehleBoardPreview',
  props: {
    boardPositionsStates: {
      type: Array,
      required: true
    },
    color1: {
      type: String,
      required: true
    },
    color2: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      points: [
        {ring: 0, field: 0, top: '2%', left: '2%'},
        {ring: 0, field: 1, top: '2%', left: '45%'},
        {ring: 0, field: 2, top: '2%', left: '88%'},
        {ring: 0, field: 3, top: '45%', left: '88%'},
        {ring: 0, field: 4, top: '88%', left: '88%'},
        {ring: 0, field: 5, top: '88%', left: '45%'},
        {ring: 0, field: 6, top: '88%', left: '2%'},
        {ring: 0, field: 7, top: '45%', left: '2%'},
        {ring: 1, field: 0, top: '17%', left: '17%'},
        {ring: 1, field: 1, top: '17%', left: '45%'},
        {ring: 1, field: 2, top: '17%', left: '73%'},
        {ring: 1, field: 3, top: '45%', left: '73%'},
        {ring: 1, field: 4, top: '73%', left: '73%'},
        {ring: 1, field: 5, top: '73%', left: '45%'},
        {ring: 1, field: 6, top: '73%', left: '17%'},
        {ring: 1, field: 7, top: '45%', left: '17%'},
        {ring: 2, field: 0, top: '31%', left: '31%'},
        {ring: 2, field: 1, top: '31%', left: '45%'},
        {ring: 2, field: 2, top: '31%', left: '59%'},
        {ring: 2, field: 3, top: '45%', left: '59%'},
        {ring: 2, field: 4, top: '59%', left: '59%'},
        {ring: 2, field: 5, top: '59%', left: '45%'},
        {ring: 2, field: 6, top: '59%', left: '31%'},
        {ring: 2, field: 7, top: '45%', left: '31%'},
      ]
    };
  },
  computed: {
    ...mapGetters(['getGamecode', 'getOwnName', 'getChathistory', 'getPhase', 'getCurrentIndex', 'getIndex', 'isFinished']),
  },
  methods: {
    getPointStyle(point) {
      return {
        top: point.top,
        left: point.left
      };
    },
    imagePath(positionState) {
      if (positionState === 'PLAYER1') {
        return this.color1 === "BLACK"
            ? require('@/assets/game_images/StoneBlack.png')
            : require('@/assets/game_images/StoneWhite.png');
      }
      if (positionState === 'PLAYER2') {
        return this.color2 === "BLACK"
            ? require('@/assets/game_images/StoneBlack.png')
            : require('@/assets/game_images/StoneWhite.png');
      }
      return require('@/assets/game_images/FullyTransparent.png');
    },
    handlePointClick(point) {
      console.log(point.ring + "/" + point.field);
      const message = JSON.stringify({
        ring: point.ring,
        field: point.field,
      });
      stompService.send('/app/game/action', message);
    },
  }
};
</script>

<style scoped>
.muehle-board {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%; /* Macht das Element quadratisch */
  background-color: #f0f0f0; /* Hintergrundfarbe, falls das Bild nicht geladen wird */
  overflow: hidden; /* Verhindert, dass das Hintergrundbild oder Punkte außerhalb des Containers angezeigt werden */
}

.board-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('../assets/game_images/Spielfeld.png') no-repeat center center;
  background-size: cover; /* Dehnt das Hintergrundbild aus, um den gesamten Container zu bedecken */
  z-index: 1;
}

.point {
  position: absolute;
  width: 10%; /* Größe der Punkte */
  height: 10%; /* Größe der Punkte */
  z-index: 1; /* Stellt sicher, dass die Punkte über dem Hintergrundbild liegen */
}

.stone {
  position: absolute;
  width: 100%; /* Größe der Steine anpassen */
  height: auto; /* Höhe automatisch basierend auf der Breite */
}
</style>
