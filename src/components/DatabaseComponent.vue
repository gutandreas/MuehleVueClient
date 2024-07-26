<script>

export default {
  name: 'DatabaseComponent',
  props: {
    sendMessage: {
      type: Function,
      required: true,
    }

  },
  methods: {
    getAllGames(){
      const json = JSON.stringify({
        "category": "database",
        "command": "get",
        "elements": "games"

      })
      console.log(json)
      this.sendMessage(json);
    }
  }
}

</script>

<template>
  <div class="database-container">
    <div class="card m-1 next-step-card">
      <div class="card-header text-center">
        <h5>Datenbank</h5>
      </div>
      <div class="card-body">
        <button  @click="getAllGames">Alle Games abfragen</button>
        <button>Alle laufenden Games abfragen</button>
      </div>
    </div>
  </div>



</template>

<style scoped>

</style>