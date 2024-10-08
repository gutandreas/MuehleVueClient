<template>
  <div class="database-container">
    <div class="card m-1 next-step-card">
      <div class="card-header text-center">
        <h5>Datenbank</h5>
      </div>
      <div class="card-body">
        <button @click="getAllGames">Alle Games abfragen</button>
        <table class="table">
          <thead>
          <tr>
            <th>Game Code</th>
            <th>Spieler 1</th>
            <th>Spieler 2</th>
            <th>Runde</th>
            <th class="board-preview">Board</th>
            <th>Beendet</th>
            <th>Spectators</th>
            <th>Löschen</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(game, index) in games" :key="index">
            <td>{{ game.gameCode || 'N/A' }}</td>
            <td class="text-center" :class="game.pairing.player1.stonecolor === 'BLACK' ? 'black-player' : 'white-player'">
              {{ game.pairing.player1.name || 'N/A' }}
              <span class="badge" :class="{
                'bg-green': game.pairing.player1.currentPhase === 'PUT',
                'bg-yellow': game.pairing.player1.currentPhase === 'WAIT',
                'bg-red': game.pairing.player1.currentPhase === 'KILL',
                'bg-blue': game.pairing.player1.currentPhase === 'MOVE',
                'bg-orange': game.pairing.player1.currentPhase === 'JUMP',

              }">
              {{ translatePhase(game.pairing.player1.currentPhase)}}
            </span>
            </td>
            <td class="text-center" :class="game.pairing.player2.stonecolor === 'BLACK' ? 'black-player' : 'white-player'">
              {{ game.pairing.player2.name || 'N/A' }}
              <span class="badge" :class="{
                'bg-green': game.pairing.player2.currentPhase === 'PUT',
                'bg-yellow': game.pairing.player2.currentPhase === 'WAIT',
                'bg-red': game.pairing.player2.currentPhase === 'KILL',
                'bg-blue': game.pairing.player2.currentPhase === 'MOVE',
                'bg-orange': game.pairing.player2.currentPhase === 'JUMP',

              }">
              {{ translatePhase(game.pairing.player2.currentPhase) }}
            </span>
            </td>
            <td>{{ game.gameState.round !== undefined || g ? game.gameState.round : 'N/A' }}</td>
            <td class="board-preview"><MuehleBoardPreview :color1="game.pairing.player1.stonecolor" :color2="game.pairing.player2.stonecolor" :boardPositionsStates="game.board.boardPositionsStates" /></td>

            <td>{{ game.gameState.finished !== undefined ? game.gameState.finished ?  game.gameState.winnerIndex === 1 ? "Ja\nGewinner:\n" + game.pairing.player1.name :  "Ja\nGewinner:\n" + game.pairing.player2.name  : "Nein" : 'N/A' }}</td>
            <td>
              <ul v-if="Array.isArray(game.spectators) && game.spectators.length">
                <li v-for="(spectator, sIndex) in game.spectators" :key="sIndex">{{ spectator.name }}</li>
              </ul>
              <p v-else>---</p>
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
import MuehleBoardPreview from '../components/MuehleBoardPreview';

export default {
  name: 'DatabaseComponent',
  components: {MuehleBoardPreview},
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
    },
    translatePhase(phase) {
      switch (phase) {
        case 'PUT':
          return 'SETZEN';
        case 'WAIT':
          return 'WARTEN';
        case 'KILL':
          return 'ENTFERNEN';
        case 'MOVE':
          return 'VERSCHIEBEN';
        case 'JUMP':
          return 'SPRINGEN';
        default:
          return phase; // falls keine Übersetzung vorhanden ist
      }
  }},
  created() {
    stompService.subscribe('/topic/admin/games/getall', (message) => {
      try {
        const parsedMessage = typeof message.body === 'string' ? JSON.parse(message.body) : message.body;
        this.games = Array.isArray(parsedMessage) ? parsedMessage : [];
        console.log("Updated games:", this.games);
      } catch (error) {
        console.error("Failed to process message:", error);
      }
    });
    stompService.subscribe('/topic/admin/games/add', (message) => {
      try {
        const parsedMessage = typeof message.body === 'string' ? JSON.parse(message.body) : message.body;
        this.games.push(parsedMessage.game);
        console.log("Updated games:", this.games);
      } catch (error) {
        console.error("Failed to process message:", error);
      }
    });
    stompService.subscribe('/topic/admin/games/update', (message) => {
      try {
        console.log("Received message:", message.body);
        const parsedMessage = typeof message.body === 'string' ? JSON.parse(message.body) : message.body;

        console.log("Parsed message:", parsedMessage);


        const gameIndex = this.games.findIndex(game => game.gameCode === parsedMessage.game.gameCode);

        if (gameIndex !== -1) {
          // Ersetze das vorhandene Spiel, wenn es existiert
          this.games[gameIndex] = parsedMessage.game;
        } else {
          // Optional: Füge das Spiel hinzu, wenn es nicht existiert
          this.games.push(parsedMessage.game);
        }

        console.log("Updated games:", this.games);
      } catch (error) {
        console.error("Failed to process message:", error);
      }
    });},
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

.board-preview {
  width: 20%;
}

.black-player {
  background: black;
  -webkit-text-fill-color: white;
}

.white-player {
  background: whitesmoke;
  -webkit-text-fill-color: black;
}

.bg-green {
  background: green;
  display: flex;
  flex-direction: column; /* Die Elemente untereinander anordnen */
  justify-content: flex-end; /* Elemente zum unteren Rand ausrichten */
  height: 100%; /* Volle Höhe der Zelle */
}

.bg-red {
  background: red;
  display: flex;
  flex-direction: column; /* Die Elemente untereinander anordnen */
  justify-content: flex-end; /* Elemente zum unteren Rand ausrichten */
  height: 100%; /* Volle Höhe der Zelle */
}

.bg-blue {
  background: dodgerblue;
  display: flex;
  flex-direction: column; /* Die Elemente untereinander anordnen */
  justify-content: flex-end; /* Elemente zum unteren Rand ausrichten */
  height: 100%; /* Volle Höhe der Zelle */
}

.bg-orange {
  background: orange;
  display: flex;
  flex-direction: column; /* Die Elemente untereinander anordnen */
  justify-content: flex-end; /* Elemente zum unteren Rand ausrichten */
  height: 100%; /* Volle Höhe der Zelle */
}

.bg-yellow {
  background: yellow;
  -webkit-text-fill-color: black;
  display: flex;
  flex-direction: column; /* Die Elemente untereinander anordnen */
  justify-content: flex-end; /* Elemente zum unteren Rand ausrichten */
  height: 100%; /* Volle Höhe der Zelle */
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
</style>
