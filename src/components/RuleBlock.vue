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
  width: 32rem;
  height: 21rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #dadada;
  border-radius: 0.5rem;
  margin: 0.5rem;
  padding: 0.5rem;
}
.content{
  font-size: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
</style>