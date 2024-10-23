<script>
import stompService from "@/stomp/stompService";
import {mapGetters} from "vuex";

export default {
  name: "StatusDisplay",
  data() {
    return {
      messagetext: "",
    }
  },
  computed: {
    ...mapGetters(['getGamecode', 'getOwnName', 'getChathistory', 'getPhase', 'getCurrentIndex', 'getIndex', 'isFinished', 'getSpectatornName', 'isFinished']),
    // Annahme: Der gameCode wird im Store verwaltet und ist als Getter verfügbar
    gameCode() {
      return this.getGamecode;
    },
    ownName() {
      return this.getOwnName;
    },
    chatHistory() {
      return this.getChathistory;
    },
    phase(){
      return this.getPhase;
    },
    index(){
      return this.getIndex;
    },
    currentIndex() {
      return this.getCurrentIndex;
    },
    isPlayer(){
      return this.getIndex === 1 || this.getIndex === 2
    },
    finished(){
      return this.isFinished;
    },
    messageWritten(){
      return this.messagetext.trim().length > 0;
    },
  },
  methods: {
    sendChatMessage(){
      if (this.messageWritten){
        const gameCode  = this.gameCode;
        const data = {
          name: this.ownName,
          message: this.messagetext,
        }
        console.log(this.messagetext)
        stompService.send(`/chat/${gameCode}/messages`, data)
        this.messagetext = ""
      }
    },
    sendOffend(){
      const gameCode  = this.gameCode;
      const data = {
        name: this.ownName,
      }
      stompService.send(`/chat/${gameCode}/offend`, data)
    },

    sendCompliment(){
      const gameCode  = this.gameCode;
      const data = {
        name: this.ownName,

      }
      stompService.send(`/chat/${gameCode}/compliment`, data)
    },
    scrollDown(){
      this.$nextTick(() => {
        const textarea = document.getElementById('messageBox');
        if (textarea) {
          textarea.scrollTop = textarea.scrollHeight;
        }
      });
    },
    giveUp(){
      const confirmed = confirm("Willst du das Spiel tatsächlich aufgeben? Bestätige mit OK...")
      if (confirmed){
        const gameCode  = this.gameCode;
        const data = {
          gamecode: gameCode,
          index: this.getIndex
        }
        stompService.send(`/manager/setup/giveup`, data)
      }

    }
  },
  watch: {
    chatHistory() {
      this.scrollDown();
    }
  }
}

</script>

<template>
  <div class="status-container">
    <div class="card m-1 next-step-card" v-if="isPlayer">
      <div class="card-header text-center">
        <h5>Nächster Schritt</h5>
      </div>
      <div class="card-body">
        <label id="putPhaseLabel" class="w-100 text-light text-center rounded mb-1 border-1 step-label green-label"
               :class="{'active-label': phase === 'SET' && !finished, 'inactive-label': phase !== 'PUT' || finished}">SETZEN</label><br>
        <label id="movePhaseLabel" class="w-100 text-light text-center rounded mb-1 border-1 step-label blue-label"
               :class="{'active-label': phase === 'MOVE' && !finished, 'inactive-label': phase !== 'MOVE' || finished}">VERSCHIEBEN</label><br>
        <label id="killPhaseLabel" class="w-100 text-light text-center rounded mb-1 order-1 step-label red-label"
               :class="{'active-label': phase === 'KILL' && !finished, 'inactive-label': phase !== 'KILL' || finished}">ENTFERNEN</label><br>
        <label id="jumpPhaseLabel" class="w-100 text-light text-center rounded mb-1 order-1 step-label orange-label"
               :class="{'active-label': phase === 'JUMP' && !finished, 'inactive-label': phase !== 'JUMP' || finished}">SPRINGEN</label><br>
        <label id="waitPhaseLabel" class="w-100 text-light text-center rounded mb-1 order-1 step-label yellow-label"
               :class="{'active-label': phase === 'WAIT' && !finished, 'inactive-label': phase !== 'WAIT' || finished}">WARTEN</label><br>
      </div>
    </div>
    <div class="card m-1 chat-card">
      <div class="card-header text-center">
        <h5>Chat</h5>
      </div>
      <div class="card-body text-center mb-1">
        <textarea class="w-100 mb-1" id="messageBox" :value="chatHistory" type="text" readonly="true" rows="5"></textarea>
        <input class="w-100 mb-1" id="messageLine" type="text" placeholder="Nachricht hier eingeben..." v-model="messagetext" @keyup.enter.exact="sendChatMessage">
        <input :disabled=!messageWritten class="w-100 btn btn-dark mb-1" id="messageButton" type="button" value="Nachricht senden" @click="sendChatMessage">
        <input v-if="isPlayer" class="w-100 btn btn-secondary mb-1" id="complimentEnemyButton" type="button" value="Gegner loben" @click="sendCompliment">
        <input v-if="isPlayer" class="w-100 btn btn-secondary mb-1" id="offendEnemyButton" type="button" value="Gegner beleidigen" @click="sendOffend">
        <input v-if="isPlayer" class="w-100 btn btn-danger mb-1" :disabled=finished id="giveUpButton" type="button" value="💀 Spiel aufgeben 💀" @click="giveUp">
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-container {
  display: flex; /* Flexbox für Layout */
  flex-direction: column; /* Elemente untereinander anordnen */
  gap: 10px; /* Abstand zwischen den Karten */
}

.card {
  width: 100%; /* Karten nehmen die volle Breite des Containers ein */
}

.step-label {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: white;
  border-radius: 10px;
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 0 20px rgba(200, 200, 200, 0.5);
}

.green-label {
  background: limegreen;
  border-width: 3px;
  border-style: solid;
}

.blue-label {
  background: dodgerblue;
  border-width: 3px;
  border-style: solid;
}

.red-label {
  background: darkred;
  border-width: 3px;
  border-style: solid;
}

.orange-label {
  background: orangered;
  border-width: 3px;
  border-style: solid;
}

.yellow-label {
  background: darkgoldenrod;
  border-width: 3px;
  border-style: solid;
}

.active-label {
  animation: glow 1s infinite alternate;
}

.inactive-label {
  background: #666666;
  -webkit-text-fill-color: grey;
}

@keyframes glow {
  from {
    box-shadow: 0 0 10px rgba(50, 50, 50, 0.5);
    -webkit-text-fill-color: lightgray;
  }
  to {
    box-shadow: 0 0 20px rgba(200, 200, 200, 1);
    -webkit-text-fill-color: white;
  }
}

textarea {
  user-select: none; /* Verhindert das Markieren des Textes */
  overflow: auto; /* Ermöglicht das Scrollen */
  resize: none; /* Deaktiviert die Möglichkeit, das Textfeld zu vergrößern/verkleinern */
}
</style>
