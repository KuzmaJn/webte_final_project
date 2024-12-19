<script setup>
  import { defineProps, defineEmits } from 'vue';

  defineProps({
    title: String,
    msg: String,
  })
  defineEmits("close")
</script>

<template>
  <div>
    <h3>{{ title }}</h3>
    <p>{{ msg }}</p>
    <button @click="$emit('close')">Close</button>
  </div>
</template>

<style scoped>
  div {
    width: 10rem;
    height: 10rem;
    background-color: aliceblue;
    margin: 1rem;
    border-radius: 1rem;
  }
</style>