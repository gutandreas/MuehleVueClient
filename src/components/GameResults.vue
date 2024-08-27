<script>
import {mapGetters} from "vuex";

export default {
  name: 'GameResults',
  computed: {
    ...mapGetters(['getGamecode', 'getRound', 'getPlayer1Name', 'getPlayer1Color', 'getPlayer1Put', 'getPlayer1Lost', 'getPlayer1Killed', "getPlayer2Name", 'getPlayer2Lost', 'getPlayer2Killed', "getPlayer2Put", 'getPlayer2Color']),
  },
}

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
        <div id="player1" class="card m1">
          <div class="card-header text-center">
            <img :src="getPlayer1Color === 'BLACK' ? require('@/assets/game_images/StoneBlack.png') : require('@/assets/game_images/StoneWhite.png')"/>
            <labe>{{getPlayer1Color}}</labe>
            <h5>Spieler 1: {{ getPlayer1Name }}</h5>
          </div>
          <div class="card-body">
            <h5 class="m1">Steine gesetzt: {{ getPlayer1Put }}</h5>
            <h5 class="m1">Steine verloren: {{ getPlayer1Lost }}</h5>
            <h5 class="m1">Steine gewonnen: {{ getPlayer1Killed }}</h5>
          </div>
        </div>
        <div id="player2" class="card m1">
          <div class="card-header text-center">
            <img :src="getPlayer2Color === 'BLACK' ? require('@/assets/game_images/StoneBlack.png') : require('@/assets/game_images/StoneWhite.png')"/>
            <h5>Spieler 2: {{ getPlayer2Name }}</h5>
          </div>
          <div class="card-body">
            <h5 class="m1">Steine gesetzt: {{ getPlayer2Put }}</h5>
            <h5 class="m1">Steine verloren: {{ getPlayer2Lost }}</h5>
            <h5 class="m1">Steine gewonnen: {{ getPlayer2Killed }}</h5>
          </div>
        </div>


      </div>
    </div>
  </div>

</template>

<style scoped>

</style>