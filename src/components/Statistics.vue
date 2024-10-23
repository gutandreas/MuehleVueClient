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
      numberOfComputerGamesLevel1: 0,
      numberOfGamesWonByComputerLevel1: 0,
      numberOfComputerGamesLevel2: 0,
      numberOfGamesWonByComputerLevel2: 0,
      numberOfComputerGamesLevel3: 0,
      numberOfGamesWonByComputerLevel3: 0,

    }
  },
  computed: {
      numberOfActiveHumanPlayers() {
        return this.activeHumanPlayers.length;
    },
  },
  methods: {
    getGamesWonByComputerInPercent(level){
      switch (level) {
        case 1:
          return this.numberOfGamesWonByComputerLevel1 / this.numberOfComputerGamesLevel1 * 100;
        case 2:
          return this.numberOfGamesWonByComputerLevel2 / this.numberOfComputerGamesLevel2 * 100;
        case 3:
          return this.numberOfGamesWonByComputerLevel3 / this.numberOfComputerGamesLevel3 * 100;
        default:
          return null;
      }

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
        this.numberOfComputerGamesLevel1 = parsedMessage.computerGameNumbers[0].numberOfComputerGames;
        this.numberOfGamesWonByComputerLevel1 = parsedMessage.computerGameNumbers[0].numberOfGamesWonByComputer;
        this.numberOfComputerGamesLevel2 = parsedMessage.computerGameNumbers[1].numberOfComputerGames;
        this.numberOfGamesWonByComputerLevel2 = parsedMessage.computerGameNumbers[1].numberOfGamesWonByComputer;
        this.numberOfComputerGamesLevel3 = parsedMessage.computerGameNumbers[2].numberOfComputerGames;
        this.numberOfGamesWonByComputerLevel3 = parsedMessage.computerGameNumbers[2].numberOfGamesWonByComputer;



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
        <div class="section">
        <h5>Games</h5>
        <h6><i class="fas fa-chess-pawn" style="color: gray;"></i> {{numberOfGamesTotal}} Games total </h6>
        <h6><i class="fas fa-chess-pawn" style="color: green;"></i> {{numberOfActiveGames}} Games aktiv</h6>
        </div>
        <div class="section">
        <h5>Player</h5>
        <h6><i class="fas fa-user" style="color: gray;"></i> {{numberOfHumanPlayers}} Player total</h6>
        <h6><i class="fas fa-user" style="color: green;"></i> {{numberOfActiveHumanPlayers}} Player aktiv</h6>
        <div class="row">
        <div class="col-md-4" v-for="(player, index) in activeHumanPlayers" :key="index">
            <span class="badge badge-primary ms-0 me-0 mb-1 p-2 d-block text-center text-white bg-secondary"
                  style="cursor: pointer;">{{player.name}}</span>
        </div>
        </div>
        </div>
        <div class="section">
          <h5>Computer Player</h5>
          <h6>Schwacher Computer</h6>
          <h6><i class="fas fa-list-ol" style="color: gray"></i> {{this.numberOfComputerGamesLevel1}} Games vom Computer gespielt</h6>
          <h6><i class="fas fa-trophy" style="color: darkgoldenrod;"></i> {{this.numberOfGamesWonByComputerLevel1}} Games vom Computer gewonnen</h6>
          <h6><i class="fas fa-pie-chart" style="color: green"></i> {{ this.getGamesWonByComputerInPercent(1) }}% der
            Games gewonnen</h6>
          <h6>Mittelstarker Computer</h6>
          <h6><i class="fas fa-list-ol" style="color: gray"></i> {{this.numberOfComputerGamesLevel2}} Games vom Computer gespielt</h6>
          <h6><i class="fas fa-trophy" style="color: darkgoldenrod;"></i> {{this.numberOfGamesWonByComputerLevel2}} Games vom Computer gewonnen</h6>
          <h6><i class="fas fa-pie-chart" style="color: green"></i> {{ this.getGamesWonByComputerInPercent(2) }}% der
            Games gewonnen</h6>
          <h6>Starker Computer</h6>
          <h6><i class="fas fa-list-ol" style="color: gray"></i> {{this.numberOfComputerGamesLevel3}} Games vom Computer gespielt</h6>
          <h6><i class="fas fa-trophy" style="color: darkgoldenrod;"></i> {{this.numberOfGamesWonByComputerLevel3}} Games vom Computer gewonnen</h6>
          <h6><i class="fas fa-pie-chart" style="color: green"></i> {{ this.getGamesWonByComputerInPercent(3) }}% der
            Games gewonnen</h6>
        </div>
<!--        <div class="section">
          <h5>Beobachter</h5>
          <h6><i class="fas fa-eye" style="color: black"></i> Beobachter Total: {{numberOfSpectators}}</h6>
        </div>-->

      </div>





      </div>
    </div>


</template>

<style scoped>
.section {
  margin-bottom: 7%;
}

</style>