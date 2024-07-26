<template>
  <div class="password-prompt-container d-flex center-panel">
    <div class="card p-4 shadow-sm" style="max-width: 400px; width: 100%;">
      <h3 class="card-title text-center mb-4">Bitte Passwort für Admin-Bereich eingeben:</h3>
      <div class="card-body">
        <input
            type="password"
            class="form-control mb-3"
            v-model="password"
            @keyup.enter="checkPassword"
            placeholder="Passwort"
        />
        <button
            class="btn btn-primary w-100"
            @click="checkPassword"
        >
          Einloggen
        </button>
        <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    checkPassword() {
      const adminPassword = "Passwort"; // Die tatsächliche Passwortüberprüfung sollte sicherer gehandhabt werden
      if (this.password === adminPassword) {
        localStorage.setItem('admin-password', this.password);
        this.$router.push('/admin'); // Weiterleiten zum Admin-Bereich
      } else {
        this.errorMessage = 'Falsches Passwort!';
      }
    }
  }
};
</script>

<style scoped>

.card {
  max-width: 400px;
  width: 100%;
}

.center-panel {
  margin: 3%;
  grid-area: center;
  align-items: center; /* Zentriert das Spielfeld vertikal */
  justify-content: center; /* Zentriert das Spielfeld horizontal */
  width: 100%;
  height: 100%;
  border-top: 2px solid #fff; /* Optional: Border zur Trennung */
}
</style>
