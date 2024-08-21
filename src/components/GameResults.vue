<script>
import { mapGetters } from "vuex";
export default {
  name: 'GameResults',
  computed: {
    ...mapGetters(['getPlayer1Name', "getPlayer2Name"]),
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
        <h4>Spieler 2: {{getPlayer2Name}}</h4>


      </div>
    </div>
  </div>

</template>

<style scoped>

</style>