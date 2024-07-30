<template>
  <div class="json-generator-container">
    <div class="card m-1 next-step-card">
      <div class="card-header text-center">
        <h5>JSON Generator</h5>
      </div>
      <div class="card-body p-2">
        <div class="input-group mb-3 p-2">
          <label for="key" class="form-label p-2">Schlüssel:</label>
          <input
              v-model="key"
              id="key"
              class="form-control"
              placeholder="Geben Sie den Schlüssel ein"
              @keyup.enter="addKeyValue"
          />
        </div>
        <div class="input-group mb-3">
          <label for="value" class="form-label">Wert:</label>
          <input
              v-model="value"
              id="value"
              class="form-control"
              placeholder="Geben Sie den Wert ein"
              @keyup.enter="addKeyValue"
          />
        </div>
      </div>
      <div class="json-result">
        <h5>JSON Ergebnis:</h5>
        <pre>{{ jsonResult }}</pre>
      </div>

        <div class="button-group mb-3">
          <button class="btn btn-primary" @click="addKeyValue">Hinzufügen</button>
          <button class="btn btn-secondary" @click="reset">Zurücksetzen</button>
        </div>
        <div class="input-group mb-3">
          <label for="urlExtension" class="form-label">Pfaderweiterung:</label>
          <input
              v-model="urlExtension"
              id="urlExtension"
              class="form-control"
              placeholder="Geben Sie die Pfaderweiterung ein"
          />
        </div>
        <div class="button-group mb-3">
        <button class="btn btn-success" @click="sendJson">Senden</button>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JsonGenerator',
  data() {
    return {
      key: '',
      value: '',
      jsonObject: {},
      urlExtension: '', // Neue Instanzvariable
    };
  },
  computed: {
    jsonResult() {
      // JSON-Formatierung für die Anzeige
      return JSON.stringify(this.jsonObject, null, 2);
    }
  },
  methods: {
    addKeyValue() {
      if (this.key.trim() === '' || this.value.trim() === '') {
        alert('Bitte geben Sie sowohl Schlüssel als auch Wert ein.');
        return;
      }

      // Fügen Sie das Schlüssel-Wert-Paar dem JSON-Objekt hinzu
      this.jsonObject = { ...this.jsonObject, [this.key]: this.value };

      // Zurücksetzen der Eingabefelder
      this.key = '';
      this.value = '';

      // Fokus zurück auf das Schlüssel-Eingabefeld setzen
      this.$nextTick(() => {
        this.$refs.key.focus();
      });
    },
    reset() {
      this.jsonObject = {};
      this.key = '';
      this.value = '';
      this.urlExtension = ''; // Auch die neue Instanzvariable zurücksetzen
    },
    sendJson() {
      // Hier wird die Pfaderweiterung verwendet, um die WebSocket-URL zu modifizieren, falls erforderlich
      const fullUrl = `${this.$gameWebsocketUrl}/${this.urlExtension}`;
      console.log('JSON Ergebnis:', this.jsonResult);
      console.log('WebSocket URL:', fullUrl);
      this.$sendMessage(fullUrl);
    }
  }
};
</script>

<style scoped>
/* Stile für die Pfaderweiterung können hier hinzugefügt werden */
</style>
