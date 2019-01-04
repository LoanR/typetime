<template>
    <div>
        <transition name="fade-out">
            <game-component v-if="playLevel"
                @nextLevelBreak="nextLevelBreak"
                @gameOver="gameOver">
            </game-component>
            <transition-screen-component v-else
                :isGameLaunched="isGameLaunched"
                :isGameOver="isGameOver"
                @rematch="rematch">
            </transition-screen-component>
        </transition>
    </div>
</template>

<script>
import random from '../../core/random.js';
import {START_SIGNALS} from '@/conf/sounds.js';

import gameComponent from './Game.vue';
import transitionScreenComponent from './TransitionScreen.vue';

export default {
    name: 'GameHub',

    components: {
        'game-component': gameComponent,
        'transition-screen-component': transitionScreenComponent,
    },

    data() {
        return {
            isGameLaunched: true,
            isGameOver: false,
            score: 0,
            playLevel: false,
            waitingTime: null,
            timeAccount: 0,
            previousScore: 0,
            previousLetterCombo: 0,
            startSignals: START_SIGNALS,
        };
    },

    methods: {
        nextLevelBreak() {
            this.isGameLaunched = false;
            this.playLevel = false;
            this.waitThenExecute(this.isGameReady, 3000);
        },

        waitThenExecute(func, time) {
            this.waitingTime = window.setInterval(func, time);
        },

        isGameReady() {
            window.clearInterval(this.waitingTime);
            if (this.$store.state.wordsRelated.wordsToType.length === this.$store.state.rules.levelRules.wordAmount) {
                new Audio(random.selectRandomEntity(this.startSignals)).play();
                this.playLevel = true;
            } else {
                this.waitThenExecute(this.isGameReady, 500);
            }
        },

        gameOver() {
            this.isGameOver = true;
            this.isGameLaunched = false;
            this.playLevel = false;
        },

        rematch() {
            this.$emit('rematch');
        },
    },

    mounted() {
        this.waitThenExecute(this.isGameReady, 3000);
    },
};
</script>

<style lang="scss" scoped>
    @import '../../styles/common';

    div {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        &>* {
            position: absolute;
            top: 0px;
        }
    }

    .fade-out-leave-active {
        transition: all 0.15s ease-out;
    }
    .fade-out-leave-to {
        opacity: 0;
    }
    .fade-out-leave {
        opacity: 1;
    }
</style>
