<template>
    <div class="game-window" @click="reFocus">
        <p class="awaited-word">
            <span class="awaited-letter" v-for="(letter, index) in wordToTypeLetters" :key="index" ref="letterToType">{{letter}}</span>
            <span class="caps-indicator" v-if="capsStatus">
                <i class="fa fa-lock" aria-hidden="true"></i>
                <i class="fa fa-arrow-up" aria-hidden="true"></i>
            </span>
        </p>
        <p class="countdown" ref="countdown">{{countdownDisplay}}</p>
        <div class="score-related">
            <p class="game-level">Level {{level}}</p>
            <p class="game-score"><span class="score-default combo" ref="comboIndicator">Combo&times;{{combo}}</span><span>{{levelScore}} pts</span><span class="score-default bonus" ref="scoreIndicator">{{scoreChange}}</span></p>
            <div class="word-indicators">
                <span v-for="i in this.$store.state.wordsRelated.wordsToType.length" :key="i" ref="wordIndicator">•</span>
            </div>
        </div>
        <a class="stop-link" @click="timeExceeded">stop game</a>
        <input :disabled="!canStillPlay" type="text" name="" ref="gameInput" @input="compareInputToExpected" v-model="entry" v-on:keydown.20="checkCapsKeyDown">
    </div>
</template>

<script>
import scoreCalculator from '../../js/scoreCalculator.js';
import gameTuning from '../../js/gameTuning.js';
import {randomNum} from '../../js/random.js';

export default {
    name: 'Game',

    props: ['level', 'wordsPerMinute', 'difficulties', 'timeAccount', 'previousScore', 'previousLetterCombo'],

    data() {
        return {
            wordToTypeIndex: 0,
            letterToTypeIndex: 0,
            isSnail: gameTuning.isSnail(this.difficulties), // vuex
            isEconomist: gameTuning.isEconomist(this.difficulties), // vuex
            isResilient: gameTuning.isResilient(this.difficulties), // vuex
            isMasochist: gameTuning.isMasochist(this.difficulties), // vuex
            entry: '',
            previousEntry: '',
            wordCountDown: 0,
            interval: null,
            showPreparation: false,
            canStillPlay: true,
            hundrethSecondMinute: 6000,
            levelScore: 0,
            letterCombo: 0,
            combo: 1,
            scoreChange: 0,
            errorStyle: null,
            scoreIndicatorStyle: null,
            comboIndicatorStyle: null,
            comboIndicatorStyle2: null,
            capsStatus: false,
            countdownEnd: new Audio(require('@/assets/sounds/countdownend.mp3')),
            loseSound: [
                require('@/assets/sounds/powerdown.wav'),
                require('@/assets/sounds/mk64_loser.mp3'),
                require('@/assets/sounds/tetrislose.mp3'),
                require('@/assets/sounds/mario1down.mp3'),
                require('@/assets/sounds/mariogameover.mp3'),
                require('@/assets/sounds/yoshiowow.mp3'),
                require('@/assets/sounds/pacmandies.mp3'),
            ],
            wordSound: [
                require('@/assets/sounds/mariocoin.mp3'),
                require('@/assets/sounds/completion.mp3'),
                require('@/assets/sounds/ding.mp3'),
                require('@/assets/sounds/crashselect.mp3'),
                require('@/assets/sounds/sonicring.mp3'),
                require('@/assets/sounds/mario1up.mp3'),
            ],
            errorSound: [
                require('@/assets/sounds/denied.wav'),
                require('@/assets/sounds/kirby_powerdown.mp3'),
                require('@/assets/sounds/moderatehit.mp3'),
                require('@/assets/sounds/moderatehit2.mp3'),
                require('@/assets/sounds/shellhit.mp3'),
                require('@/assets/sounds/stronghit.mp3'),
                require('@/assets/sounds/basso.mp3'),
                require('@/assets/sounds/frog.mp3'),
                require('@/assets/sounds/funk.mp3'),
                require('@/assets/sounds/susomi.mp3'),
            ],
            levelSound: [
                require('@/assets/sounds/powerup.wav'),
                require('@/assets/sounds/sprout.wav'),
                require('@/assets/sounds/yoshiyoshi.wav'),
                require('@/assets/sounds/tetrisclear.mp3'),
                require('@/assets/sounds/pkbattlewin.mp3'),
                require('@/assets/sounds/zeldaitem.mp3'),
                require('@/assets/sounds/mariopowerup.mp3'),
                require('@/assets/sounds/mariowarp.mp3'),
            ],
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
                    this.letterTypedCorrect(currentLetterElement);
                } else {
                    this.letterTypedIncorrect(currentLetterElement);
                }
                if (this.letterToTypeIndex === this.wordToType.length) {
                    this.wordCompleted();
                }
            }
            this.entry = '';
        },

        letterTypedCorrect(letterElement) {
            this.letterCombo += 1;
            this.scoreChange = this.getLetterScore(this.entry, this.letterCombo, this.level, this.isSnail, this.isResilient, this.isMasochist);
            this.stylizeWithClass(letterElement, true, 'letter-found');
            this.levelScore += this.scoreChange;
            this.nextLetterToFind();
        },

        letterTypedIncorrect(letterElement) {
            new Audio(this.errorSound[randomNum(this.errorSound.length)]).play();
            this.stylizeWithClass(letterElement, true, 'letter-error');
            this.errorStyle = window.setTimeout(this.stylizeWithClass, 100, letterElement, false, 'letter-error');
            this.stylizeWithClass(this.$refs.scoreIndicator, true, 'score-malus');
            this.scoreIndicatorStyle = window.setTimeout(this.stylizeWithClass, 300, this.$refs.scoreIndicator, false, 'score-malus');
            this.scoreChange = -this.getLetterScore(this.entry, this.letterCombo, this.level, this.isSnail, this.isResilient, this.isMasochist);
            this.levelScore += this.scoreChange;
            this.stylizeWithClass(this.$refs.comboIndicator, true, 'score-malus');
            this.letterCombo = 0;
            this.combo = scoreCalculator.getFinalMultiplier(this.letterCombo, this.isSnail, this.isMasochist, this.isResilient, this.level);
            this.comboIndicatorStyle = window.setTimeout(this.stylizeWithClass, 300, this.$refs.comboIndicator, false, 'score-malus');
        },

        wordCompleted() {
            this.clearCountdown();
            for (let span of this.$refs.letterToType) {
                this.stylizeWithClass(span, false, 'letter-found');
            }
            let timeScore = 0;
            if (!this.isEconomist && !this.isSnail) {
                timeScore = parseInt((this.wordCountDown / 10).toFixed()) * this.combo;
            } else if (this.isSnail) {
                timeScore = parseInt((this.wordCountDown / 3000).toFixed()) * this.combo;
            }
            this.scoreChange += timeScore;
            this.levelScore += timeScore;
            this.letterToTypeIndex = 0;
            if (this.wordToTypeIndex < this.$store.state.wordsRelated.wordsToType.length - 1) {
                this.levelWordsRemains();
            } else {
                this.moveToNextLevel();
            }
            this.setNewWordEnv(this.$refs.letterToType[this.letterToTypeIndex], true, 'letter-to-type');
        },

        levelWordsRemains() {
            this.stylizeWithClass(this.$refs.wordIndicator[this.wordToTypeIndex], true, 'word-found');
            new Audio(this.wordSound[randomNum(this.wordSound.length)]).play();
            this.wordToTypeIndex += 1;
        },

        moveToNextLevel() {
            for (let span of this.$refs.wordIndicator) {
                this.stylizeWithClass(span, false, 'word-found');
            }
            if (!this.isResilient) {
                this.showPreparation = true;
            }
            new Audio(this.levelSound[randomNum(this.levelSound.length)]).play();
            this.stylizeWithClass(this.$refs.comboIndicator, false, 'score-malus');
            this.stylizeWithClass(this.$refs.comboIndicator, false, 'score-bonus');
            this.stylizeWithClass(this.$refs.scoreIndicator, false, 'score-malus');
            this.$emit('nextLevel', {
                timeAccount: this.wordCountDown, // vuex
                levelScore: this.levelScore, // vuex
                letterCombo: this.letterCombo, // vuex
            });
            window.clearTimeout(this.errorStyle);
            window.clearTimeout(this.scoreIndicatorStyle);
            window.clearTimeout(this.comboIndicatorStyle);
            window.clearTimeout(this.comboIndicatorStyle2);
            this.wordToTypeIndex = 0;
        },

        getLetterScore(letter, letterCombo, level, isSnail, isResilient, isMasochist) {
            const tempCombo = this.combo;
            this.combo = scoreCalculator.getFinalMultiplier(letterCombo, isSnail, isMasochist, isResilient, level);
            if (this.combo > tempCombo) {
                this.stylizeWithClass(this.$refs.comboIndicator, true, 'score-bonus');
                this.comboIndicatorStyle2 = window.setTimeout(this.stylizeWithClass, 300, this.$refs.comboIndicator, false, 'score-bonus');
            }
            const lsMapping = scoreCalculator.getLetterScoreMapping();
            if (letter.toLowerCase() === letter) {
                return lsMapping[letter] ? lsMapping[letter] * this.combo : 1 * this.combo;
            }
            return lsMapping[letter] ? (lsMapping[letter] + 1) * this.combo : 1 * this.combo;
        },

        stylizeWithClass(element, shouldAdd, styleClass) {
            if (element) {
                if (shouldAdd) {
                    element.classList.add(styleClass);
                } else {
                    element.classList.remove(styleClass);
                }
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

        modifyCountdown() {
            if (this.wordCountDown > 0) {
                if (this.wordCountDown < this.allotedTime / 2) {
                    this.countdownEnd.play();
                    if (!this.$refs.countdown.classList.contains('near-end')) {
                        this.$refs.countdown.classList.add('near-end');
                    }
                }
                this.wordCountDown -= 1;
            } else {
                this.$refs.countdown.classList.remove('near-end');
                if (this.canStillPlay && !this.showPreparation) {
                    this.timeExceeded();
                } else if (this.showPreparation) {
                    this.clearCountdown();
                }
            }
        },

        launchNewCountdown() {
            this.$refs.countdown.classList.remove('near-end');
            let countDown = this.isEconomist ? (this.allotedTime + this.wordCountDown) : this.allotedTime;
            this.wordCountDown = countDown > 3000 ? 3000 : parseInt(countDown.toFixed());
            if (!this.showPreparation) {
                this.interval = window.setInterval(this.modifyCountdown, 10);
            };
        },

        clearCountdown() {
            this.countdownEnd.pause();
            this.countdownEnd.currentTime = 0;
            window.clearInterval(this.interval);
        },

        timeExceeded() {
            new Audio(this.loseSound[randomNum(this.loseSound.length)]).play();
            this.wordCountDown = 0;
            this.clearCountdown();
            this.canStillPlay = false;
            this.$emit('gameOver', {
                totalScore: parseInt(this.levelScore.toFixed()), // vuex
                nemesisLetter: this.wordToTypeLetters[this.letterToTypeIndex], // vuex
                stuckWord: this.wordToType, // vuex
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

        checkCapsKeyDown(event) {
            this.capsStatus = event.getModifierState('CapsLock');
        },
    },

    computed: {
        wordToType() {
            return this.$store.state.wordsRelated.wordsToType[this.wordToTypeIndex];
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
        this.wordCountDown += this.timeAccount; // vuex
        this.levelScore = this.previousScore; // vuex
        this.letterCombo = this.previousLetterCombo; // vuex
        this.combo = scoreCalculator.getFinalMultiplier(this.letterCombo, this.isSnail, this.isMasochist, this.isResilient, this.level);
        this.showPreparation = false;
    },
};
</script>

<style lang="scss" scoped>
    @import '../../styles/common';

    @keyframes splat {
        0% {font-size: $big-font-size; color: $warning-color;}
        30% {font-size: calc(#{$big-font-size} + 0.3rem); color: $warning-color;}
        80% {font-size: calc(#{$big-font-size} - 0.1rem); color: $warning-color;}
        100% {font-size: $big-font-size; color: $contrast-color;}
    }

    @keyframes countdown-pulsate {
        0% {color: $warning-color;}
        80% {color: $contrast-color;}
    }

    @keyframes cursor-pulse {
        0% {background-color: $light-base-color;}
        49% {background-color: $light-base-color;}
        50% {background-color: $base-color}
        99% {background-color: $base-color}
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

            .awaited-letter {
                font-family: $brand-font;
                font-weight: $bold-weight;
                font-size: $big-font-size;
                color: $contrast-color;
                position: relative;

                @media all and (max-width: 500px) {
                    font-size: 10vw;
                }
            }

            .caps-indicator {
                position: relative;
                left: 1rem;
                width: 0;
                height: 30px;
                text-align: center;

                i {
                    position: absolute;
                    bottom: 0;
                }

                i:first-child {
                    color: $light-base-color;
                }

                i:nth-child(2) {
                    color: $base-color;
                    font-size: 40%;
                    left: 3px;
                    bottom: 3px;
                }
            }

            .letter-to-type::after {
                position: absolute;
                content: '';
                width: 100%;
                height: 0.6rem;
                left: 0;
                bottom: -0.6rem;
                background-color: $light-base-color;
                animation: cursor-pulse 1s linear infinite;
            }

            .letter-found {
                color: $light-base-color;
                transition: all 0.2s cubic-bezier(0.5,0,0,1);
            }

            .letter-error {
                animation: splat 0.2s 1;
            }
        }

        .countdown {
            @media all and (max-width: 500px) {
                font-size: 4vw;
            }
        }

        .near-end {
            animation: countdown-pulsate 0.2s linear infinite;
        }

        .score-related {
            color: $light-base-color;

            @media all and (max-width: 500px) {
                font-size: 4vw;
            }

            .game-level, .game-score {
                margin: 30px;
            }

            .game-score {
                position: relative;
            }

            .score-default {
                transition: color 0.2s cubic-bezier(0.5,0,0,1);
                display: inline-block;
                position: absolute;

                &.combo {
                    right: 100%;
                    top: -17px;
                    transform: rotate(-4deg);
                }

                &.bonus {
                    left: 100%;
                    top: -19px;
                    transform: rotate(4deg);
                }
            }

            .word-indicators .word-found {
                color: $contrast-color;
            }

            .score-malus {
                color: $warning-color;
                transition: none;
            }

            .score-bonus {
                color: $brand-color;
                font-size: calc(#{$base-font-size} + 0.3rem);
                transition: none;

                @media all and (max-width: 500px) {
                    font-size: 5vw;
                }
            }
        }

        .stop-link {
            margin: 1rem;
            font-size: $small-font-size;
            color: $light-base-color;

            &:hover {
                color: $contrast-color;
            }
        }

        input {
            position: absolute;
            top: -50px;
        }
    }
</style>
