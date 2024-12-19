<script setup>
  import { ref } from 'vue';
  import Game from "@/components/Game.vue";

  const isOpen = ref(false);
</script>

<template>
  <div class="root">
    <game @click="isOpen = true"
          title="Space invaders"
          msg="Tap to play"
    ></game>
    <teleport to="body">
      <div class="modal" v-if="isOpen">
        <game
            @close="isOpen = false"
            title="Space Invaders"
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
    background-color: rgba(0, 0, 0, 0.3);
  }
  .modal > div {
    background-color: #ffffff;
    padding: 5rem;
    border-radius: 1rem;
  }
</style>