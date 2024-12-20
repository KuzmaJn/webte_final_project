<script setup>

</script>

<template>
  <nav>
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/how-to-play">How to play</router-link></li>
    </ul>
  </nav>
  <router-view/>
</template>

<style scoped>
nav {
  background-color: #d3d3d3;
  padding: 1rem;
  border-radius: 0.5rem;
}
nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
}
nav ul li {
  margin: 0;
}
nav ul li a {
  color: #000000;
  text-decoration: none;
}
nav ul li a.router-link-active {
  font-weight: bold;
  border-bottom: 2px solid white;
}
</style>
