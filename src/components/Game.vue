<script setup>
import {defineEmits} from 'vue';
import { ref, onMounted, onUnmounted } from 'vue';
import p5 from 'p5';
import Player from '@/assets/images/player.png';
import Red from '@/assets/images/red.png';
import Yellow from '@/assets/images/yellow.png';
import Green from '@/assets/images/green.png';
import Extra from '@/assets/images/extra.png';

defineEmits(["close"])

let width = window.innerWidth * 3/4;
let height = window.innerHeight;
let player, enemyRed, enemyYellow, enemyGreen, enemyExtra, gameStarted;
let score = ref(0);
let bullets = [];
const isPaused = ref(false);
const wasPaused = ref(true);
let countdown = ref(3);

const sketch = (p) => {
  p.preload = () => {
    player = {x: width / 2 - 30, y: height * 8 / 9, lives: 3, image: p.loadImage(Player)};
    enemyRed = p.loadImage(Red);
    enemyYellow = p.loadImage(Yellow);
    enemyGreen = p.loadImage(Green);
    enemyExtra = p.loadImage(Extra);
  };

  p.setup = () => {
    let canvas = p.createCanvas(width, height);
    p.frameRate(60);
  };

  p.draw = () => {
    if (wasPaused.value && countdown.value > 0) {
      p.textAlign(p.CENTER, p.CENTER);
      p.background(0);
      p.textSize(64);
      p.fill(255);
      p.text(countdown.value, p.width / 2, p.height / 2);

      if (p.frameCount % 60 === 0) {
        countdown.value--;
      }

      if (countdown.value === 0) {
        wasPaused.value = false;
      }
      return;
    }

    p.background(0);
    if(p.keyIsDown(65)){
      p.moveLeft();
    }
    if(p.keyIsDown(68)){
      p.moveRight();
    }

    if (p.keyIsDown(32)) {
      if (!p._shooting) {
        p.shootBullet();
        p._shooting = true;
      }
    } else {
      p._shooting = false;
    }

    p.updateBullets();
    p.drawBullets();
    p.drawPlayer();
  };

  p.drawPlayer = () => {
    p.image(player.image, player.x, player.y, player.image.width * 2/3, player.image.height * 2/3);
  };

  p.shootBullet = () => {
    bullets.push({x: player.x + (player.image.width * 1/3)-2, y: player.y});
  };

  p.updateBullets = () => {
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].y -= 8;

      if (bullets[i].y < 0) {
        bullets.splice(i, 1);
      }
    }
  };

  p.drawBullets = () => {
    bullets.forEach((bullet) => {
      p.fill(255, 0, 0);
      p.noStroke();
      p.rect(bullet.x, bullet.y, 4, 16);
    });
  };

  p.moveLeft = () => {
    if(player.x > 9){
      player.x -= 5;
    }
  };

  p.moveRight = () => {
    if(player.x < width - 49){
      player.x += 5;
    }
  };
};
const togglePause = () => {
  if (isPaused.value) {
    p5Instance.loop();
  } else {
    p5Instance.noLoop();
  }
  isPaused.value = !isPaused.value;
  wasPaused.value = true;
  countdown.value = 3;
};

const canvasRef = ref(null);
let p5Instance = null;


onMounted(() => {
  p5Instance = new p5(sketch, canvasRef.value);
});


onUnmounted(() => {
  if (p5Instance) {
    p5Instance.remove();
  }
});

// rusi aby pause/play spustilo stlacenie medzerniku, lebo sa pouziva na strelanie
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && document.activeElement.tagName === 'BUTTON') {
    event.preventDefault();
  }
});
</script>

<template>
  <div class="flex flex-between title" id="menu-container">
    <div class="flex flex-column stats">
      <p id="score">Skóre: {{score}} <br>Životy: </p>
    </div>
    <div class="flex flex-column menu">
      <button class="nav-link icon" @click="togglePause">{{isPaused ? '▶' : '❚❚' }}</button>
      <button class="nav-link icon" @click="">↺</button>
      <button class="nav-link icon" @click="$emit('close')">✖</button>
    </div>

  </div>

  <div ref="canvasRef" class="flex flex-column game-container" id="game-container"></div>
</template>

<style scoped>
@import "@/styles/utils.css";
.title {
  position: absolute;
  width: 100vw;
  flex: 0 1 auto;
}

.menu {
  justify-content: space-between;
  align-items: initial;
  padding: 1rem;
}

.stats{
  padding: 1rem;
}
.game-container{
  flex: 1 1 auto;
  width: 100vw;
  height: 100vh;
}
.game-container > canvas{
  display: block;
}
</style>