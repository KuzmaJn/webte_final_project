<script setup>
import {ref} from 'vue';
import Game from "@/components/Game.vue";

const isOpen = ref(false);
</script>

<template>
  <div class="root">
    <button @click="isOpen = true">Hraj hru</button>
    <teleport to="body">
      <div class="modal flex blur-bg flex-column" v-if="isOpen">
        <game
            @close="isOpen = false">
        </game>
      </div>
    </teleport>
  </div>
</template>

<style scoped>
@import "@/styles/utils.css";
.root {
  position: relative;
}

.modal{
  background-color: rgba(0, 0, 0, 0.75);
}
</style>