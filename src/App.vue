<template>
  <div id="app">
    <div id="nav">
      <router-link tag="button" class="btn btn-primary" to="/">Listings</router-link>
      <router-link tag="button" class="btn btn-primary" to="/add">Add Entry</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.btn {
  margin: 10px;
}
</style>
