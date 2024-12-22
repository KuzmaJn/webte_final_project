<script setup>
import {defineEmits, defineProps} from 'vue';

defineProps({
    msg: String,
  })
  defineEmits("close")
</script>

<template>
  <div class="flex title">
    <p>{{ msg }}</p>
    <button @click="$emit('close')">✖</button>
  </div>
  <div ref="gameContainer" class="flex game-container">
    <canvas ref="gameCanvas"></canvas>
  </div>
</template>

<style scoped>
.flex{
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  flex: 0 1 auto;
  width: 100%;
  justify-content: space-between;
}
.game-container{
  flex: 1 1 auto;
  width: 100%;
}
.game-container > canvas{
  background-color: #000000;
  margin: 1rem;
  border-radius: 0.5rem;
}
</style>