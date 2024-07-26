<script>
export default {
  name: "StatusDisplay",
  data() {
    return {
      messagetext: "",
    }
  },
  methods: {
    sendChatMessage(){
      console.log(this.messagetext)
      this.messagetext = ""
    }
  }
}

</script>

<template>
  <div class="status-container">
    <div class="card m-1 next-step-card">
      <div class="card-header text-center">
        <h5>Nächster Schritt</h5>
      </div>
      <div class="card-body">
        <label id="putPhaseLabel" class="w-100 text-light text-center rounded mb-1 border-1 step-label green-label active-label">SETZEN</label><br>
        <label id="movePhaseLabel" class="w-100 text-light text-center rounded mb-1 border-1 step-label blue-label inactive-label">VERSCHIEBEN</label><br>
        <label id="killPhaseLabel" class="w-100 text-light text-center rounded mb-1 order-1 step-label red-label inactive-label">ENTFERNEN</label><br>
        <label id="spielverlaufLabel">asdf</label>
      </div>
    </div>
    <div class="card m-1 chat-card">
      <div class="card-header text-center">
        <h5>Chat</h5>
      </div>
      <div class="card-body text-center mb-1">
        <textarea class="w-100 mb-1" id="messageBox" type="text" readonly="true" rows="5"></textarea>
        <input class="w-100 mb-1" id="messageLine" type="text" placeholder="Nachricht hier eingeben..." v-model="messagetext" @keyup.enter.exact="sendChatMessage">
        <input class="w-100 btn btn-dark mb-1" id="messageButton" type="button" value="Nachricht senden" @click="sendChatMessage">
        <input class="w-100 btn btn-secondary mb-1" id="complimentEnemyButton" type="button" value="Gegner loben" @click="complimentEnemy">
        <input class="w-100 btn btn-secondary mb-1" id="offendEnemyButton" type="button" value="Gegner beleidigen" @click="offendEnemy">
        <input class="w-100 btn btn-danger mb-1" id="giveUpButton" type="button" value="💀 Spiel aufgeben 💀" @click="giveUp">
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
</style>
