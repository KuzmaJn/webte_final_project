<script setup>
import {defineEmits} from 'vue';
import {ref, onMounted, onUnmounted} from 'vue';
import p5 from 'p5';
import Player from '@/assets/images/player.png';
import Red from '@/assets/images/red.png';
import Yellow from '@/assets/images/yellow.png';
import Green from '@/assets/images/green.png';
import Extra from '@/assets/images/extra.png';
import levels from '@/assets/levels.json'; // Súbor JSON s informáciami o úrovniach
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
let levelCompleted = ref(false); // Pridaná premenná pre kontrolu dokončenia kola
let gameOver = ref(false);
let gameOverMessage = ref('');
let pendingEnemies = [];
const gameStateStore = useGameStateStore();




let shootBullet = null; // Globálna referencia na funkciu

const handleDeviceOrientation = (event) => {
  if (!isMobile.value) return; // Len pre mobilné zariadenia

  const beta = event.beta; // Horizontálne nakláňanie (hodnoty: -90 až 90)
  if (player) {
    const sensitivity = 2; // Nastav rýchlosť posunu hráča
    player.x += beta * sensitivity;

    // Zabezpeč, aby hráč neprešiel mimo obrazovku
    player.x = Math.max(0, Math.min(player.x, width - 40));
  }
};




const enableGyroscope = async () => {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    alert('Requesting gyroscope permission...');

    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission === 'granted') {
        alert('Gyroscope permission granted');
      } else {
        alert('Gyroscope permission denied');
      }
    } catch (error) {
      alert('Error requesting gyroscope permission: ' + error.message);
    }
  } else {
    alert('Gyroscope permission not required or not supported');
  }
};
const checkOrientation = () => {
  if (isMobile.value) {
    if (window.innerWidth < window.innerHeight) {
        // Môžeš použiť CSS alebo pridať overlay na blokovanie hry
    } else {
      resizeCanvas(); // Znova prispôsob plátno pri prepnutí na šírku
    }
  }
};
const detectDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Kontrola, či ide o mobilné zariadenie
  if (/android|iphone|ipad|ipod|windows phone/i.test(userAgent)) {
    isMobile.value = true;
    alert('Používate mobilné zariadenie!');
  } else {
    isMobile.value = false;
    alert('Používate desktopové zariadenie!');
  }
};
const resizeCanvas = () => {
  // Aktualizácia rozmerov plátna
  width = window.innerWidth*0.8 ;
  height = window.innerHeight*0.9;


  // Aktualizácia pozície hráča (stredovanie podľa nových rozmerov)
  if (player) {
    player.x = width / 2 - 30; // Horizontálne stredovanie
    player.y = height * 8 / 9; // Vertikálne umiestnenie
  }

};

const handleTouchStart = (event) => {
  if (isMobile.value) {
    shootBullet(); // Volať funkciu na streľbu
  }
};



const loadLevel = (levelIndex) => {
  enemies = [];
  pendingEnemies = [];
  const level = levels[levelIndex];
  level.enemies.forEach((enemyConfig) => {
    pendingEnemies.push({
      x: Math.random() * (width - 40), // Náhodná pozícia v rámci hraníc
      y: Math.random() * -500,        // Náhodná vertikálna pozícia nad obrazovkou
      speed: enemyConfig.speed,
      remainingDelay: enemyConfig.delay,
      type: enemyConfig.type,
      lives: enemyConfig.type === 'green' ? 3 : 1, // Zelený má 3 životy, ostatní 1
      projectiles: enemyConfig.type === 'extra' ? [] : null, // Projektily pre "extra"
      shootCooldown: enemyConfig.type === 'extra' ? 0 : null, // Cooldown pre streľbu
      shootBurst: enemyConfig.type === 'extra' ? 3 : null, // Počet projektilov na zásobník
      shootCounter: enemyConfig.type === 'extra' ? 0 : null, // Počet vystrelených projektilov
      moveDirection: enemyConfig.type === 'extra' ? 1 : null, // Smer pohybu (1 = doprava, -1 = doľava)
      burstTimer: enemyConfig.type === 'extra' ? 20 : null, // Pauza medzi výstrelmi (v snímkach)
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
    p.pixelDensity(1); // Zabraňuje rozmazaniu na obrazovkách s vysokým rozlíšením
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
      p.text(`Úroveň ${currentLevel.value + 1} dokončená!`, p.width / 2, p.height / 2 - 20);
      p.text(`Pripravte sa na Úroveň ${currentLevel.value + 2}`, p.width / 2, p.height / 2 + 20);
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
    p.image(player.image, player.x, player.y, player.image.width * 2 / 3, player.image.height * 2 / 3);
  };

  shootBullet = () => {
    if (!p._shooting) {
      bullets.push({ x: player.x + (player.image.width * 1 / 3) - 2, y: player.y });
      p._shooting = true;
      setTimeout(() => (p._shooting = false), 200); // Cooldown 200 ms
      console.log('Bullet shot:', bullets); // Debug
    }
  };
  const updateBullets = () => {
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].y -= 8;

      // Check collision with enemies
      for (let j = enemies.length - 1; j >= 0; j--) {
        if (checkCollision(bullets[i], enemies[j])) {
          bullets.splice(i, 1);
          enemies[j].lives--;

          // Ak nepriateľ stratí všetky životy, pridáme body podľa jeho typu
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
    // Spracovanie čakajúcich nepriateľov (na základe delay)
    for (let i = pendingEnemies.length - 1; i >= 0; i--) {
      const pendingEnemy = pendingEnemies[i];
      pendingEnemy.remainingDelay--;

      if (pendingEnemy.remainingDelay <= 0) {
        // Pridaj nepriateľa do aktívnych nepriateľov
        enemies.push({
          x: Math.random() * (width - 40), // Náhodná horizontálna pozícia
          y: Math.random() * -500,        // Začína nad obrazovkou
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
        pendingEnemies.splice(i, 1); // Odstráň nepriateľa zo zoznamu čakajúcich
      }
    }

    // Aktualizácia pohybu a správania aktívnych nepriateľov
    enemies.forEach((enemy, index) => {
      enemy.y += enemy.speed;

      // Pohyb doprava a doľava pre nepriateľov "extra"
      if (enemy.type === 'extra') {
        enemy.x += enemy.moveDirection * 2;
        if (enemy.x <= 0 || enemy.x >= width - 40) {
          enemy.moveDirection *= -1; // Zmena smeru pohybu
        }

        // Streľba zo zásobníka
        if (enemy.shootCooldown === 0) {
          if (enemy.shootCounter < enemy.shootBurst && enemy.burstTimer === 0) {
            // Vytvor nový projektil
            enemy.projectiles.push({ x: enemy.x + 20, y: enemy.y + 40, speed: 5 });
            enemy.shootCounter++;
            enemy.burstTimer = 20; // Pauza 20 snímok (približne 0,33 sekundy pri 60 FPS)
          } else if (enemy.shootCounter >= enemy.shootBurst) {
            // Ak zásobník vystrieľal, nastav cooldown na 2 sekundy
            enemy.shootCooldown = 120;
            enemy.shootCounter = 0;
          } else {
            // Znižovanie burstTimer
            enemy.burstTimer--;
          }
        } else {
          enemy.shootCooldown--;
        }
      }

      // Pohyb a spracovanie projektilov "extra"
      if (enemy.type === 'extra' && enemy.projectiles) {
        enemy.projectiles.forEach((projectile, projIndex) => {
          projectile.y += projectile.speed;

          // Detekcia kolízie s hráčom
          if (
              projectile.x < player.x + 40 &&
              projectile.x + 10 > player.x &&
              projectile.y < player.y + 40 &&
              projectile.y + 10 > player.y
          ) {
            lives.value -= 1; // Hráč stráca 1 život
            enemy.projectiles.splice(projIndex, 1); // Odstránenie projektilu

            if (lives.value <= 0) {
              alert('Hra skončila! Skúste to znova.');
              p.noLoop(); // Zastavenie hry
            }
          }

          // Odstránenie projektilov, ktoré opustia obrazovku
          if (projectile.y > height) {
            enemy.projectiles.splice(projIndex, 1);
          }
        });
      }

      // Ak nepriateľ prejde obrazovkou
      if (enemy.y > height) {
        if (enemy.type === 'red') lives.value -= 1;
        if (enemy.type === 'yellow') lives.value -= 2;
        if (enemy.type === 'green') lives.value -= 3;

        if (lives.value <= 0) {
          gameOver.value = true;
          gameOverMessage.value = `Prehrali ste! Skóre: ${score.value}, Level: ${currentLevel.value + 1}`;
          p.noLoop(); // Zastavenie hry
        }

        enemies.splice(index, 1); // Odstrániť nepriateľa
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

      // Vykresľovanie projektilov pre "extra"
      if (enemy.type === 'extra' && enemy.projectiles) {
        enemy.projectiles.forEach((projectile) => {
          p.fill(255, 255, 0); // Žltá farba pre projektily
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

      setTimeout(() => {
        levelCompleted.value = false;
        if (currentLevel.value < levels.length - 1) {
          currentLevel.value++;
          loadLevel(currentLevel.value);
          wasPaused.value = false;
        }
        if (currentLevel.value >= levels.length - 1) {
          gameOver.value = true;
          gameOverMessage.value = `Gratulujeme, dokončili ste všetky úrovne! Skóre: ${score.value}`;
          p.noLoop(); // Zastavenie hry
        }

      }, 3000); // Pauza na zobrazenie správy
    }

  };
};
const startGame = () => {
  gameOver.value = false; // Skryj overlay pre koniec hry
  gameOverMessage.value = ''; // Vyčisti správu o konci hry
  score.value = 0; // Inicializuj skóre
  lives.value = 5; // Počet životov na začiatku
  enemies = []; // Vyčisti nepriateľov
  bullets = []; // Vyčisti strely hráča
  currentLevel.value = 0; // Začiatok od prvého levelu

  // Načítaj prvý level
  loadLevel(currentLevel.value);

  wasPaused.value = true; // Aktivuj pauzu
  countdown.value = 3; // Odpočet na 3 sekundy

  // Obnov p5 slučku
  isPaused.value = false;
  p5Instance.loop();
};


const togglePause = () => {
  if (isPaused.value) {
    p5Instance.loop(); // Obnoví kreslenie
  } else {
    p5Instance.noLoop(); // Zastaví kreslenie
  }
  isPaused.value = !isPaused.value; // Prepnúť stav pauzy
};
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    if (document.activeElement && document.activeElement.tagName === 'BUTTON') {
      event.preventDefault(); // Zabraň aktivácii tlačidla, ak je vo fokuse
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
      p5Instance._shooting = false; // Reset streľby pri uvoľnení klávesu
    }
  }
});

defineProps({
  initialState: {
    type: Object,
    default: () => null, // Ak nie je odovzdaný stav, použije sa predvolená hodnota
  },
});

const canvasRef = ref(null);
let p5Instance = null;


const testGyroscopeSupport = () => {
  if ('DeviceOrientationEvent' in window) {
    alert('DeviceOrientationEvent is supported');
  } else {
    alert('DeviceOrientationEvent is NOT supported');
  }
};

onMounted(() => {
  detectDevice();
  resizeCanvas();
  testGyroscopeSupport()
  enableGyroscope();
  window.addEventListener('deviceorientation', handleDeviceOrientation);
  window.addEventListener('resize', () => {
    checkOrientation(); // Skontroluje orientáciu a prispôsobí plátno
    resizeCanvas(); // Zabezpečí správne rozmery plátna
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
  // Vytvorenie p5 inštancie
  p5Instance = new p5(sketch, canvasRef.value);

  // Pridanie event listenera na dotykové ovládanie
  const gameContainer = canvasRef.value;
  if (gameContainer) {
    console.log('Adding touchstart listener'); // Debug: overenie listenera
    gameContainer.addEventListener('touchstart', handleTouchStart);
  }
});

onUnmounted(() => {
  if (p5Instance) {
    window.removeEventListener('resize', checkOrientation);
    p5Instance.remove();
  }
  window.removeEventListener('deviceorientation', handleDeviceOrientation);
  // Odstránenie event listenera na dotykové ovládanie
  const gameContainer = canvasRef.value;
  if (gameContainer) {
    console.log('Removing touchstart listener'); // Debug: overenie listenera
    gameContainer.removeEventListener('touchstart', handleTouchStart);
  }
});

const handleClose = () => {
  gameStateStore.level = currentLevel.value;
  gameStateStore.score = score.value;
  gameStateStore.lives = lives.value;
  gameStateStore.saveState(); // Ulož stav
  emit('close'); // Zavolá sa @close na Home.vue
};


</script>
<template>
  <div v-if="gameOver" class="game-over-overlay">
    <p>{{ gameOverMessage }}</p>
    <button @click="startGame">Znova</button>
    <button @click="$emit('close')">Koniec</button>
  </div>
  <div class="flex flex-between title" id="menu-container">
    <div class="flex flex-column stats">
      <p id="score">Skóre: {{score}} <br>Životy:{{lives}} </p>
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

/* Hlavné nastavenie pre titulok */
.title {
  position: absolute;
  width: 100vw;
  flex: 0 1 auto;
}

/* Štýly pre menu */
.menu {
  justify-content: space-between;
  align-items: initial;
  padding: 1rem;
}

/* Štýly pre štatistiky */
.stats {
  padding: 1rem;
}

/* Kontajner pre hru */
.game-container {
  flex: 1 1 auto;
  width: 100vw;
  height: calc(100vh - 50px); /* Nastav výšku plátna a ponechaj 50px medzeru dole */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  box-sizing: border-box; /* Uisti sa, že padding nevplýva na veľkosť */
}

/* Samotné plátno */
.game-container > canvas {
  display: block;
  margin: 0 auto; /* Centrovanie plátna */
}

/* Overlay pre koniec hry */
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
  z-index: 10; /* Zabezpečí, že tlačidlá budú nad ostatnými elementmi */
}

/* Štýly pre režim na výšku */
@media screen and (orientation: portrait) {
  .game-container {
    background-color: black;
    position: relative;
  }

  .game-container:before {
    content: 'Prosím, otočte zariadenie na šírku.';
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
    display: none; /* Skry plátno v režime na výšku */
  }
}


</style>