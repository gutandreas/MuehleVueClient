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
            <h1>Über das Spiel</h1>
          </div>
          <div class="card-body">
            <p class="lead text-center">
              Das Spiel wurde von Andreas Gut als Individuelles Projekt im Rahmen des Studiengangs GymInf unter der Betreuung von Prof. Dr. Dominik Gruntz erstellt.
            </p>

            <div class="mb-4">
              <h2>Spielmöglichkeiten</h2>
              <ul class="list-group">
                <li class="list-group-item">Spielen gegen andere eingeloggte Spieler</li>
                <li class="list-group-item">Spielen gegen unterschiedliche Schwierigkeitsstufen des Computerspielers</li>
                <li class="list-group-item">Beobachten von laufenden Spielen</li>
              </ul>
            </div>

            <div class="mb-4">
              <h2>Projekt und Programmierung</h2>
              <p>
                Der Computerspieler basiert auf dem Alpha-Beta-Algorithmus, einer Weiterentwicklung des Minimax-Algorithmus.
                Zur Implementierung des Frontends wurde <a href="https://vuejs.org">Vue3</a> eingesetzt. Das Backend basiert auf <a href="https://spring.io/projects/spring-boot">Spring Boot</a>.
                Zum Projekt gehören ebenfalls eine Desktopanwendung auf Basis von <a href="https://openjfx.io">JavaFX</a> und ein Spielroboter. Das Projekt ist neben weiteren Arbeiten auf dem <a href="https://github.com/gutandreas/">Github-Repository</a> von Andreas Gut zu finden.
              </p>
            </div>

            <div class="mb-4">
              <h2>Spielanleitung</h2>
              <p>
                Das Ziel des Spiels ist es, Reihen von drei Steinen, sogenannte Mühlen, zu bilden
                und dabei gegnerische Steine vom Spielfeld zu entfernen. Die Spieler setzen abwechselnd
                ihre Steine auf freie Felder, um den Gegner zu blockieren und eigene Mühlen zu schaffen.
                Sobald beide Spieler 9 Steine gesetzt haben, werden die Steine abwechslungsweise den Linien entlang verschoben.
                Hat ein Spieler nur noch drei Steine, kann er seine Steine frei auf dem Brett bewegen. Hat ein Spieler weniger als 3 Steine hat oder kann er sich nicht mehr bewegen, so ist das Spiel beendet.
              </p>
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
