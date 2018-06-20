<template>
    <div>
        <game-component v-if="playLevel"
            :words="words"
            :level="level"
            :wordsPerMinute="wordsPerMinute"
            :isResilient="isResilient"
            :isEconomist="isEconomist"
            :timeAccount="timeAccount"
            @nextLevel="nextLevel">
        </game-component>
        <transition-screen-component v-else></transition-screen-component>
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

    props: ['words', 'level', 'levelWordsCount', 'wordsPerMinute', 'isResilient', 'isEconomist'],

    data() {
        return {
            truc: true,
            score: 0,
            playLevel: false,
            waitingTime: null,
            timeAccount: 0,
        };
    },

    methods: {
        nextLevel(payload) {
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
