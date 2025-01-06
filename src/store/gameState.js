import { defineStore } from 'pinia';

export const useGameStateStore = defineStore('gameState', {
    state: () => ({
        level: 0,
        score: 0,
        lives: 5,
    }),
    actions: {
        saveState() {
            localStorage.setItem('gameState', JSON.stringify(this.$state));
        },
        loadState() {
            const savedState = JSON.parse(localStorage.getItem('gameState'));
            if (savedState) {
                this.level = savedState.level || 0;
                this.score = savedState.score || 0;
                this.lives = savedState.lives || 5;
            }
        },
        resetState() {
            this.level = 0;
            this.score = 0;
            this.lives = 5;
        },
    },
});
