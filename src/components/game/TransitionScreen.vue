<template>
    <div class="transition-window">
        <div v-if="!isGameOver" class="circle-spinner spinner" data-anim="base wrapper">
            <div class="half-left-circle spinner" data-anim="base left"></div>
            <div class="half-right-circle spinner" data-anim="base right"></div>
        </div>
        <div class="messages-container">
            <div v-if="!isGameOver">
                <p>{{message}}</p>
                <p>Level {{gameLevel}}</p>
            </div>
            <score-screen-component v-else @rematch="rematch"></score-screen-component>
        </div>
    </div>
</template>

<script>
import random from '@/core/random.js';

import scoreScreenComponent from '@/components/game/ScoreScreen.vue';

export default {
    name: 'TransitionScreen',

    props: ['isGameLaunched', 'isGameOver'],

    components: {
        'score-screen-component': scoreScreenComponent,
    },

    data() {
        return {
            welcomeMessage: 'Ready?', // conf
            inGameMessages: [ // conf
                'You\'ve seen better days, don\'t you?',
                'You\'re not that fast actually...',
                'You lied, you weren\'t ready.',
                'Time to stretch your fingers!',
                'Shouldn\'t you be working?',
                'Come on, shake yourself up!',
                'Are you sure you can continue?',
                'The previous level was simpler, wasn\'t it?',
                'You were better last time...',
                'The "H" key is near the middle of your keyboard.',
                'This phrase in really long, so I\'m sure you won\'t be able to read it because of the long time it could take. In fact, you could even lose you\'re concentration and I surely don\'t want to do that you know.',
            ],
            startSounds: [ // conf
                require('@/assets/sounds/mk_startrace.mp3'),
                require('@/assets/sounds/pkbattle.mp3'),
                require('@/assets/sounds/pacmanintro.mp3'),
            ],
        };
    },

    methods: {
        nextLevel() {
            this.$emit('nextLevel');
        },

        rematch() {
            this.$emit('rematch');
        },
    },

    computed: {
        message() {
            if (!this.isGameLaunched && !this.isGameOver) {
                return random.selectRandomEntity(this.inGameMessages);
            }
            return this.welcomeMessage;
        },

        gameLevel() {
            return this.$store.state.rules.levelRules.currentLevel;
        },
    },

    mounted() {
        if (this.isGameLaunched) {
            new Audio(random.selectRandomEntity(this.startSounds)).play();
        }
    },
};
</script>

<style lang="scss" scoped>
    @import '../../styles/common';

    @keyframes right-spin {
        from {transform: rotate(0deg);}
        to {transform: rotate(180deg);}
    }

    @keyframes left-spin {
        from {transform: rotate(0deg);}
        to {transform: rotate(360deg);}
    }

    @keyframes end-spin {
        to {clip: rect(auto, auto, auto, auto);}
    }

    .transition-window {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .spinner {
            animation-iteration-count: 1;
            animation-fill-mode: forwards;
            animation-timing-function: linear;
            z-index: -1;
        }

        .circle-spinner {
            width: 300px;
            height: 300px;
            position: absolute;
            clip: rect(0px, 300px, 300px, 150px);
            animation-duration: 0.01s;
            animation-delay: 0.8s;
            animation-name: end-spin;

            .half-left-circle, .half-right-circle {
                width: 200px;
                height: 200px;
                border: 50px solid $light-base-color;
                border-radius: 150px;
                position: absolute;
                clip: rect(0px, 150px, 300px, 0px);
            }

            .half-left-circle {
                animation-duration: 3s;
                border: 50px solid $light-base-color;
                animation-timing-function: cubic-bezier(0,0,.375,1);
                animation-name: left-spin;
            }

            .half-right-circle {
                animation-duration: 0.8s;
                animation-name: right-spin;
            }
        }

        .messages-container {
            max-width: 400px;
        }
    }

</style>
