<script setup>
import { ref, onMounted } from 'vue';
import Game from "@/components/Game.vue";

const isOpen = ref(false);
const canContinue = ref(false);



const continueGame = () => {
  const savedGameState = JSON.parse(localStorage.getItem('gameState'));
  if (savedGameState) {
    // Emit event alebo nastav hodnoty pre Game.vue
    console.log('Continuing game:', savedGameState);
    isOpen.value = true;
    // Pridaj logiku na preposlanie stavu do Game.vue, napr. cez props alebo globálny stav
  } else {
    alert('Nie je uložená žiadna hra na pokračovanie!');
  }
};
onMounted(() => {
  // Skontroluj, či existuje uložený stav hry
  const savedGameState = localStorage.getItem('gameState');
  if (savedGameState) {
    canContinue.value = true;
  }
});
</script>

<template>
  <div class="root">
    <button @click="isOpen = true">Hraj hru</button>
    <button v-if="canContinue" @click="continueGame">Pokračovať</button>
    <teleport to="body">
      <div class="modal flex blur-bg flex-column" v-if="isOpen">
        <game
            @close="isOpen = false">
        </game>
      </div>
    </teleport>
  </div>
</template>
<game
    v-if="isOpen"
    :initialState="JSON.parse(localStorage.getItem('gameState'))"
    @close="isOpen = false">
</game>

<style scoped>
@import "@/styles/utils.css";
.root {
  position: relative;
}

.modal{
  background-color: rgba(0, 0, 0, 0.55);
}
</style>