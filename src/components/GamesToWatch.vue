<script >

import stompService from "@/stomp/stompService";

export default {
  name: "GamesToWatch",
  data() {
    return {
      games: []
    }
  },
  mounted() {
    stompService.subscribe('/topic/admin/games/getall', (message) => {
      try {
        // Direkte Verarbeitung als Array
        const parsedMessage = typeof message.body === 'string' ? JSON.parse(message.body) : message.body;

        // Setze das Array direkt in `games`
        this.games = Array.isArray(parsedMessage) ? parsedMessage : [];

        console.log("Updated games:", this.games);
      } catch (error) {
        console.error("Failed to process message:", error);
      }
    });
    this.getAllGames();
  }
}

</script>

<template>

  <div class="card m-1">
    <div class="card-header text-center">
      <h5>Neues Spiel starten</h5>
    </div>
    <div class="card-body">
      <a href="#" class="badge badge-pill badge-primary">Label 1</a>
      <a href="#" class="badge badge-pill badge-success">Label 2</a>
      <a href="#" class="badge badge-pill badge-danger">Label 3</a>
      <a href="#" class="badge badge-pill badge-warning">Label 4</a>
    </div>
  </div>


</template>

<style scoped>

</style>