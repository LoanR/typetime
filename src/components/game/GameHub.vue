<template>
    <div>
        <game-component v-if="playLevel" :words="words" :level="level" @nextLevel="nextLevel"></game-component>
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

    props: ['words', 'level'],

    data() {
        return {
            truc: true,
            score: 0,
            playLevel: false,
            waitingTime: null,
        };
    },

    methods: {
        nextLevel() {
            this.playLevel = false;
            this.$emit('nextLevel');
            this.waitThenExecute(this.isGameReady, 3000);
        },

        waitThenExecute(func, time) {
            this.waitingTime = window.setInterval(func, time);
        },

        isGameReady() {
            window.clearInterval(this.waitingTime);
            if (this.words.length) {
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
