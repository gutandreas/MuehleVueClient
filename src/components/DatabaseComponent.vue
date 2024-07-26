<template>
  <div class="database-container">
    <div class="card m-1 next-step-card">
      <div class="card-header text-center">
        <h5>Datenbank</h5>
      </div>
      <div class="card-body">
        <button @click="sendMessage">Alle Games abfragen</button>
        <button @click="getRunningGames">Alle laufenden Games abfragen</button>

        <!-- Tabelle für die Darstellung der Nachrichten -->
        <table class="table">
          <thead>
          <tr>
            <th>Game Code</th>
            <th>Round</th>
            <th>Phase</th>
            <th>Finished</th>
            <th>Spectators</th>
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
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DatabaseComponent',
  data() {
    return {
      games: [], // Array zur Speicherung der empfangenen Nachrichten
    };
  },
  methods: {
    sendMessage() {
      // Verwende die globale Methode, um die Nachricht zu senden
      this.$sendMessage(this.$adminWebsocketUrl, JSON.stringify({
        category: "database",
        command: "get",
        element: "games"
      }));
    },
    handleMessage(message) {
      let jsonObject;

      if (typeof message === 'object') {
        jsonObject = message;
      } else {
        try {
          jsonObject = JSON.parse(message);
        } catch (error) {
          console.error('Error parsing message as JSON:', error);
          return;
        }
      }

      console.log(jsonObject);
      // Überprüfen, ob jsonObject ein Array ist
      if (Array.isArray(jsonObject)) {
        // Jedes Element im Array zu this.games hinzufügen
        this.games.push(...jsonObject);
      } else {
        // Falls nicht, nur das einzelne Objekt hinzufügen
        this.games.push(jsonObject);
      }
    }
  },
  mounted() {
    console.log("Test")
    this.$addMessageHandler(this.$adminWebsocketUrl, this.handleMessage);

  },
  beforeUnmount() {
    this.$removeMessageHandler(this.$adminWebsocketUrl, this.handleMessage);
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
