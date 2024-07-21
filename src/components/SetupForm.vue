<script >
export default {
  name: "SetupForm",
  data() {
    return {
      modus: ["Computergegner", "Loginspiel", "Beobachten"],
      login: ["Spiel eröffnen", "Einem Spiel beitreten"],
      loginState: false,
      stoneColors: ["BLACK", "WHITE"],
      answers: {
        a0: "a0",
        a1: "a1",
        a2: "a2",
        a3: "a3",
        a4: "a4",
        a5: "a5",
      },
      stepOrder: [],
      step: 0,
      completed: false
    }
  },
  methods: {
    startGame(){
      console.log(this.game)
    },
    step0(){
      this.step=1
      console.log(this.step)
      this.stepOrder.push(0)
    },
    step1(){
      this.answers.a1 === "c" ? this.step = 2 : this.step = 3;
      console.log(this.step)
      this.stepOrder.push(1)
    },
    step2(){
      this.step=5;
      console.log(this.step)
      this.stepOrder.push(2)
    },
    step3(){
      this.answers.a3 === "s"? this.step = 4 : this.step = 5;
      console.log(this.step)
      this.stepOrder.push(3)
    },
    step4(color){
      if (color === 'b') {
        console.log("Schwarz")
        this.answers.a4 = 'b'
      } else {
        console.log("Weiss")
        this.answers.a4 = 'w';
      }
      this.step = 5;
      console.log(this.step);
      this.stepOrder.push(4)
    },

    goToPreviousStep(){
      console.log(this.stepOrder)
      this.step = this.stepOrder[this.stepOrder.length - 1];
      this.stepOrder.pop();

    },
    validateName() {
      this.answers.a0 = this.answers.a0.toUpperCase().replace(/[^A-Z0-9]/g, '');
    },
    validateGameCode() {
      this.answers.a5 = this.answers.a5.toUpperCase().replace(/[^A-Z0-9]/g, '');
      this.answers.a5 === "" ? this.completed = false : this.completed = true;
    },



    sendHttpRequest(){
      const url = this.$hostname.concat("/setup");
      console.log(url)
      fetch( url, {
        method: 'POST',
        body: JSON.stringify({
          "name" : this.answers.a0,
          "modus": this.answers.a1,
          "level" : this.answers.a2,
          "start/join" : this.answers.a3,
          "color" : this.answers.a4,
          "gameCode": this.answers.a5,

        }),
        headers: {
          "Content-type": "application/json"
        }
      })
          .then(res => {

            if (!res.ok) {
              return res.text().then(text => {
                throw new Error(`HTTP Error: ${res.status} ${text}`);
              });
            }
            return res.json();
          })
          .then(responseData => {
            console.log(responseData);
          })
          .catch(error => {
            // Fehlerbehandlung und -ausgabe
            console.error('Fetch error:', error);
            alert('Fehler: ' + error.message); // Zeigt den Fehler in einem Alert an
          });
    }


  }
}

</script>

<template>
  <div id="setup-form">
    {{ game }}
    <div class="card">
      <div class="card-header text-center">
        <h5>Neues Spiel starten</h5>
      </div>
      <div class="card-body">

        <h3>Spieleinstellungen</h3>

        <div class="form-check align-items-center" v-if="step===0">
          <h5>Wähle deinen Spielernamen:</h5>
          <input
              type="text"
              class="form-control"
              placeholder="Spielername"
              id="spielerNameInput"
              v-model="this.answers.a0"
              @input="validateName"
          >
          <button class="btn btn-primary" :disabled="this.answers.a0.length===0" @click="step0">Weiter</button>

        </div>

        <div v-if="step === 1">
          <h5>Möchtest du gegen den Computergegner oder gegen einen eingeloggten Spieler antreten? Oder willst du ein bestehendes Spiel beobachten?</h5>
          <div class="form-check align-items-center">
            <div class="form-check">
              <input
                  type="radio"
                  class="form-check-input"
                  name="step1"
                  v-model="this.answers.a1"
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
                  v-model="this.answers.a1"
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
                  v-model="this.answers.a1"
                  value="b"
                  @change="step1"
              />
              <label class="form-check-label">Spiel beobachten</label>
            </div>
          </div>
        </div>
        <div v-if="step===2">
          <h5>Wähle die Spielstärke des Computers</h5>
          <div class="form-check">
            <input
                type="radio"
                class="form-check-input"
                name="step2"
                v-model="this.answers.a2"
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
                v-model="this.answers.a2"
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
                v-model="this.answers.a2"
                value="2"
                @change="step2"
            />
            <label class="form-check-label">Starker Computer</label>
          </div>

        </div>
        <div v-if="step===3">
        <div class="form-check align-items-center">
          <h5 class="form-label">Möchtest du ein neues Spiel eröffnen oder einem Spiel beitreten?</h5>
          <div class="form-check">
          <input
              type="radio"
              class="form-check-input ms-3"
              value="s"
              name="login"
              v-model=answers.a3
              @change="step3"
          />
          <label class="form-check-label">Neues Spiel eröffnen</label>
          </div>
          <div class="form-check">
          <input
              type="radio"
              class="form-check-input ms-3"
              value="j"
              name="login"
              v-model=answers.a3
              @change="step3"

          />
          <label class="form-check-label">Einem bestehenden Spiel beitreten</label>
          </div>

        </div>
        </div>
        <div v-if="step===4">
          <h5 class="form-label">Wähle deine Steinfarbe:</h5>

          <div class="text-center mt-3">
            <span><img id="stoneBlackImage" src="/StoneBlack.png" alt="Schwarzer Stein" class="stone-image" @click="step4('b')"></span>
            <span><img id="stoneWhiteImage" src="/StoneWhite.png" alt="Weisser Stein" class="stone-image" @click="step4('w')"></span>
          </div>
        </div>
        <div v-if="step===5">
          <div class="form-check align-items-center">
            <h5>Wähle einen Gamecode, damit sich dein Gegner mit dem Spiel verbinden kann:</h5>
            <input
                type="text"
                class="form-control"
                placeholder="Gamecode"
                id="gameCodeInput"
                v-model="this.answers.a5"
                @input="validateGameCode"
                >

          </div>
        </div>





        <hr />
        <div class="d-grid gap-2">
          <button class="btn btn-primary" :disabled=!this.completed @click="sendHttpRequest">Eintragen</button>
          <button class="btn btn-danger" @click="goToPreviousStep">Zurück</button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>

.stone-image{
  width: 3.5em;
  height: 3.5em;
  cursor: pointer;
}
.stone-color-circle {
  position: relative;
  width: 50px;
  height: 50px;
  display: inline-block;
  border-radius: 50%; /* Runde Form */
  cursor: pointer;
  background-color: transparent;
  border: 2px solid transparent; /* Default border */
}





.stone-color-circle::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border-color: gray;
  background-color: transparent; /* Graue Farbe des inneren Kreises */
}

</style>