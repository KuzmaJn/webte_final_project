<script setup>
import {defineProps} from 'vue';

defineProps({
  title:{
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="rule flex-initial flex-column blur-bg my-padding1">
    <h2 class="my-padding0"> {{ title }} </h2>
    <div class="content flex flex-column">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
@import "@/styles/utils.css";

.rule{
  align-items: center;
  box-sizing: border-box;
  overflow: auto;
  position: fixed;
  width: 80vw;
  height: 60vh;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 0.5rem;
}
.content{
  gap: 0.2rem;
  width: 100%;
}

@media(min-width: 480px) {
  .rule{
    max-width: 24rem;
  }
}

@media(min-width: 768px) {
  .rule{
    max-width: 32rem;
  }
}
</style>