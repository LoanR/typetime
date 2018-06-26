<template>
    <div class="transition-window">
        <div v-if="!isEndGame" class="circle-spinner spinner" data-anim="base wrapper">
            <div class="half-left-circle spinner" data-anim="base left"></div>
            <div class="half-right-circle spinner" data-anim="base right"></div>
        </div>
        <div class="messages-container">
            <p>{{message}}</p>
            <p v-if="!isEndGame">Level {{level}}</p>
            <div v-else>
                <p>{{endGameScoreMessage}}</p>
                <p>
                    You were not fast enough to type the letter "{{nemesisLetter}}" of the word "{{stuckWord}}" on level {{level}}.
                </p>
                <button-component :content="buttonContent" @bigButtonClick="returnHome"></button-component>
                <social-sharing
                    url="https://loanr.github.io/Typetime-front/"
                    :title="socialMessage"
                    description="What a funny game!"
                    quote=""
                    hashtags="typing,nofilter,waw"
                    twitter-user=""
                    inline-template>
                    <div class="socials">
                        <network network="facebook">
                            <i class="fa fa-facebook"></i>
                        </network>
                        <network network="twitter">
                            <i class="fa fa-twitter"></i>
                        </network>
                    </div>
                </social-sharing>
            </div>
        </div>
    </div>
</template>

<script>
import random from '../../js/random.js';

import buttonComponent from '../buttons/Button.vue';

export default {
    name: 'TransitionScreen',

    props: ['isGameLaunched', 'level', 'difficulties', 'gameScore', 'nemesisLetter', 'stuckWord'],

    components: {
        'button-component': buttonComponent,
    },

    data() {
        return {
            welcomeMessage: 'Ready?',
            gameOverMessage: 'GameOver...',
            inGameMessages: [
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
            buttonContent: 'rematch',
            snail: this.isSnail,
            startSounds: [
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

        returnHome() {
            this.$emit('rematch');
        },
    },

    computed: {
        message() {
            let message = this.welcomeMessage;
            if (this.isEndGame) {
                message = this.gameOverMessage;
            }
            if (!this.isGameLaunched && !this.isEndGame) {
                message = this.inGameMessages[random.randomNum(this.inGameMessages.length, 0)];
            }
            return message;
        },

        isEndGame() {
            return !!this.nemesisLetter && !!this.stuckWord;
        },

        endGameScoreMessage() {
            let scoreMessage = 'You could have done better, but ' + this.difficultyDescription + ' you made a total of ' + this.gameScore + ' points. It is not that bad!';
            if (this.gameScore < 0) {
                scoreMessage = 'Do you know your keyboard? I mean ' + this.difficultyDescription + ' you now have a debt of ' + this.gameScore + ' points. I\'m disappointed.';
            } else if (this.gameScore === 0) {
                scoreMessage = 'Did you type anything? Well, ' + this.difficultyDescription + ' you made 0 points, that\'s not really time efficient...';
            } else if (this.gameScore < 400) {
                scoreMessage = 'You where not truly good, but ' + this.difficultyDescription + ' you made ' + this.gameScore + ' points. It is at least something...';
            } else if (this.gameScore > 2000) {
                scoreMessage = 'You\'re a beast, ' + this.difficultyDescription + ' you made ' + this.gameScore + ' points! Bravo!';
            }
            return scoreMessage;
        },

        socialMessage() {
            const intro = this.difficultyDescription ? this.difficultyDescription.charAt(0).toUpperCase() + this.difficultyDescription.slice(1) : '';
            return intro + 'I made a score of ' + this.gameScore + ' points on Typetime. This game made my day. Now, come fight me!';
        },

        difficultyDescription() {
            let checkedDifficulties = this.difficulties.filter(d => d.isChecked);
            checkedDifficulties.sort((d1, d2) => d1.stringOrder - d2.stringOrder);
            return checkedDifficulties.length ? ('as ' + checkedDifficulties[0].article + ' "' + checkedDifficulties.map(d => d.label).join(' ') + '", ') : '';
        },
    },

    mounted() {
        if (this.isGameLaunched) {
            new Audio(this.startSounds[random.randomNum(this.startSounds.length)]).play();
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

            .socials {
                display: flex;
                justify-content: space-evenly;
            }
        }
    }

</style>
