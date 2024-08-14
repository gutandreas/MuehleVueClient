<template>
  <div class="database-container">
    <div class="card m-1 next-step-card">
      <div class="card-header text-center">
        <h5>Datenbank</h5>
      </div>
      <div class="card-body">
        <button @click="getAllGames">Alle Games abfragen</button>

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
            <td><button class="btn-danger" @click="deleteGame(game.gameCode)">Löschen</button></td>
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
      games: [],
    };
  },
  methods: {
    getAllGames() {
      stompService.send('/admin/games/getall', "Abfrage Alle Games");
    },
    deleteGame(gamecode) {
      stompService.send('/admin/games/delete', { gamecode: gamecode });
    }
  },
  created() {
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
    stompService.subscribe('/topic/admin/games/add', (message) => {
      try {
        // Direkte Verarbeitung als Array
        const parsedMessage = typeof message.body === 'string' ? JSON.parse(message.body) : message.body;

        // Setze das Array direkt in `games`
        this.games.push(parsedMessage);

        console.log("Updated games:", this.games);
      } catch (error) {
        console.error("Failed to process message:", error);
      }
    });
  },
  unmounted() {
    stompService.unsubscribe('/topic/admin');
    console.log("Games unsubscribed");
  },
  mounted() {
    this.getAllGames();
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
