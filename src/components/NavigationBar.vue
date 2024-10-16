<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="/" style="color: green"><i class="fas fa-gamepad"></i> <i class="fas fa-plus"></i> Neues Spiel</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Aktuelles Spiel</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin">Administrator</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/services">Über das Spiel</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavigationBar'
}
</script>

<style scoped>
.nav-link,
.dropdown-item {
  cursor: pointer;
}
</style>
