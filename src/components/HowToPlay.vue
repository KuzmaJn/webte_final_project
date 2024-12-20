<script setup>
import RuleBlock from "@/components/RuleBlock.vue";
import { ref } from "vue";

const rules = ref([
  {
    title: "Cieľ hry",
    content: `
      <p>Cielom hry je získať čo najviac bodov. <br><b>Bodový systém:</b> <br></p>
      <p><img src="/src/assets/images/red.png" alt="red_alien"> - 10 bodov</p>
      <p><img src="/src/assets/images/yellow.png" alt="yellow_alien"> - 20 bodov</p>
      <p><img src="/src/assets/images/green.png" alt="green_alien"> - 30 bodov</p>
      <p><img src="/src/assets/images/extra.png" alt="ufo"> - ? bodov</p>
    `,
  },
  {
    title: "Ovládanie",
    content: `
      <div class="grid">
        <div class="empty"></div>
        <div class="key">W</div>
        <div class="empty"></div>
        <div class="used key">A</div>
        <div class="key">S</div>
        <div class="used key">D</div>
        <div class="used key space">SPACE</div>
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
  <div class="slideshow">
    <transition name="slide" mode="out-in">
      <RuleBlock @click="nextSlide" :key="rules[currentIndex].title" :title="rules[currentIndex].title">
        <div v-html="rules[currentIndex].content"></div>
      </RuleBlock>
    </transition>
  </div>
</template>

<style>
.slideshow {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

p {
  margin: 0;
  padding: 0.2rem;
  max-width: 21rem;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.75rem;
  width: 20rem;
}

.empty {
  background-color: transparent;
  border: none;
}

.key {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #959595;
  color: #ffffff;
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
</style>
