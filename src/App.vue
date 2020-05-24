<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Suspense Simple</router-link> |
      <router-link to="/suspense-route">Suspense Route</router-link>
    </div>
    <Suspense>
      <template #default>
        <router-view />
      </template>
      <template #fallback>
        <span>I'm a loading screen, I'm waiting the view to be ready!</span>
      </template>
    </Suspense>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
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
</style>
