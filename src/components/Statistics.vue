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
        this.updateGame(parsedMessage);
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
        <h5>Aktive Spiele: {{numberOfActiveGames}}</h5>
        <h5>Spiele Total: {{numberOfGamesTotal}}</h5>
        <h5>Spieler Total: {{numberOfHumanPlayers}}</h5>
        <h5>Beobachter Total: {{numberOfSpectators}}</h5>
      </div>
    </div>

  </div>

</template>

<style scoped>

</style>