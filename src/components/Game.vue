<script setup>
import {defineEmits} from 'vue';
import {ref, onMounted, onUnmounted} from 'vue';
import p5 from 'p5';
import Player from '@/assets/images/player.png';
import Red from '@/assets/images/red.png';
import Yellow from '@/assets/images/yellow.png';
import Green from '@/assets/images/green.png';
import Extra from '@/assets/images/extra.png';
import levels from '@/assets/levels.json';
import { useGameStateStore } from '@/store/gameState';

const emit = defineEmits(['close']);

let width = window.innerWidth * 0.8;
let height = window.innerHeight * 0.9;
let player, enemyRed, enemyYellow, enemyGreen, enemyExtra;
let enemies = [];
let currentLevel = ref(0);
let score = ref(0);
let lives = ref(5);
let bullets = [];
const isPaused = ref(false);
const wasPaused = ref(true);
const isMobile = ref(false);
let countdown = ref(3);
let levelCompleted = ref(false);
let gameOver = ref(false);
let gameOverMessage = ref('');
let pendingEnemies = [];
const gameStateStore = useGameStateStore();
let shootBullet = null;

const handleDeviceOrientation = (event) => {
  if (!isMobile.value) return;

  const beta = event.beta;
  if (player) {
    const sensitivity = 1;
    player.x += beta * sensitivity;
    player.x = Math.max(0, Math.min(player.x, width - 40));
  }
};

const enableGyroscope = async () => {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission === 'granted') {
        alert('Gyroscope permission granted');
      } else {
        alert('Gyroscope permission denied');
      }
    } catch (error) {
    }
  }
};
const checkOrientation = () => {
  if (isMobile.value) {
    if (window.innerWidth < window.innerHeight) {
        // TODO blokovanie hry na vysku
    } else {
      resizeCanvas();
    }
  }
};
const detectDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  isMobile.value = /android|iphone|ipad|ipod|windows phone/i.test(userAgent);
};
const resizeCanvas = () => {
  width = window.innerWidth * 0.8;
  height = window.innerHeight * 0.9;
  const scaleFactor = Math.min(width / 1920, height / 1080);

  // Ensures the canvas and elements scale proportionally to fit different screen sizes.
  if (p5Instance && typeof p5Instance.resizeCanvas === "function") {
    p5Instance.resizeCanvas(width, height);
  }

  if (player) {
    player.x = width / 2 - 30;

    if (width < 768 || height < 600) {
      player.y = height * 7 / 9;
    } else {
      player.y = height * 8 / 9;
    }

    if (player.image) {
      player.width = player.image.width * scaleFactor;
      player.height = player.image.height * scaleFactor;
    }
  }

  if (enemies && Array.isArray(enemies)) {
    enemies.forEach((enemy) => {
      if (enemy) {
        enemy.width = 40 * scaleFactor;
        enemy.height = 40 * scaleFactor;
      }
    });
  }
};


const handleTouchStart = (event) => {
  if (isMobile.value) {
    shootBullet();
  }
};


const loadLevel = (levelIndex) => {
  enemies = [];
  pendingEnemies = [];
  const level = levels[levelIndex];
  level.enemies.forEach((enemyConfig) => {
    pendingEnemies.push({
      x: Math.random() * (width - 40),
      y: Math.random() * -500,
      speed: enemyConfig.speed,
      remainingDelay: enemyConfig.delay,
      type: enemyConfig.type,
      lives: enemyConfig.type === 'green' ? 3 : 1,
      projectiles: enemyConfig.type === 'extra' ? [] : null,
      shootCooldown: enemyConfig.type === 'extra' ? 0 : null,
      shootBurst: enemyConfig.type === 'extra' ? 3 : null,
      shootCounter: enemyConfig.type === 'extra' ? 0 : null,
      moveDirection: enemyConfig.type === 'extra' ? 1 : null,
      burstTimer: enemyConfig.type === 'extra' ? 20 : null,
    });
  });
};

const sketch = (p) => {
  p.preload = () => {
    player = {x: width / 2 - 30, y: height * 8 / 9, lives: 3, image: p.loadImage(Player)};
    enemyRed = p.loadImage(Red);
    enemyYellow = p.loadImage(Yellow);
    enemyGreen = p.loadImage(Green);
    enemyExtra = p.loadImage(Extra);
  };

  p.setup = () => {
    p.pixelDensity(1); // Prevents blurriness on high-DPI screens.
    p.createCanvas(width, height);
    p.frameRate(60);
    loadLevel(currentLevel.value);
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

    if (levelCompleted.value) {
      p.textAlign(p.CENTER, p.CENTER);
      p.background(0);
      p.textSize(32);
      p.fill(255);
      p.text(`Level ${currentLevel.value + 1} completed!`, p.width / 2, p.height / 2 - 20);
      p.text(`Prepare for Level ${currentLevel.value + 2}`, p.width / 2, p.height / 2 + 20);
      return;
    }

    p.background(0);

    if (p.keyIsDown(65)) {
      moveLeft();
    }
    if (p.keyIsDown(68)) {
      moveRight();
    }

    if (p.keyIsDown(32)) {
      if (!p._shooting) {
        shootBullet();
        p._shooting = true;
      }
    } else {
      p._shooting = false;
    }

    updateBullets();
    updateEnemies();
    drawEnemies();
    drawBullets();
    drawPlayer();
    checkLevelProgress();
  };

  const drawPlayer = () => {
    // Draws the player image with scaled dimensions.
    p.image(player.image, player.x, player.y, player.image.width * 2 / 3, player.image.height * 2 / 3);
  };

  shootBullet = () => {
    if (!p._shooting) {
      bullets.push({ x: player.x + (player.image.width * 1 / 3) - 2, y: player.y });
      p._shooting = true;
      setTimeout(() => (p._shooting = false), 200); // 200ms cooldown between shots.
      console.log('Bullet shot:', bullets);
    }
  };

  const updateBullets = () => {
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].y -= 8;

      for (let j = enemies.length - 1; j >= 0; j--) {
        if (checkCollision(bullets[i], enemies[j])) {
          bullets.splice(i, 1);
          enemies[j].lives--;

          if (enemies[j].lives <= 0) {
            switch (enemies[j].type) {
              case 'red':
                score.value += 10;
                break;
              case 'yellow':
                score.value += 20;
                break;
              case 'green':
                score.value += 30;
                break;
            }
            enemies.splice(j, 1);
          }
          break;
        }
      }

      if (bullets[i] && bullets[i].y < 0) {
        bullets.splice(i, 1);
      }
    }
  };

  const updateEnemies = () => {
    // Handles pending enemies based on their delay before appearing.
    for (let i = pendingEnemies.length - 1; i >= 0; i--) {
      const pendingEnemy = pendingEnemies[i];
      pendingEnemy.remainingDelay--;

      if (pendingEnemy.remainingDelay <= 0) {
        enemies.push({
          x: Math.random() * (width - 40),
          y: Math.random() * -500,
          speed: pendingEnemy.speed,
          type: pendingEnemy.type,
          lives: pendingEnemy.lives,
          projectiles: pendingEnemy.type === 'extra' ? [] : null,
          shootCooldown: pendingEnemy.type === 'extra' ? 0 : null,
          shootBurst: pendingEnemy.type === 'extra' ? 3 : null,
          shootCounter: pendingEnemy.type === 'extra' ? 0 : null,
          burstTimer: pendingEnemy.type === 'extra' ? 0 : null,
          moveDirection: pendingEnemy.type === 'extra' ? 1 : null,
        });
        pendingEnemies.splice(i, 1);
      }
    }

    enemies.forEach((enemy, index) => {
      enemy.y += enemy.speed;

      if (enemy.type === 'extra') {
        enemy.x += enemy.moveDirection * 2;
        if (enemy.x <= 0 || enemy.x >= width - 40) {
          enemy.moveDirection *= -1;
        }

        if (enemy.shootCooldown === 0) {
          if (enemy.shootCounter < enemy.shootBurst && enemy.burstTimer === 0) {
            enemy.projectiles.push({ x: enemy.x + 20, y: enemy.y + 40, speed: 5 });
            enemy.shootCounter++;
            enemy.burstTimer = 20;
          } else if (enemy.shootCounter >= enemy.shootBurst) {
            enemy.shootCooldown = 120;
            enemy.shootCounter = 0;
          } else {
            enemy.burstTimer--;
          }
        } else {
          enemy.shootCooldown--;
        }
      }

      if (enemy.type === 'extra' && enemy.projectiles) {
        enemy.projectiles.forEach((projectile, projIndex) => {
          projectile.y += projectile.speed;

          if (
              projectile.x < player.x + 40 &&
              projectile.x + 10 > player.x &&
              projectile.y < player.y + 40 &&
              projectile.y + 10 > player.y
          ) {
            lives.value -= 1;
            enemy.projectiles.splice(projIndex, 1);

            if (lives.value <= 0) {
              alert('Game over! Try again.');
              p.noLoop();
            }
          }

          if (projectile.y > height) {
            enemy.projectiles.splice(projIndex, 1);
          }
        });
      }

      if (enemy.y > height) {
        if (enemy.type === 'red') lives.value -= 1;
        if (enemy.type === 'yellow') lives.value -= 2;
        if (enemy.type === 'green') lives.value -= 3;

        if (lives.value <= 0) {
          gameOver.value = true;
          gameOverMessage.value = `You lost! Score: ${score.value}, Level: ${currentLevel.value + 1}`;
          p.noLoop();
        }

        enemies.splice(index, 1);
      }
    });
  };

  const drawBullets = () => {
    bullets.forEach((bullet) => {
      p.fill(255, 0, 0);
      p.noStroke();
      p.rect(bullet.x, bullet.y, 4, 16);
    });
  };

  const drawEnemies = () => {
    enemies.forEach((enemy) => {
      let img = getEnemyImage(enemy.type);
      p.image(img, enemy.x, enemy.y, 40, 40);

      if (enemy.type === 'extra' && enemy.projectiles) {
        enemy.projectiles.forEach((projectile) => {
          p.fill(255, 255, 0);
          p.noStroke();
          p.ellipse(projectile.x, projectile.y, 10, 10);
        });
      }
    });
  };

  const checkCollision = (bullet, enemy) => {
    return (
        bullet.x < enemy.x + 40 &&
        bullet.x + 4 > enemy.x &&
        bullet.y < enemy.y + 40 &&
        bullet.y + 16 > enemy.y
    );
  };

  const getEnemyImage = (type) => {
    switch (type) {
      case 'red':
        return enemyRed;
      case 'yellow':
        return enemyYellow;
      case 'green':
        return enemyGreen;
      case 'extra':
        return enemyExtra;
      default:
        return enemyRed;
    }
  };

  const moveLeft = () => {
    if (player.x > 9) {
      player.x -= 5;
    }
  };

  const moveRight = () => {
    if (player.x < width - 49) {
      player.x += 5;
    }
  };

  const checkLevelProgress = () => {
    if (enemies.length === 0) {
      levelCompleted.value = true;
      wasPaused.value = true;
      bullets = [];
      setTimeout(() => {
        levelCompleted.value = false;
        if (currentLevel.value < levels.length - 1) {
          currentLevel.value++;
          loadLevel(currentLevel.value);
          wasPaused.value = false;
        }
        if (currentLevel.value >= levels.length - 1) {
          gameOver.value = true;
          gameOverMessage.value = `Congratulations, you completed all levels! Score: ${score.value}`;
          p.noLoop();
        }
      }, 3000);
    }
  };
};const startGame = () => {
  gameOver.value = false;
  gameOverMessage.value = '';
  score.value = 0;
  lives.value = 5;
  enemies = [];
  bullets = [];
  currentLevel.value = 0;

  loadLevel(currentLevel.value);

  wasPaused.value = true;
  countdown.value = 3;

  isPaused.value = false;
  p5Instance.loop();
};

const togglePause = () => {
  if (isPaused.value) {
    p5Instance.loop(); // Resume the game loop
  } else {
    p5Instance.noLoop(); // Pause the game loop
  }
  isPaused.value = !isPaused.value;
};

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    if (document.activeElement && document.activeElement.tagName === 'BUTTON') {
      event.preventDefault();
    } else {
      if (!p5Instance._shooting) {
        shootBullet();
        p5Instance._shooting = true;
      }
    }
  }
});

document.addEventListener('keyup', (event) => {
  if (event.code === 'Space') {
    if (p5Instance) {
      p5Instance._shooting = false;
    }
  }
});

defineProps({
  initialState: {
    type: Object,
    default: () => null,
  },
});

const canvasRef = ref(null);
let p5Instance = null;

onMounted(() => {
  detectDevice();
  resizeCanvas();
  enableGyroscope();
  window.addEventListener('deviceorientation', handleDeviceOrientation);
  window.addEventListener('resize', () => {
    checkOrientation(); // Ensures correct canvas adjustments on orientation changes.
    resizeCanvas();
  });

  if (gameStateStore.level > 0) {
    currentLevel.value = gameStateStore.level;
    score.value = gameStateStore.score;
    lives.value = gameStateStore.lives;
    loadLevel(currentLevel.value);
  } else {
    currentLevel.value = 0;
    score.value = 0;
    lives.value = 5;
    loadLevel(0);
  }

  // Create the p5 instance and attach it to the canvas.
  p5Instance = new p5(sketch, canvasRef.value);

  // Add touch control event listener for mobile devices.
  const gameContainer = canvasRef.value;
  if (gameContainer) {
    console.log('Adding touchstart listener');
    gameContainer.addEventListener('touchstart', handleTouchStart);
  }
});

onUnmounted(() => {
  if (p5Instance) {
    window.removeEventListener('resize', checkOrientation);
    p5Instance.remove();
  }
  window.removeEventListener('deviceorientation', handleDeviceOrientation);

  // Remove touch control event listener
  const gameContainer = canvasRef.value;
  if (gameContainer) {
    console.log('Removing touchstart listener');
    gameContainer.removeEventListener('touchstart', handleTouchStart);
  }
});

const handleClose = () => {
  gameStateStore.level = currentLevel.value;
  gameStateStore.score = score.value;
  gameStateStore.lives = lives.value;
  gameStateStore.saveState();
  emit('close');
};

</script>
<template>
  <div v-if="gameOver" class="game-over-overlay">
    <p>{{ gameOverMessage }}</p>
    <button @click="startGame">Retry</button>
    <button @click="$emit('close')">Exit</button>
  </div>
  <div class="flex flex-between title" id="menu-container">
    <div class="flex flex-column stats">
      <p id="score">Score: {{score}} <br>Lives: {{lives}} </p>
    </div>
    <div class="flex flex-column menu">
      <button class="nav-link icon" @click="togglePause">{{ isPaused ? '▶' : '❚❚' }}</button>
      <button class="nav-link icon" @click="startGame">↺</button>
      <button
          class="nav-link icon"
          @click="handleClose"
          tabindex="-1">✖
      </button>
    </div>
  </div>
  <div ref="canvasRef" class="flex flex-column game-container" id="game-container"></div>
</template>

<style scoped>@import "@/styles/utils.css";

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

.stats {
  padding: 1rem;
  z-index: 1000;
}

.game-container {
  flex: 1 1 auto;
  width: 100vw;
  height: calc(100vh - 50px);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  box-sizing: border-box;
}

.game-container > canvas {
  display: block;
  margin: 0 auto;
}

.game-over-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
  z-index: 10;
}

.game-over-overlay button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
}

.nav-link.icon {
  position: relative;
  z-index: 10;
}

@media screen and (orientation: portrait) {
  .game-container {
    background-color: black;
    position: relative;
  }

  .game-container:before {
    content: 'Please rotate your device to landscape mode.';
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: white;
    font-size: 20px;
    background: rgba(0, 0, 0, 0.8);
    margin-bottom: 40px;
  }

  .game-container > canvas {
    display: none;
  }
}
</style>
