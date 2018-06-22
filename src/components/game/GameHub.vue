<template>
    <div>
        <game-component v-if="playLevel"
            :words="words"
            :level="level"
            :wordsPerMinute="wordsPerMinute"
            :isSnail="isSnail"
            :isEconomist="isEconomist"
            :isResilient="isResilient"
            :isMasochist="isMasochist"
            :timeAccount="timeAccount"
            :previousScore="previousScore"
            @nextLevel="nextLevel"
            @gameOver="gameOver">
        </game-component>
        <transition-screen-component v-else
            :isGameLaunched="isGameLaunched"
            :level="level"
            :isSnail="isSnail"
            :isEconomist="isEconomist"
            :isResilient="isResilient"
            :isMasochist="isMasochist"
            :gameScore="endGameScore"
            :nemesisLetter="nemesisLetter"
            :stuckWord="stuckWord"
            @rematch="rematch">
        </transition-screen-component>
    </div>
</template>

<script>
import gameComponent from './Game.vue';
import transitionScreenComponent from './TransitionScreen.vue';

export default {
    name: 'GameHub',

    components: {
        'game-component': gameComponent,
        'transition-screen-component': transitionScreenComponent,
    },

    props: ['words', 'level', 'levelWordsCount', 'wordsPerMinute', 'isSnail', 'isEconomist', 'isResilient', 'isMasochist'],

    data() {
        return {
            isGameLaunched: true,
            score: 0,
            playLevel: false,
            waitingTime: null,
            timeAccount: 0,
            previousScore: 0,
            endGameScore: null,
            nemesisLetter: '',
            stuckWord: '',
        };
    },

    methods: {
        nextLevel(payload) {
            this.isGameLaunched = false;
            this.previousScore = payload.levelScore;
            if (payload.isEconomist) {
                this.timeAccount = payload.timeAccount;
            }
            if (payload.isResilient) {
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
            if (this.words.length === this.levelWordsCount) {
                this.playLevel = true;
            } else {
                this.waitThenExecute(this.isGameReady, 500);
            }
        },

        gameOver(payload) {
            this.isGameLaunched = false;
            this.endGameScore = payload.totalScore;
            this.nemesisLetter = payload.nemesisLetter;
            this.stuckWord = payload.stuckWord;
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
    }
</style>
