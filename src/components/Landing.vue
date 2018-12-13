<template>
    <section class="slide-container">
        <transition :name="slideTransition">
            <game-hub-component v-if="currentlyPlaying" @rematch="restartGame"></game-hub-component>
            <div v-else class="landing-container">
                <header>
                    <img src="../assets/images/typetime_logo.svg">
                    <h1 @mouseover="resetTitle" @mouseout="restartShuffle">{{shuffledTitle}}</h1>
                </header>
                <div class="interactions">
                    <div>
                        <button-component :content="startContent" @bigButtonClick="launchGame"></button-component>
                    </div>
                    <div class="mod-diff-container">
                        <checkboxes-component
                            :switches="selectedModifiers"
                            :titleCategory="modTitle"
                            @toggleCheck="toggleModifiers">
                        </checkboxes-component>
                        <checkboxes-component
                            :switches="difficulties"
                            :titleCategory="diffTitle"
                            @toggleCheck="toggleDifficulties">
                        </checkboxes-component>
                    </div>
                </div>
                <nav>
                    <router-link v-bind:to="'/typetime/about'" v-on:click.native="resetTitle">About</router-link>
                </nav>
            </div>
        </transition>
    </section>
</template>

<script>
import random from '@/core/random.js';
import gameTuning from '@/core/gameTuning.js';
import wordSelection from '@/core/wordSelection.js';

import buttonComponent from '@/components/buttons/Button.vue';
import checkboxesComponent from '@/components/sections/Checkboxes.vue';
import gameHubComponent from '@/components/game/GameHub.vue';

import {requestDataWords} from '@/core/wordRequest';

export default {
    name: 'Landing',

    components: {
        'button-component': buttonComponent,
        'checkboxes-component': checkboxesComponent,
        'game-hub-component': gameHubComponent,
    },

    data() {
        return {
            title: 'TypeTime',
            shuffledTitle: 'TypeTime',
            shouldShuffleTitle: true,
            shouldSlideFromRight: true,
            timeOut: null, // rules conf file
            firstTimeOut: 3000, // rules conf file
            startContent: 'start',
            modTitle: 'Modifiers',
            diffTitle: 'Difficulties',
            selectedModifiers: gameTuning.getEmptyMods(),
            modifiers: gameTuning.getModifiers(),
            // difficulties: gameTuning.getDifficulties(),
            wordsPerMinute: 30, // rules conf file
            // wordsToType: [], // game run file
            // nextWordsToType: [], // game run file
            startingWordsToTypeCount: 5, // rules conf file
            gameLevel: 1, // rules file
            apiEndpoint: 'https://api.datamuse.com/words?', // game run file
            frequencyParameter: '&md=f', // game run file
            keySounds: [
                require('@/assets/sounds/key1.mp3'),
                require('@/assets/sounds/key2.mp3'),
                require('@/assets/sounds/key3.mp3'),
            ],
        };
    },

    methods: {
        overwriteTitleCycle() {
            clearTimeout(this.timeOut);
            if (this.shouldShuffleTitle) {
                this.shuffledTitle = this.shuffleTitle();
                new Audio(this.keySounds[random.randomNum(this.keySounds.length)]).play();
                this.timeOut = window.setTimeout(this.overwriteTitleCycle, random.randomNum(3000, 200));
            }
        },

        shuffleTitle() {
            let movableLettersIndices = [1, 2, 3, 5, 6];
            let titleCopy = this.title.split('');
            const firstLetterIndice = movableLettersIndices.splice(random.randomNum(movableLettersIndices.length, 0), 1);
            const firstLetter = this.title[firstLetterIndice];
            const secondLetterIndice = movableLettersIndices.splice(random.randomNum(movableLettersIndices.length, 0), 1);
            const secondLetter = titleCopy.splice(secondLetterIndice, 1, firstLetter)[0];
            titleCopy.splice(firstLetterIndice, 1, secondLetter).join('');
            return titleCopy.join('');
        },

        resetTitle() {
            this.shouldShuffleTitle = false;
            this.shuffledTitle = this.title;
        },

        restartShuffle() {
            this.shouldShuffleTitle = true;
            this.overwriteTitleCycle();
        },

        toggleModifiers(toggledModifierId) {
            const toggledModifier = this.selectedModifiers.find(modifier => modifier.id === toggledModifierId);
            this.uncheckRelatedModifiers(toggledModifier);
            toggledModifier.isChecked = !toggledModifier.isChecked;
            this.$store.commit('setWordsContext', {
                wordsContext: gameTuning.getWordsContext(this.modifiers, this.selectedModifiers),
            });
        },

        uncheckRelatedModifiers(toggledModifier) {
            let clusterMods = [];
            if (toggledModifier.modCluster === 'all') {
                clusterMods = this.selectedModifiers;
            } else {
                clusterMods = this.selectedModifiers.filter(modifier => modifier.modCluster === toggledModifier.modCluster || modifier.modCluster === 'all');
            }
            for (let mod of clusterMods) {
                if (mod !== toggledModifier) {
                    mod.isChecked = false;
                }
            }
        },

        async launchGame() {
            try {
                this.shouldShuffleTitle = false;
                this.shouldSlideFromRight = true;
                this.$store.commit('resetLevelRules'); // reusable -> store action ?
                this.$store.commit('resetScore'); // reusable -> store action ?
                this.$store.commit('setDifficultyNaming', {
                    difficultyNaming: gameTuning.buildDifficultyNaming(this.difficulties.filter(d => d.isChecked)),
                });
                this.$store.commit('startGame');
                this.$store.commit('setWordsSelectionRules', {wordsSelectionRules: wordSelection.getLevelRule(this.$store.state.rules.gameDifficulties.isMasochist, this.$store.state.rules.levelRules.currentLevel)}); // reusable -> store action ?
                this.$store.dispatch('requestAndSetWordsToType', {
                    levelRules: this.$store.state.rules.levelRules,
                    wordsContext: this.$store.state.wordsContext,
                    wordsSelectionRules: this.$store.state.rules.wordsSelectionRules,
                    filterAgainstRules: true,
                });
            } catch (err) {
                this.restartGame();
                // window.alert('We couldn\'t find enough words to type, please launch a new game...');
                window.alert(err);
            }
        },

        async selectModifiers() {
            const modSearchValues = gameTuning.getSpecificModifierSearchValues();
            const pSelectedModWords = modSearchValues.map(async(searchInstructions) => {
                return this.addWordModifier(searchInstructions.param, searchInstructions.value);
            });
            const selectedModWords = await Promise.all(pSelectedModWords);
            this.modifiers.push(...gameTuning.buildNewModifiers(selectedModWords));
            this.selectedModifiers = random.spliceRandomEntities(4, this.modifiers); // magic
            this.$store.commit('setWordsContext', {
                wordsContext: gameTuning.getWordsContext(this.modifiers, this.selectedModifiers),
            });
        },

        async addWordModifier(param, value) {
            try {
                return random.selectRandomEntity(wordSelection.cleanDataWords(await requestDataWords(1, param, value, '', false)));
            } catch (error) {
                this.restartGame();
                window.alert('We couldn\'t build consistent modifiers, please launch a new game...');
            }
        },

        toggleDifficulties(toggledDifficultyId) {
            const toggledDifficulty = this.difficulties.find(dif => dif.id === toggledDifficultyId);
            this.$store.commit('setDifficulty', {settingId: toggledDifficultyId, isChecked: !toggledDifficulty.isChecked});
            if (toggledDifficultyId === 'isSnail') {
                this.wordsPerMinute = this.wordsPerMinute === 30 ? 10 : 30; // magic
            }
        },

        restartGame() {
            this.shouldSlideFromRight = false;
            this.shouldShuffleTitle = true;
            this.overwriteTitleCycle();
            this.selectedModifiers = gameTuning.getEmptyMods();
            this.modifiers = gameTuning.getModifiers();
            this.selectModifiers();
        },
    },

    computed: {
        wordsToTypeCount() {
            return this.startingWordsToTypeCount + this.gameLevel - 1;
        },

        slideTransition() {
            return this.shouldSlideFromRight ? 'slide-fade-right' : 'slide-fade-left';
        },

        currentlyPlaying() {
            return this.$store.state.currentlyPlaying;
        },

        difficulties() {
            return gameTuning.getDifficulties().map(difficulty => {
                difficulty.isChecked = this.$store.state.rules.gameDifficulties[difficulty.id];
                return difficulty;
            });
        },
    },

    mounted() {
        if (this.shouldShuffleTitle) {
            this.timeOut = window.setTimeout(() => {
                this.overwriteTitleCycle();
            }, this.firstTimeOut);
        };
        this.selectModifiers();
    },
};
</script>

<style lang="scss" scoped>
    @import '../styles/common';
    @import '../styles/slides';

    .slide-container {
        width: 100%;
        height: 100%;
        text-align: center;

        &>div {
            width: 100%;
            height: 100%;
        }

        .landing-container {

            header {
                height: 200px;
                position: relative;
                padding: 2rem;

                img {
                    max-width: 200px;
                }

                h1 {
                    font-weight: $bold-weight;
                    font-size: $big-font-size;
                    margin: 0;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }
            }

            nav {
                padding: 0.5rem 1rem 2rem;
            }
        }
    }
</style>
