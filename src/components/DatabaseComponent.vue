<template>
  <div class="database-container">
    <div class="card m-1 next-step-card">
      <div class="card-header text-center">
        <h5>Datenbank</h5>
      </div>
      <div class="card-body">
        <button @click="sendMessage">Alle Games abfragen</button>
        <button @click="getActiveGames">Alle laufenden Games abfragen</button>

        <!-- Tabelle für die Darstellung der Nachrichten -->
        <table class="table">
          <thead>
          <tr>
            <th>Game Code</th>
            <th>Round</th>
            <th>Phase</th>
            <th>Finished</th>
            <th>Spectators</th>
            <th>Löschen</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(game, index) in games" :key="index">
            <td>{{ game.gameCode || 'N/A' }}</td>
            <td>{{ game.round !== undefined ? game.round : 'N/A' }}</td>
            <td>{{ game.phase || 'N/A' }}</td>
            <td>{{ game.finished !== undefined ? game.finished : 'N/A' }}</td>
            <td>
              <ul v-if="Array.isArray(game.spectators) && game.spectators.length">
                <li v-for="(spectator, sIndex) in game.spectators" :key="sIndex">{{ spectator }}</li>
              </ul>
              <p v-else>No spectators</p>
            </td>
            <td><button class="btn-danger" @click="deleteGame(game.gameCode)">Löschen</button> </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import stompService from '../stomp/stompService';

export default {
  name: 'DatabaseComponent',
  data() {
    return {
      games: [], // Array zur Speicherung der empfangenen Nachrichten
    };
  },
  methods: {
    setupGetActiveGames() {
      fetch(this.$hostname.concat('/manager/activegames'))
          .then(response => response.json())
          .then(data => {
            console.log('Data:', data);
            this.games = data; // Stellen Sie sicher, dass `this` korrekt verwendet wird
          })
          .catch(error => {
            console.error('Error:', error);
          });},

    getActiveGames() {
      stompService.send('/manager/activegames', "Abfrage Aktive Games")
    },
    deleteGame(gamecode) {

      stompService.send('/manager/delete', {gamecode: gamecode});
    }
  },
  mounted() {
    this.setupGetActiveGames();
  }
};
</script>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th, .table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.table th {
  background-color: #f4f4f4;
}

.table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.table tr:hover {
  background-color: #f1f1f1;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
</style>
