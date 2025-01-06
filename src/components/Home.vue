<script setup>
import {ref, onMounted} from 'vue';
import Game from "@/components/Game.vue";
import { useGameStateStore } from '@/store/gameState';


// Stav pre modálne okno a tlačidlo "Pokračovať"
const isOpen = ref(false);
const canContinue = ref(false);

// Funkcia pre pokračovanie hry
const continueGame = () => {
  if (gameStateStore.level > 0) {
    isOpen.value = true; // Otvorí komponent hry
  } else {
    alert('Nie je uložená žiadna hra na pokračovanie!');
  }
};

const gameStateStore = useGameStateStore();

const startNewGame = () => {
  gameStateStore.resetState(); // Reset herného stavu na predvolené hodnoty
  console.log('Starting a new game:', {
    level: gameStateStore.level,
    score: gameStateStore.score,
    lives: gameStateStore.lives,
  }); // Debug

  isOpen.value = true; // Otvorí komponent hry
  document.body.classList.add('no-scroll');
};

// Funkcia na získanie herného stavu z localStorage
const getGameState = () => {
  try {
    return JSON.parse(localStorage.getItem('gameState'));
  } catch (error) {
    console.error('Chyba pri načítaní gameState:', error);
    return null;
  }
};

const handleGameClose = () => {
  isOpen.value = false; // Zavrie modálne okno
  canContinue.value = !!gameStateStore.level; // Aktualizuje stav tlačidla "Pokračovať"
  console.log('Game closed, canContinue:', canContinue.value); // Debug
};


// Skontroluje, či existuje uložený herný stav
onMounted(() => {
  gameStateStore.loadState();
  canContinue.value = !!gameStateStore.level;
  console.log('Can continue:', canContinue.value); // Debug
});

</script>

<template>
  <div class="root flex flex-column">
    <!-- Tlačidlo na spustenie novej hry -->
    <button class="no-print nav-link" @click="startNewGame">Začať hru</button>

    <!-- Tlačidlo na pokračovanie, zobrazí sa len ak existuje uložený stav -->
    <button class="no-print nav-link" v-if="canContinue" @click="continueGame">Pokračovať v hre</button>

    <!-- Informácie o hre -->
    <div v-if="canContinue" class="game-info no-print">
      <p>Úroveň: {{ gameStateStore.level }}</p>
      <p>Skóre: {{ gameStateStore.score }}</p>
      <p>Životy: {{ gameStateStore.lives }}</p>
    </div>

    <!-- Modálne okno pre hru -->
    <teleport to="body">
      <div class="modal flex blur-bg flex-column no-print" v-if="isOpen">
        <game
            @close="handleGameClose"
            :initialState="getGameState()"
        ></game>
      </div>
    </teleport>
  </div>

  <!-- Div pre tlač -->
  <div class="print-div">
    <h1>Domovská obrazovka</h1>
    <div v-if="canContinue">
      <h2>Hra na pokračovanie</h2>
      <p>Úroveň: {{ gameStateStore.level }}</p>
      <p>Skóre: {{ gameStateStore.score }}</p>
      <p>Životy: {{ gameStateStore.lives }}</p>
    </div>
    <img src="@/assets/images/red.png" alt="Red Enemy" class="enemy red" />
    <img src="@/assets/images/yellow.png" alt="Yellow Enemy" class="enemy yellow" />
    <img src="@/assets/images/green.png" alt="Green Enemy" class="enemy green" />
    <img src="@/assets/images/extra.png" alt="Extra Enemy" class="enemy extra" />
  </div>
</template>

<style scoped>
@import "@/styles/utils.css";

.root {
  max-width: 28rem;
  position: relative;width: 80vw;
  height: 60vh;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 0.5rem;
}
.game-info {
  margin-top: 10px;
  font-size: 14px;
  color: #ffffff;
}

.game-info p {
  margin: 0 0 5px; /* Oddeľuje jednotlivé riadky */
}

.modal {
  background-color: rgba(0, 0, 0, 0.55);
}

button.nav-link{
  font-family: "VT-Regular", sans-serif;
  background-color: rgba(0, 0, 0, 0.8);
  display: block;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  margin: 0.5rem;
  padding: 0.3rem;
}
</style>
