<script setup>
import { defineProps } from 'vue';

defineProps({
  title:{
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="rule">
    <h3> {{ title }} </h3>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.rule{
  position: fixed;
  width: 32rem;
  max-width: 80vw;
  height: 21rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(0.25rem);
  border-radius: 0.5rem;
  margin: 0.5rem;
  padding: 0.5rem;
}
.content{
  font-size: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  width: 75%;
}
</style>