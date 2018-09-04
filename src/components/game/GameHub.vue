<template>
    <div>
        <transition name="fade-out">
            <game-component v-if="playLevel"
                :level="level"
                :wordsPerMinute="wordsPerMinute"
                :difficulties="difficulties"
                :timeAccount="timeAccount"
                :previousScore="previousScore"
                :previousLetterCombo="previousLetterCombo"
                @nextLevel="nextLevel"
                @gameOver="gameOver">
            </game-component>
            <transition-screen-component v-else
                :isGameLaunched="isGameLaunched"
                :level="level"
                :difficulties="difficulties"
                :gameScore="endGameScore"
                :nemesisLetter="nemesisLetter"
                :stuckWord="stuckWord"
                @rematch="rematch">
            </transition-screen-component>
        </transition>
    </div>
</template>

<script>
import gameTuning from '../../js/gameTuning.js';
import {randomNum} from '../../js/random.js';

import gameComponent from './Game.vue';
import transitionScreenComponent from './TransitionScreen.vue';

export default {
    name: 'GameHub',

    components: {
        'game-component': gameComponent,
        'transition-screen-component': transitionScreenComponent,
    },

    props: ['words', 'level', 'levelWordsCount', 'wordsPerMinute', 'difficulties'],

    data() {
        return {
            isGameLaunched: true,
            score: 0,
            playLevel: false,
            waitingTime: null,
            timeAccount: 0,
            previousScore: 0,
            previousLetterCombo: 0,
            endGameScore: null,
            nemesisLetter: '',
            stuckWord: '',
            startSignals: [
                require('@/assets/sounds/elevatorbell.mp3'),
                require('@/assets/sounds/microwavebell.mp3'),
                require('@/assets/sounds/hotelbell.mp3'),
            ],
        };
    },

    methods: {
        nextLevel(payload) {
            this.isGameLaunched = false;
            this.previousScore = payload.levelScore; // vuex
            this.previousLetterCombo = payload.letterCombo; // vuex
            if (gameTuning.isEconomist(this.difficulties)) {
                this.timeAccount = payload.timeAccount; // vuex
            }
            if (gameTuning.isResilient(this.difficulties)) {
                this.playLevel = true;
                this.$emit('nextLevel');
            } else {
                this.playLevel = false;
                this.$emit('nextLevel');
                this.waitThenExecute(this.isGameReady, 3000);
            }
        },

        waitThenExecute(func, time) {
            this.waitingTime = window.setInterval(func, time);
        },

        isGameReady() {
            window.clearInterval(this.waitingTime);
            if (this.$store.state.wordsRelated.wordsToType.length === this.levelWordsCount) {
                new Audio(this.startSignals[randomNum(this.startSignals.length)]).play();
                this.playLevel = true;
            } else {
                this.waitThenExecute(this.isGameReady, 500);
            }
        },

        gameOver(payload) {
            this.isGameLaunched = false;
            this.endGameScore = payload.totalScore; // vuex
            this.nemesisLetter = payload.nemesisLetter; // vuex
            this.stuckWord = payload.stuckWord; // vuex
            this.playLevel = false; // word count, letter count and other datas...
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
