<script>
import stompService from '../stomp/stompService';
export default {
  name: "SetupForm",
  data() {
    return {
      games: [],
      modus: ["Computergegner", "Loginspiel", "Beobachten"],
      login: ["Spiel eröffnen", "Einem Spiel beitreten"],
      loginState: false,
      stoneColors: ["BLACK", "WHITE"],
      answers: {
        name: "",
        modus: "",
        level: "",
        join: "",
        color: "",
        firststone: "",
        gamecode: "",
      },
      stepOrder: [],
      step: 0,
      completed: false
    }
  },
  methods: {
    startGame() {
      const data = {
        "name": this.answers.name,
        "modus": this.answers.modus,
        "level": this.answers.level,
        "join": this.answers.join,
        "color": this.answers.color,
        "firststone": this.answers.firststone,
        "gamecode": this.answers.gamecode,

      }
      console.log(data)
      if (this.answers.modus === "c"){
        stompService.send("/manager/setup/computer", data)
      } else if (this.answers.modus === "l"){
        if (this.answers.join === "s"){
          stompService.send("/manager/setup/start", data)
        }
        else {
          stompService.send("/manager/setup/join", data)
        }

      } else {
        console.log(+"Ungültiger Modus / ungültiges Join")
      }

    },
    step0() {
      this.step = 1
      console.log(this.step)
      this.stepOrder.push(0)
    },
    step1() {
      this.answers.modus === "c" ? this.step = 2 : this.step = 3;
      console.log(this.step)
      this.stepOrder.push(1)
    },
    step2() {
      this.step = 5;
      console.log(this.step)
      this.stepOrder.push(2)
    },
    step3() {
      this.answers.join === "s" ? this.step = 4 : this.step = 5;
      console.log(this.step)
      this.stepOrder.push(3)
    },
    step4(color) {
      if (color === 'b') {
        console.log("Schwarz")
        this.answers.color = 'b'
      } else {
        console.log("Weiss")
        this.answers.color = 'w';
      }
      this.answers.join === "s" ? this.step = 5 : this.step = 6;
      this.step = 5;
      console.log(this.step);
      this.stepOrder.push(4)
    },
    step5() {
      this.step = 6;
      console.log(this.step);
      this.stepOrder.push(5)
    },


    goToPreviousStep() {
      console.log(this.stepOrder)
      this.step = this.stepOrder[this.stepOrder.length - 1];
      this.stepOrder.pop();

    },
    validateName() {
      this.answers.name = this.answers.name.toUpperCase().replace(/[^A-Z0-9]/g, '');
    },
    validateGameCode() {
      this.answers.gamecode = this.answers.gamecode.toUpperCase().replace(/[^A-Z0-9]/g, '');
      this.answers.gamecode === "" ? this.completed = false : this.completed = true;
    },
    getAllGames() {
      stompService.send('/admin/games/getall', "Abfrage Alle Games");
    },



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
  <div id="setup-form">

    <div class="card m-1">
      <div class="card-header text-center">
        <h5>Neues Spiel starten</h5>
      </div>
      <div class="card-body">

        <div v-if="step===0">
          <h5>Wähle deinen Spielernamen:</h5>
          <input
              type="text"
              class="form-control mb-2"
              placeholder="Spielername"
              id="spielerNameInput"
              v-model="this.answers.name"
              @input="validateName"
          >
          <button class="btn btn-primary" :disabled="this.answers.name.length===0" @click="step0">Weiter</button>

        </div>

        <div v-if="step === 1">
          <h5>Möchtest du gegen den Computergegner oder gegen einen eingeloggten Spieler antreten? Oder willst du ein
            bestehendes Spiel beobachten?</h5>

          <div class="form-check">
            <input
                type="radio"
                class="form-check-input"
                name="step1"
                v-model="this.answers.modus"
                value="c"
                @change="step1"
            />
            <label class="form-check-label">Computergegner</label>
          </div>
          <div class="form-check">
            <input
                type="radio"
                class="form-check-input"
                name="step1"
                v-model="this.answers.modus"
                value="l"
                @change="step1"
            />
            <label class="form-check-label">Loginspiel</label>
          </div>
          <div class="form-check">
            <input
                type="radio"
                class="form-check-input"
                name="step1"
                v-model="this.answers.modus"
                value="b"
                @change="step1"
            />
            <label class="form-check-label">Spiel beobachten</label>
          </div>
        </div>
        <div v-if="step===2">
          <h5>Wähle die Spielstärke des Computers</h5>
          <div class="form-check">
            <input
                type="radio"
                class="form-check-input"
                name="step2"
                v-model="this.answers.level"
                value="0"
                @change="step2"
            />
            <label class="form-check-label">Schwacher Computer</label>
          </div>
          <div class="form-check">
            <input
                type="radio"
                class="form-check-input"
                name="step2"
                v-model="this.answers.level"
                value="1"
                @change="step2"
            />
            <label class="form-check-label">Mittelstarker Computer</label>
          </div>
          <div class="form-check">
            <input
                type="radio"
                class="form-check-input"
                name="step2"
                v-model="this.answers.level"
                value="2"
                @change="step2"
            />
            <label class="form-check-label">Starker Computer</label>
          </div>

        </div>
        <div v-if="step===3">
          <h5>Möchtest du ein neues Spiel eröffnen oder einem Spiel beitreten?</h5>
          <div class="form-check">
            <input
                type="radio"
                class="form-check-input"
                value="s"
                name="login"
                v-model=answers.join
                @change="step3"
            />
            <label class="form-check-label">Neues Spiel eröffnen</label>
          </div>
          <div class="form-check">
            <input
                type="radio"
                class="form-check-input"
                value="j"
                name="login"
                v-model=answers.join
                @change="step3"

            />
            <label class="form-check-label">Einem bestehenden Spiel beitreten</label>
          </div>

        </div>
        <div v-if="step===4">
          <h5 class="form-label">Wähle deine Steinfarbe:</h5>

          <div class="text-center mt-3">
            <span><img id="stoneBlackImage" src="/StoneBlack.png" alt="Schwarzer Stein" class="stone-image"
                       @click="step4('b')"></span>
            <span><img id="stoneWhiteImage" src="/StoneWhite.png" alt="Weisser Stein" class="stone-image"
                       @click="step4('w')"></span>
          </div>
        </div>
        <div v-if="step===5">
          <h5>Welcher Spieler soll das Spiel eröffnen?</h5>
          <div class="form-check">
            <input
                type="radio"
                class="form-check-input"
                value="e"
                name="open"
                v-model=answers.firststone
                @change="step5"
            />
            <label class="form-check-label">Eigener Spieler</label>
          </div>
          <div class="form-check">
            <input
                type="radio"
                class="form-check-input"
                value="g"
                name="open"
                v-model=answers.firststone
                @change="step5"

            />
            <label class="form-check-label">Gegnerischer Spieler</label>
          </div>

        </div>
        <div v-if="step===6">
          <h5>Wähle einen Gamecode, damit sich dein Gegner mit dem Spiel verbinden kann:</h5>
          <input
              type="text"
              class="form-control"
              placeholder="Gamecode"
              id="gameCodeInput"
              v-model="this.answers.gamecode"
              @input="validateGameCode"
          >

        </div>


        <hr/>
        <div class="d-grid gap-2">
          <button class="btn btn-primary" :disabled=!this.completed @click="startGame">Spiel starten</button>
          <button class="btn btn-danger" :disabled="this.step === 0" @click="goToPreviousStep">Zurück</button>
        </div>
      </div>

    </div>
    <div class="card m-1">
      <div class="card-header text-center">
        <h5>Aktive Spiele zum Beobachten</h5>
      </div>
      <div class="card-body">
        <h5 class="card-title">Games</h5>
        <div class="row">
          <div class="col-md-4" v-for="(game, index) in games" :key="index">
            <span class="badge badge-primary p-3 d-block text-center text-white bg-dark">{{ game.gameCode }}</span>
          </div>
        </div>
      </div>
  </div>
  </div>

</template>

<style scoped>

.stone-image {
  width: 3.5em;
  height: 3.5em;
  cursor: pointer;
}




</style>