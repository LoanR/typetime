<template>
    <div class="game-window" @click="reFocus">
        <p class="awaited-word">
            <span v-for="(letter, index) in wordToTypeLetters" :key="index" ref="letterToType">{{letter}}</span>
        </p>
        <p>{{countdownDisplay}}</p>
        <p>Level {{level}}</p>
        <p><span class="score-default" ref="comboIndicator">{{combo}}</span><span>Score: {{levelScore}}</span><span class="score-default" ref="scoreIndicator">{{scoreChange}}</span></p>
        <div>
            <span v-for="i in wordToTypeIndex" :key="i">•</span>
        </div>
        <input :disabled="!canStillPlay" type="text" name="" ref="gameInput" @input="compareInputToExpected" v-model="entry">
    </div>
</template>

<script>
import scoreCalculator from '../../js/scoreCalculator.js';
import gameTuning from '../../js/gameTuning.js';
import random from '../../js/random.js';

export default {
    name: 'Game',

    props: ['words', 'level', 'wordsPerMinute', 'difficulties', 'timeAccount', 'previousScore', 'previousLetterCombo'],

    data() {
        return {
            wordToTypeIndex: 0,
            letterToTypeIndex: 0,
            isSnail: gameTuning.isSnail(this.difficulties),
            isEconomist: gameTuning.isEconomist(this.difficulties),
            isResilient: gameTuning.isResilient(this.difficulties),
            isMasochist: gameTuning.isMasochist(this.difficulties),
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
            loseSound: [
                new Audio(require('@/assets/sounds/powerdown.wav')),
                new Audio(require('@/assets/sounds/mk64_loser.mp3')),
                new Audio(require('@/assets/sounds/tetrislose.mp3')),
                new Audio(require('@/assets/sounds/mario1down.mp3')),
                new Audio(require('@/assets/sounds/mariogameover.mp3')),
                new Audio(require('@/assets/sounds/yoshiowow.mp3')),
                new Audio(require('@/assets/sounds/pacmandies.mp3')),
            ],
            wordSound: [
                new Audio(require('@/assets/sounds/mariocoin.mp3')),
                new Audio(require('@/assets/sounds/completion.wav')),
                new Audio(require('@/assets/sounds/ding.wav')),
                new Audio(require('@/assets/sounds/crashselect.mp3')),
                new Audio(require('@/assets/sounds/sonicring.mp3')),
                new Audio(require('@/assets/sounds/mario1up.mp3')),
            ],
            errorSound: [
                new Audio(require('@/assets/sounds/denied.wav')),
                new Audio(require('@/assets/sounds/kirby_powerdown.wav')),
                new Audio(require('@/assets/sounds/moderatehit.wav')),
                new Audio(require('@/assets/sounds/moderatehit2.wav')),
                new Audio(require('@/assets/sounds/shellhit.wav')),
                new Audio(require('@/assets/sounds/stronghit.mp3')),
                new Audio(require('@/assets/sounds/basso.mp3')),
                new Audio(require('@/assets/sounds/frog.mp3')),
                new Audio(require('@/assets/sounds/funk.mp3')),
                new Audio(require('@/assets/sounds/susomi.mp3')),
            ],
            levelSound: [
                new Audio(require('@/assets/sounds/powerup.wav')),
                new Audio(require('@/assets/sounds/sprout.wav')),
                new Audio(require('@/assets/sounds/yoshiyoshi.wav')),
                new Audio(require('@/assets/sounds/tetrisclear.mp3')),
                new Audio(require('@/assets/sounds/pkbattlewin.mp3')),
                new Audio(require('@/assets/sounds/zeldaitem.mp3')),
                new Audio(require('@/assets/sounds/mariopowerup.mp3')),
                new Audio(require('@/assets/sounds/mariowarp.mp3')),
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
                    this.letterCombo += 1;
                    this.scoreChange = this.getLetterScore(this.entry, this.letterCombo, this.level, this.isSnail, this.isResilient, this.isMasochist);
                    this.stylizeWithClass(currentLetterElement, true, 'letter-found');
                    this.levelScore += this.scoreChange;
                    this.nextLetterToFind();
                } else {
                    this.errorSound[random.randomNum(this.errorSound.length)].play();
                    this.stylizeWithClass(currentLetterElement, true, 'letter-error');
                    this.errorStyle = window.setTimeout(this.stylizeWithClass, 100, currentLetterElement, false, 'letter-error');
                    this.stylizeWithClass(this.$refs.scoreIndicator, true, 'score-malus');
                    this.scoreIndicatorStyle = window.setTimeout(this.stylizeWithClass, 300, this.$refs.scoreIndicator, false, 'score-malus');
                    this.scoreChange = -this.getLetterScore(this.entry, this.letterCombo, this.level, this.isSnail, this.isResilient, this.isMasochist);
                    this.levelScore += this.scoreChange;
                    this.stylizeWithClass(this.$refs.comboIndicator, true, 'score-malus');
                    this.letterCombo = 0;
                    this.combo = scoreCalculator.getFinalMultiplier(this.letterCombo, this.isSnail, this.isMasochist, this.isResilient, this.level);
                    this.comboIndicatorStyle = window.setTimeout(this.stylizeWithClass, 300, this.$refs.comboIndicator, false, 'score-malus');
                }
                if (this.letterToTypeIndex === this.wordToType.length) {
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
                    if (this.wordToTypeIndex < this.words.length - 1) {
                        this.wordSound[random.randomNum(this.wordSound.length)].play();
                        this.clearCountdown();
                        this.wordToTypeIndex += 1;
                    } else {
                        if (!this.isResilient) {
                            this.showPreparation = true;
                        }
                        this.levelSound[random.randomNum(this.levelSound.length)].play();
                        this.stylizeWithClass(this.$refs.comboIndicator, false, 'score-malus');
                        this.stylizeWithClass(this.$refs.comboIndicator, false, 'score-bonus');
                        this.stylizeWithClass(this.$refs.scoreIndicator, false, 'score-malus');
                        this.$emit('nextLevel', {
                            timeAccount: this.wordCountDown,
                            levelScore: this.levelScore,
                            letterCombo: this.letterCombo,
                        });
                        window.clearTimeout(this.errorStyle);
                        window.clearTimeout(this.scoreIndicatorStyle);
                        window.clearTimeout(this.comboIndicatorStyle);
                        window.clearTimeout(this.comboIndicatorStyle2);
                        this.wordToTypeIndex = 0;
                    }
                    this.setNewWordEnv(this.$refs.letterToType[this.letterToTypeIndex], true, 'letter-to-type');
                }
            }
            this.entry = '';
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

        modifyCountdownDisplay() {
            if (this.wordCountDown > 0) {
                this.wordCountDown -= 1;
            } else {
                if (this.canStillPlay && !this.showPreparation) {
                    this.timeExceeded();
                } else if (this.showPreparation) {
                    this.clearCountdown();
                }
            }
        },

        launchNewCountdown() {
            let countDown = this.isEconomist ? (this.allotedTime + this.wordCountDown) : this.allotedTime;
            this.wordCountDown = countDown > 3000 ? 3000 : parseInt(countDown.toFixed());
            this.interval = window.setInterval(this.modifyCountdownDisplay, 10);
        },

        clearCountdown() {
            window.clearInterval(this.interval);
        },

        timeExceeded() {
            this.loseSound[random.randomNum(this.loseSound.length)].play();
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
        this.levelScore = this.previousScore;
        this.letterCombo = this.previousLetterCombo;
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
                transition: all 0.2s cubic-bezier(0.5,0,0,1);
            }

            .letter-error {
                animation: splat 0.2s 1;
            }
        }

        input {
            position: absolute;
            top: -50px;
        }

        .score-default {
            transition: color 0.2s cubic-bezier(0.5,0,0,1);
        }

        .score-malus {
            color: $warning-color;
            transition: none;
        }

        .score-bonus {
            color: $brand-color;
            font-size: calc(#{$base-font-size} + 0.3rem);
            transition: none;
        }
    }
</style>
