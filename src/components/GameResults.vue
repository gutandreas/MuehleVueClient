<script>
import { mapGetters } from "vuex";
export default {
  name: 'GameResults',
  computed: {
    ...mapGetters(['getPlayer1Name', 'getPlayer1Put','getPlayer1Lost', 'getPlayer1Killed', "getPlayer2Name", 'getPlayer2Lost', 'getPlayer2Killed',"getPlayer2Put"]),
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
        <h4>Spieler 1: {{getPlayer1Name}}</h4>
        <h5>Steine gesetzt: {{getPlayer1Put}}</h5>
        <h5>Steine verloren: {{getPlayer1Lost}}</h5>
        <h5>Steine gewonnen: {{getPlayer1Killed}}</h5>
        <h4>Spieler 2: {{getPlayer2Name}}</h4>
        <h5>Steine gesetzt: {{getPlayer2Put}}</h5>
        <h5>Steine verloren: {{getPlayer2Lost}}</h5>
        <h5>Steine gewonnen: {{getPlayer2Killed}}</h5>


      </div>
    </div>
  </div>

</template>

<style scoped>

</style>