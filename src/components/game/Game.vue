<template>
    <div class="game-window" @click="reFocus">
        <p class="awaited-word">
            <span v-for="(letter, index) in wordToTypeLetters" :key="index" ref="letterToType">{{letter}}</span>
        </p>
        <p>{{countdownDisplay}}</p>
        <p>Level {{level}}</p>
        <div><span>combo</span><span>time</span><span>points</span></div>
        <p>Score: {{levelScore}}</p>
        <div>
            <span v-for="i in wordToTypeIndex" :key="i">•</span>
        </div>
        <input :disabled="!canStillPlay" type="text" name="" ref="gameInput" @blur="reFocus" @input="compareInputToExpected" v-model="entry">
    </div>
</template>

<script>
import scoreCalculator from '../../js/scoreCalculator.js';

export default {
    name: 'Game',

    props: ['words', 'level', 'wordsPerMinute', 'isSnail', 'isEconomist', 'isResilient', 'isMasochist', 'timeAccount', 'previousScore'],

    data() {
        return {
            wordToTypeIndex: 0,
            letterToTypeIndex: 0,
            entry: '',
            previousEntry: '',
            wordCountDown: 0,
            interval: null,
            canStillPlay: true,
            hundrethSecondMinute: 6000,
            levelScore: 0,
            letterCombo: 0,
        };
    },

    methods: {
        reFocus() {
            this.$refs.gameInput.focus();
        },

        compareInputToExpected() {
            if (this.entry.length) {
                const currentLetterElement = this.$refs.letterToType[this.letterToTypeIndex];
                if (this.wordToTypeLetters[this.letterToTypeIndex] === this.entry) {
                    this.letterCombo += 1;
                    this.levelScore += scoreCalculator.getLetterScore(this.entry, this.letterCombo, this.level, this.isSnail, this.isResilient, this.isMasochist);
                    this.stylizeWithClass(currentLetterElement, false, 'letter-error');
                    this.stylizeWithClass(currentLetterElement, true, 'letter-found');
                    this.nextLetterToFind();
                } else {
                    this.levelScore -= scoreCalculator.getLetterScore(this.entry, this.letterCombo, this.level, this.isSnail, this.isResilient, this.isMasochist);
                    this.letterCombo = 0;
                    this.stylizeWithClass(currentLetterElement, true, 'letter-error');
                }
                if (this.letterToTypeIndex === this.wordToType.length) {
                    for (let span of this.$refs.letterToType) {
                        this.stylizeWithClass(span, false, 'letter-error');
                        this.stylizeWithClass(span, false, 'letter-found');
                    }
                    if (!this.isEconomist && !this.isSnail) {
                        this.levelScore += parseInt((this.wordCountDown / 10).toFixed());
                    } else if (this.isSnail) {
                        this.levelScore += parseInt((this.wordCountDown / 20).toFixed());
                    }
                    this.letterToTypeIndex = 0;
                    if (this.wordToTypeIndex < this.words.length - 1) {
                        this.clearCountdown();
                        this.wordToTypeIndex += 1;
                    } else {
                        this.$emit('nextLevel', {
                            isResilient: this.isResilient,
                            isEconomist: this.isEconomist,
                            timeAccount: this.wordCountDown,
                            levelScore: this.levelScore,
                        });
                        this.wordToTypeIndex = 0;
                    }
                    this.setNewWordEnv(this.$refs.letterToType[this.letterToTypeIndex], true, 'letter-to-type');
                }
            }
            this.entry = '';
        },

        stylizeWithClass(element, shouldAdd, styleClass) {
            if (shouldAdd) {
                element.classList.add(styleClass);
            } else {
                element.classList.remove(styleClass);
            }
        },

        nextLetterToFind() {
            if (this.letterToTypeIndex < this.wordToType.length) {
                this.stylizeWithClass(this.$refs.letterToType[this.letterToTypeIndex], false, 'letter-to-type');
                this.letterToTypeIndex += 1;
                if (this.letterToTypeIndex < this.wordToType.length) {
                    this.stylizeWithClass(this.$refs.letterToType[this.letterToTypeIndex], true, 'letter-to-type');
                }
            }
        },

        modifyCountdownDisplay() {
            if (this.wordCountDown > 0) {
                this.wordCountDown -= 1;
            } else {
                this.timeExceeded();
            }
        },

        launchNewCountdown() {
            let countDown = this.isEconomist ? (this.allotedTime + this.wordCountDown) : this.allotedTime;
            this.wordCountDown = countDown > 1200 ? 1200 : parseInt(countDown.toFixed());
            this.interval = window.setInterval(this.modifyCountdownDisplay, 10);
        },

        clearCountdown() {
            window.clearInterval(this.interval);
        },

        timeExceeded() {
            this.wordCountDown = 0;
            this.canStillPlay = false;
            this.clearCountdown();
            this.$emit('gameOver', {
                totalScore: parseInt(this.levelScore.toFixed()),
                nemesisLetter: this.wordToTypeLetters[this.letterToTypeIndex],
                stuckWord: this.wordToType,
            });
        },

        setNewWordEnv(element, shouldAdd, styleClass) {
            if (this.isResilient) {
                this.$nextTick(function() {
                    this.launchNewCountdown();
                    this.stylizeWithClass(element, shouldAdd, styleClass);
                });
            } else {
                this.launchNewCountdown();
                this.stylizeWithClass(element, shouldAdd, styleClass);
            }
        },
    },

    computed: {
        wordToType() {
            return this.words[this.wordToTypeIndex];
        },

        wordToTypeLetters() {
            return this.wordToType.split('');
        },

        allotedTime() {
            return this.hundrethSecondMinute / (this.wordsPerMinute + this.level - 1);
        },

        countdownDisplay() {
            return (this.wordCountDown / 100).toFixed(2);
        },
    },

    mounted() {
        this.$refs.gameInput.focus();
        this.stylizeWithClass(this.$refs.letterToType[this.letterToTypeIndex], true, 'letter-to-type');
        this.launchNewCountdown();
        this.wordCountDown += this.timeAccount;
        this.levelScore += this.previousScore;
    },
};
</script>

<style lang="scss" scoped>
    @import '../../styles/common';

    @keyframes splat {
        0% {font-size: calc(#{$big-font-size} + 0.3rem);}
        40% {font-size: calc(#{$big-font-size} - 0.1rem);}
        80% {font-size: $big-font-size;}
    }

    .game-window {
        position: relative;
        overflow: hidden;
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .awaited-word {
            margin: 0;

            span {
                font-family: $brand-font;
                font-weight: $bold-weight;
                font-size: $big-font-size;
                color: $contrast-color;
                position: relative;
            }

            .letter-to-type::after {
                position: absolute;
                content: '';
                width: 100%;
                height: 0.6rem;
                left: 0;
                bottom: -0.6rem;
                background-color: $light-base-color;
            }

            .letter-found {
                color: $light-base-color;
                transition: all 0.2s cubic-bezier(0.5,0,0,1);;
            }

            .letter-error {
                color: $warning-color;
                animation: splat 0.2s 1;
            }
        }

        input {
            position: absolute;
            top: -50px;
        }
    }
</style>
