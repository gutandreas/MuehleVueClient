<script>
import stompService from "@/stomp/stompService";

export default {
  name: 'Statistics',
  data(){
    return {
      numberOfActiveGames: 0,
      numberOfGamesTotal : 0,
      numberOfHumanPlayers: 0,
      numberOfSpectators: 0,
      activeHumanPlayers: [],


    }
  },
  computed: {
      numberOfActiveHumanPlayers() {
        return this.activeHumanPlayers.length;
    }
  },
  mounted() {
    stompService.subscribe('/topic/statistics/getall', (message) => {
      try {
        const parsedMessage = JSON.parse(message.body);
        this.numberOfGamesTotal = parsedMessage.numberOfGamesTotal;
        this.numberOfActiveGames = parsedMessage.numberOfActiveGames;
        this.numberOfHumanPlayers = parsedMessage.numberOfHumanPlayers;
        this.numberOfSpectators = parsedMessage.numberOfSpectators;
        this.activeHumanPlayers = parsedMessage.activeHumanPlayers;
        console.log("Grösse: " + this.activeHumanPlayers.length);
      } catch (error) {
        console.error("Failed to process message:", error);
      }
    });

    stompService.send('/statistics/getall', "")
  }
}

</script>

<template>
  <div class="statistics-container">
    <div class="card m-1 next-step-card">
      <div class="card-header text-center">
        <h5>Statistik</h5>
      </div>
      <div class="card-body">
        <h5>Spiele Total: {{numberOfGamesTotal}}</h5>
        <h5>Aktive Spiele: {{numberOfActiveGames}}</h5>
        <h5>Spieler Total: {{numberOfHumanPlayers}}</h5>
        <h5>Aktive Spieler: {{numberOfActiveHumanPlayers}}</h5>
        <div class="row">
        <div class="col-md-4" v-for="(player, index) in activeHumanPlayers" :key="index">
            <span class="badge badge-primary ms-0 me-0 mb-1 p-2 d-block text-center text-white bg-secondary"
                  style="cursor: pointer;">{{player.name}}</span>
        </div>
        </div>

        <h5>Beobachter Total: {{numberOfSpectators}}</h5>
      </div>
    </div>

  </div>

</template>

<style scoped>

</style>