<script>
export default {
  name: 'AboutComponent'
}
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-10">
        <div class="card shadow">
          <div class="card-header text-center">
            <h1>Über das Mühlespiel</h1>
          </div>
          <div class="card-body">
            <p class="lead text-center">
              Willkommen zum Mühlespiel, einer digitalen Umsetzung des klassischen Brettspiels,
              das auch als "Neun-Menschen-Morris" bekannt ist. Dieses Spiel bietet eine
              strategische Herausforderung, die seit Jahrhunderten geschätzt wird.
            </p>

            <div class="mb-4">
              <h2>Spielmerkmale</h2>
              <ul class="list-group">
                <li class="list-group-item">Spielen gegen menschliche Spieler oder Computergegner</li>
                <li class="list-group-item">Mehrere Schwierigkeitsstufen für Computergegner</li>
                <li class="list-group-item">Echtzeit-Spielstatistiken und Spieler-Tracking</li>
                <li class="list-group-item">Einfaches und intuitives Interface</li>
              </ul>
            </div>

            <div class="mb-4">
              <h2>Programmierung</h2>
              <p><strong>Entwickelt von:</strong> Andreas Gut</p>
              <p>
                Diese Version des Mühlespiels wurde sorgfältig entwickelt, um ein flüssiges und unterhaltsames
                Spielerlebnis zu bieten. Alle Funktionen und der gesamte Code wurden von Andreas Gut erstellt,
                mit dem Fokus auf saubere und effiziente Programmierung.
              </p>
            </div>

            <div class="mb-4">
              <h2>Spielanleitung</h2>
              <p>
                Das Ziel des Mühlespiels ist es, Reihen von drei Steinen, sogenannte Mühlen, zu bilden
                und dabei gegnerische Steine vom Spielfeld zu entfernen. Die Spieler setzen abwechselnd
                ihre Steine auf freie Felder, um den Gegner zu blockieren und eigene Mühlen zu schaffen.
                Hat ein Spieler nur noch drei Steine, kann er seine Steine frei auf dem Brett bewegen.
              </p>
            </div>

            <div class="mb-4">
              <h2>Kontakt</h2>
              <p>Haben Sie Fragen oder Feedback? Kontaktieren Sie Andreas Gut gerne unter <a href="mailto:andreas@example.com">andreas@example.com</a>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Leichte Anpassungen für Abstände und Schrift */
.card-header h1 {
  font-size: 2.5rem;
  color: #333;
}

.card-body {
  padding: 2rem;
}

.card-body h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: #444;
}

.card-body p, .card-body ul {
  font-size: 1.1rem;
}

.list-group-item {
  font-size: 1.1rem;
}

.lead {
  font-size: 1.2rem;
  color: #555;
}
</style>
