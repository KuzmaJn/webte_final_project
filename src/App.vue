<script setup>
import { ref } from 'vue';

const isModalOpen = ref(false);
const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value;
};
const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<template>
<nav class="flex background-style">
  <h2 class="item"><router-link to="/">Spaceship vs aliens</router-link></h2>
  <ul class="flex item desktop-menu">
    <li><router-link to="/">Hraj hru</router-link></li>
    <li><router-link to="/how-to-play">Pravidlá</router-link></li>
  </ul>
  <button class="item hamburger" @click="toggleModal">☰</button>
</nav>

<!-- Modálne okno -->
<transition name="fade">
  <div v-if="isModalOpen" class="modal">
    <div class="flex background-style modal-content" @click="closeModal">
      <button class="close-icon" @click="closeModal">✖</button>
      <ul class="flex">
        <li><router-link to="/" @click="closeModal">Hraj hru</router-link></li>
        <li><router-link to="/how-to-play" @click="closeModal">Pravidlá</router-link></li>
      </ul>
    </div>
  </div>
</transition>

<main>
  <transition name="fade">
    <router-view />
  </transition>
</main>
<footer>
  <h5>
    This is developed using Vue and Vite
  </h5>
</footer>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.flex {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.background-style {
  background-color: rgba(255, 255, 255, 0.0);
  backdrop-filter: blur(0.25rem);
}

a {
  text-decoration: none;
  color: #FFF;
  font-size: 1.5rem;
}
nav {
  justify-content: space-between;
  padding: 1.25rem 1rem 1.25rem 1rem;
}

nav h2 {
  flex: 3 1 auto;
  margin: 0;
}
nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.desktop-menu > li > a {
  text-decoration: none;
  transition: border-bottom 0.2s linear, color 0.5s ease;
  padding: 1.25rem 1rem 1.25rem 1rem;
}

.desktop-menu > li > a.router-link-active {
  color: #82b8ff;
  font-weight: bolder;
}

.desktop-menu > li > a:hover {
  border-bottom: 0.15rem solid #ffffff;
}

.hamburger {
  display: none;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
}

.modal-content {
  position: relative;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.3);
  width: 100%;
  height: 100%;
}

.modal-content ul {
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
}

.modal-content ul li a {
  color: #000000;
  font-size: 2.5rem;
}

.modal-content ul li a:hover {
  color: #82b8ff;
}

.close-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 3rem;
  background: none;
  border: none;
  color: black;
  cursor: pointer;
}

/* Responzívne štýly */
@media (max-width: 768px) {
  nav > h2 > a{
    font-size: large;
  }
  .hamburger {
    display: block;
    font-size: 2rem;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
  }
  .desktop-menu{
    display: none;
  }
}
</style>