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

// Skontroluje, či existuje uložený herný stav
onMounted(() => {
  gameStateStore.loadState();
  canContinue.value = !!gameStateStore.level;
  console.log('Can continue:', canContinue.value); // Debug
});

</script>

<template>
  <div class="root">
    <!-- Tlačidlo na spustenie novej hry -->
    <button @click="startNewGame">Hraj hru</button>

    <!-- Tlačidlo na pokračovanie, zobrazí sa len ak existuje uložený stav -->
    <button v-if="canContinue" @click="continueGame">Pokračovať</button>


    <div v-if="canContinue" class="game-info">
      <p>Úroveň: {{ gameStateStore.level }}</p>
      <p>Skóre: {{ gameStateStore.score }}</p>
      <p>Životy: {{ gameStateStore.lives }}</p>
    </div>
    <!-- Modálne okno pre hru -->
    <teleport to="body">
      <div class="modal flex blur-bg flex-column" v-if="isOpen">
        <game
            @close="isOpen = false"
            :initialState="getGameState()" ></game>
      </div>
    </teleport>
  </div>
</template>

<style scoped>
@import "@/styles/utils.css";

.root {
  position: relative;
}
.game-info {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

.game-info p {
  margin: 0 0 5px; /* Oddeľuje jednotlivé riadky */
}

.modal {
  background-color: rgba(0, 0, 0, 0.55);
  padding: 20px;
  border-radius: 10px;
}
</style>
