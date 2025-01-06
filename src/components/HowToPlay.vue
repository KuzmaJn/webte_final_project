<script setup>
import RuleBlock from "@/components/RuleBlock.vue";
import {ref} from "vue";

const isTooltipVisible = ref(false);
let timeout;

const showTooltip = () => {
  isTooltipVisible.value = true;

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    isTooltipVisible.value = false;
  }, 3000);
};

const hideTooltip = () => {
  isTooltipVisible.value = false;
  clearTimeout(timeout);
};

const rules = ref([
  {
    title: "Cieľ hry",
    content: `
      <p>Cielom hry je získať čo najviac bodov. <br><b>Bodový systém:</b> <br></p>
      <p><img src="/src/assets/images/red.png" alt="red_alien"> - 10 bodov</p>
      <p><img src="/src/assets/images/yellow.png" alt="yellow_alien"> - 20 bodov</p>
      <p><img src="/src/assets/images/green.png" alt="green_alien"> - 30 bodov</p>
      <p><img src="/src/assets/images/extra.png" alt="ufo"> - 50 bodov</p>
    `,
  },
  {
    title: "Ovládanie",
    content: `
      <div class="grid">
        <div class="empty"></div>
        <div class="flex key">W</div>
        <div class="empty"></div>
        <div class="flex used key">A</div>
        <div class="flex key">S</div>
        <div class="flex used key">D</div>
        <div class="flex used key space">SPACE</div>
      </div>
      <p>A, D: pohyb hráča <br> SPACE: streľanie projektilov</p>
    `,
  },
  {
    title: "Disclaimer",
    content: `
      <p>Tato hra je inšpirovaná klasickou arkádovou hrou Space Invaders. Všetky assety sú buď vytvorené pre tento projekt, alebo majú CC0 licenciu.</p>
    `,
  },
]);

const currentIndex = ref(0);
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % rules.value.length;
};

</script>

<template>
  <div @mouseenter="showTooltip" @mouseleave="hideTooltip" class="flex slideshow">
    <transition name="fade">
      <RuleBlock @click="nextSlide" :key="rules[currentIndex].title" :title="rules[currentIndex].title">
        <span v-if="isTooltipVisible" class="tooltip">Hint: klik</span>
        <div v-html="rules[currentIndex].content"></div>
      </RuleBlock>
    </transition>
  </div>
</template>

<style>
@import "@/styles/utils.css";

.slideshow {
  gap: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

p {
  margin: 0.1rem;
  padding: 0.2rem;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.75rem;
}

.empty {
  background-color: transparent;
  border: none;
}

.key {
  background-color: #959595;
  border-radius: 0.5rem;
  height: 3rem;
  font-weight: bold;
}

.space {
  grid-column: 1 / span 3;
}

.used {
  background-color: #00cfff;
  color: #000;
}

.tooltip {
  position: absolute;
  left: 0.5rem;
  top: 1.2rem;
  display: block;
  color: #fff;
  white-space: nowrap;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 0.25rem;
}
</style>
