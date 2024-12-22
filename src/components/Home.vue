<script setup>
import {ref} from 'vue';
import Game from "@/components/Game.vue";

const isOpen = ref(false);
</script>

<template>
  <div class="root">
    <button @click="isOpen = true">Hraj hru</button>
    <teleport to="body">
      <div class="modal" v-if="isOpen">
        <game
            @close="isOpen = false"
            msg="Implementation">
        </game>
      </div>
    </teleport>
  </div>
</template>

<style scoped>
.root {
  position: relative;
}
.modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(0.25rem);
}
</style>