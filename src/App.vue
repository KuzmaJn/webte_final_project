<!--suppress CssUnusedSymbol -->
<script setup>

</script>

<template>
  <nav>
    <h2>Spaceship vs aliens</h2>
    <ul>
      <li><router-link to="/">Hraj hru</router-link></li>
      <li><router-link to="/how-to-play">Pravidlá</router-link></li>
    </ul>
  </nav>
  <main>
    <router-view/>
  </main>
  <footer>
    <h5>
      This is developed using Vue and Vite
    </h5>
  </footer>
</template>

<style scoped>
nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #dadada;
  padding: 1rem;
  border-radius: 0.5rem 0.5rem 0 0;
}
nav ul {
  font-size: 1.5rem;
  list-style: none;
  display: flex;
  gap: 2rem;
}

nav ul li a {
  color: #000000;
  background-color: rgba(255, 255, 255, 0);
  text-decoration: none;
  text-shadow: none;
  transition: text-shadow 0.3s ease;
  border-radius: 1rem;
}

nav > ul > li > a:hover,
nav > ul > li > a.router-link-active{
  color: #fff;
  background-color: rgba(255, 211, 116, 0.47);
  text-shadow: 0 0 10px rgb(255, 211, 116), 0 0 20px rgba(255, 211, 116);
  box-shadow: 0 0 20px rgb(255, 211, 116), 0 0 40px rgb(255, 211, 116);
}

main{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex: 1 1 auto;
}

footer {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #dadada;
  color: #000000;
  padding: 1rem;
  border-radius: 0 0 0.5rem 0.5rem;
}
</style>
