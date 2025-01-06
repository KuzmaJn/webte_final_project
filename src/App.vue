<script setup>
import {ref} from 'vue';

const isModalOpen = ref(false);
const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value;
  document.body.classList.add('no-scroll'); // Zakáže scrollovanie
};
const closeModal = () => {
  isModalOpen.value = false;
  document.body.classList.remove('no-scroll');
};
</script>

<template>
<nav class="flex flex-between blur-bg my-padding1 ">
  <router-link class="nav-link my-padding0 main-header" to="/"><h2 class="my-padding0">Spaceship vs aliens</h2></router-link>
  <button class="hamburger my-padding0 no-print" @click="toggleModal">☰</button>
  <ul class="flex nav-list desktop-menu">
    <li><router-link class="nav-link my-padding1" to="/">Hraj hru</router-link></li>
    <li><router-link class="nav-link my-padding1" to="/how-to-play">Pravidlá</router-link></li>
  </ul>
</nav>

<!-- Modálne menu -->
<transition name="fade">
  <div v-if="isModalOpen" class="modal">
    <div class="flex flex-column blur-bg modal-content" @click="closeModal">
      <button class="close-icon nav-link" @click="closeModal">✕</button>
      <ul class="flex flex-column nav-list">
        <li><router-link class="nav-link" to="/" @click="closeModal">Hraj hru</router-link></li>
        <li><router-link class="nav-link" to="/how-to-play" @click="closeModal">Pravidlá</router-link></li>
      </ul>
    </div>
  </div>
</transition>

<main class="flex">
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
</main>
</template>

<style scoped>
@import "@/styles/utils.css";

main{
  position: relative;
  flex: 1 1 auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.main-header {
  font-size: clamp(1.1em, 4vw, 1.5rem); /* Dynamické prispôsobenie s rem a em */
}
.desktop-menu{
  display: none;
}

.desktop-menu > li > a {
  transition: border-bottom 0.2s linear, color 0.5s ease;
}

li > a.router-link-active {
  color: #82b8ff;
  font-weight: bolder;
}

.desktop-menu > li > a:hover {
  border-bottom: 0.15rem solid #ffffff;
}

.hamburger {
  background: none;
  border: none;
  display: block;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  margin: 0 0 0 2rem;
}

.modal-content {
  position: relative;
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
}

.modal-content ul li a:hover, .close-icon:hover {
  color: #82b8ff;
}

/* Responzívne štýly */
@media (min-width: 768px) {
  .hamburger {
    display: none;
  }
  .desktop-menu{
    display: flex;
  }
}


</style>