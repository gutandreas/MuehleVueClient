<script>
import { mapGetters } from "vuex";

export default {
  name: "GameResults",
  computed: {
    ...mapGetters([
      "getGamecode",
      "getRound",
      "getPlayer1Name",
      "getPlayer1Color",
      "getPlayer1Put",
      "getPlayer1Lost",
      "getPlayer1Killed",
      "getPlayer1Phase",
      "getPlayer2Name",
      "getPlayer2Color",
      "getPlayer2Put",
      "getPlayer2Lost",
      "getPlayer2Killed",
      "getPlayer2Phase",
      "getIndex",
      "getSpectators"
    ]),
    spectators(){
      return this.getSpectators;
    }
  },
};
</script>

<template>
  <div id="game-results">
    <div class="card m-1">
      <div class="card-header text-center">
        <h5>Spielstand</h5>
      </div>
      <div class="card-body">
        <h4>Game: {{ getGamecode }}</h4>
        <h4>Runde: {{ getRound }}</h4>

        <!-- Player 1 Card -->
        <div
            id="player1"
            class="card m-1"
            :class="[
            getIndex === 1 ? 'own-player' : '',
            getPlayer1Phase !== 'WAIT' ? 'active-player' : ''
          ]"
        >
          <div class="card-header text-center">
            <img
                class="stone-image"
                :src="getPlayer1Color === 'BLACK'
                ? require('@/assets/game_images/StoneBlack.png')
                : require('@/assets/game_images/StoneWhite.png')"
            />
            <h5>Spieler 1: {{ getPlayer1Name }}</h5>
          </div>
          <div class="card-body">
            <h5 class="m-1">Steine gesetzt: {{ getPlayer1Put }}</h5>
            <h5 class="m-1">Steine verloren: {{ getPlayer1Lost }}</h5>
            <h5 class="m-1">Steine gewonnen: {{ getPlayer1Killed }}</h5>
          </div>
        </div>

        <!-- Player 2 Card -->
        <div
            id="player2"
            class="card m-1"
            :class="[
            getIndex === 2 ? 'own-player' : '',
            getPlayer2Phase !== 'WAIT' ? 'active-player' : ''
          ]"
        >
          <div class="card-header text-center">
            <img
                class="stone-image"
                :src="getPlayer2Color === 'BLACK'
                ? require('@/assets/game_images/StoneBlack.png')
                : require('@/assets/game_images/StoneWhite.png')"
            />
            <h5>Spieler 2: {{ getPlayer2Name }}</h5>
          </div>
          <div class="card-body">
            <h5 class="m-1">Steine gesetzt: {{ getPlayer2Put }}</h5>
            <h5 class="m-1">Steine verloren: {{ getPlayer2Lost }}</h5>
            <h5 class="m-1">Steine gewonnen: {{ getPlayer2Killed }}</h5>
          </div>
        </div>

        <div class="card m-1">
          <div class="card-header text-center">
            <h5>Zuschauer</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-4" v-for="(spectator, index) in spectators" :key="index">
            <span class="badge badge-primary ms-0 me-0 mb-1 p-2 d-block text-center text-white bg-dark">{{ spectator.name }}</span>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>



<style scoped>
.stone-image {
  width: 50px;
  height: auto;
}

.active-player {
  border: 3px solid cornflowerblue;
  border-radius: 10px;
}

.own-player h5 {
  font-weight: bold;
}
</style>
