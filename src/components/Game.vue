<script setup>
import {defineEmits} from 'vue';
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import p5 from 'p5';
import Player from '@/assets/images/player.png';
import Red from '@/assets/images/red.png';
import Yellow from '@/assets/images/yellow.png';
import Green from '@/assets/images/green.png';
import Extra from '@/assets/images/extra.png';

defineEmits(["close"])

const canvasContainer = ref(null);
let p5Instance = null;

const sketch = (p) => {
  let player;
  let playerImage;

  // Inicializácia
  p.preload = () => {
    // Načítanie obrázka hráča
    playerImage = p.loadImage(Player);
  };

  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight);

    // Inicializácia hráča
    player = {
      x: p.width / 2,
      y: p.height - 100,
      width: 50,
      height: 50,
    };
  };

  p.draw = () => {
    p.background(0);

    // Vykreslenie hráča ako obrázku
    p.image(playerImage, player.x, player.y, player.width, player.height);

    // Pohyb hráča
    if (p.keyIsDown(p.LEFT_ARROW)) {
      player.x -= 5;
    }
    if (p.keyIsDown(p.RIGHT_ARROW)) {
      player.x += 5;
    }

    // Strela (len na demonštráciu, nie plne implementované)
    if (p.keyIsDown(32)) {
      p.fill(255);
      p.ellipse(player.x + player.width / 2, player.y - 10, 10, 10);
    }
  };

  // Reagovanie na zmenu veľkosti okna
  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight);
  };
};

onMounted(() => {
  // Inicializácia P5.js
  p5Instance = new p5(sketch, canvasContainer.value);
});

onBeforeUnmount(() => {
  // Zničenie P5.js instance pri odchode z komponentu
  p5Instance.remove();
});
</script>

<template>
  <div class="flex flex-between title">
    <button class="close-icon nav-link" @click="$emit('close')">✖</button>
  </div>

  <div ref="canvasContainer" class="flex game-container"></div>
</template>

<style scoped>
@import "@/styles/utils.css";

.title {
  flex: 0 1 auto;
}
.game-container{
  flex: 1 1 auto;
  width: 100vw;
  height: 100vh;
}
.game-container > canvas{
  background-color: #000000;
  margin: 1rem;
  border-radius: 0.5rem;
}
</style>