<template>
  <div class="database-container">
    <div class="card m-1 next-step-card">
      <div class="card-header text-center">
        <h5>Datenbank</h5>
      </div>
      <div class="card-body">
        <button @click="getAllGames">Alle Games abfragen</button>
        <button @click="getRunningGames">Alle laufenden Games abfragen</button>

        <!-- Tabelle für die Darstellung der Nachrichten -->
        <table v-if="messages.length" class="table">
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
          <tr v-for="(message, index) in messages" :key="index">
            <td>{{ message.gameCode || 'N/A' }}</td>
            <td>{{ message.round !== undefined ? message.round : 'N/A' }}</td>
            <td>{{ message.phase || 'N/A' }}</td>
            <td>{{ message.finished !== undefined ? message.finished : 'N/A' }}</td>
            <td>
              <ul v-if="Array.isArray(message.spectators) && message.spectators.length">
                <li v-for="(spectator, sIndex) in message.spectators" :key="sIndex">{{ spectator }}</li>
              </ul>
              <p v-else>No spectators</p>
            </td>
          </tr>
          </tbody>
        </table>
        <p v-else>No messages available.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DatabaseComponent',
  props: {
    sendMessage: {
      type: Function,
      required: true,
    },
    messages: {
      type: Array,
      required: true,
    }
  },
  methods: {
    getAllGames() {
      const json = JSON.stringify({
        "category": "database",
        "command": "get",
        "elements": "games"
      });
      console.log('Sending request:', json);
      this.sendMessage(json);
    },
    getRunningGames() {
      const json = JSON.stringify({
        "category": "database",
        "command": "get",
        "elements": "runningGames"
      });
      console.log('Sending request:', json);
      this.sendMessage(json);
    }
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
