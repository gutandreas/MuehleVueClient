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
        <h6><i class="fas fa-chess-pawn" style="color: gray;"></i> {{numberOfGamesTotal}} Games total </h6>
        <h6><i class="fas fa-chess-pawn" style="color: green;"></i> {{numberOfActiveGames}} Games aktiv</h6>
        <h6><i class="fas fa-user" style="color: gray;"></i> {{numberOfHumanPlayers}} Player total</h6>
        <h6><i class="fas fa-user" style="color: green;"></i> {{numberOfActiveHumanPlayers}} Player aktiv</h6>
        <div class="row">
        <div class="col-md-4" v-for="(player, index) in activeHumanPlayers" :key="index">
            <span class="badge badge-primary ms-0 me-0 mb-1 p-2 d-block text-center text-white bg-secondary"
                  style="cursor: pointer;">{{player.name}}</span>
        </div>
        </div>

        <h6><i class="fas fa-eye" style="color: black"></i> Beobachter Total: {{numberOfSpectators}}</h6>
      </div>
    </div>

  </div>

</template>

<style scoped>

</style>