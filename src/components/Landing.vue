<template>
    <section class="slide-container">
        <transition :name="slideTransition">
            <game-hub-component v-if="wantsToPlay"
                :words="wordsToType"
                :level="gameLevel"
                :levelWordsCount="wordsToTypeCount"
                :wordsPerMinute="wordsPerMinute"
                :difficulties="difficulties"
                @nextLevel="nextLevel"
                @rematch="restartGame">
            </game-hub-component>
            <div v-else>
                <header>
                    <img src="../assets/logo.png">
                    <h1 @mouseover="resetTitle" @mouseout="restartShuffle">{{shuffledTitle}}</h1>
                </header>
                <div>
                    <div>
                        <button-component :content="startContent" @bigButtonClick="launchGame"></button-component>
                    </div>
                    <div>
                        <checkboxes-component
                            :switches="selectedModifiers"
                            @toggleCheck="toggleModifiers">
                        </checkboxes-component>
                        <checkboxes-component
                            :switches="difficulties"
                            @toggleCheck="toggleDifficulties">
                        </checkboxes-component>
                    </div>
                </div>
                <nav>
                    <router-link v-bind:to="'/about'">About</router-link>
                </nav>
            </div>
        </transition>
    </section>
</template>

<script>
import random from '../js/random.js';
import gameTuning from '../js/gameTuning.js';
import wordSelectionRules from '../js/wordSelectionRules.js';

import buttonComponent from './buttons/Button.vue';
import checkboxesComponent from './sections/Checkboxes.vue';
import gameHubComponent from './game/GameHub.vue';

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
            timeOut: null,
            firstTimeOut: 3000,
            wantsToPlay: false,
            startContent: 'start',
            selectedModifiers: gameTuning.getEmptyMods(),
            modifiers: gameTuning.getModifiers(),
            difficulties: gameTuning.getDifficulties(),
            wordsPerMinute: 30,
            wordsToType: [],
            nextWordsToType: [],
            startingWordsToTypeCount: 5,
            gameLevel: 1,
            apiEndpoint: 'https://api.datamuse.com/words?',
        };
    },

    methods: {
        overwriteTitle() {
            clearTimeout(this.timeOut);
            if (this.shouldShuffleTitle) {
                this.shuffledTitle = this.shuffleTitle();
                this.timeOut = window.setTimeout(this.overwriteTitle, random.randomNum(3000, 200));
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
            this.overwriteTitle();
        },

        toggleModifiers(toggledModifierLabel) {
            const toggledModifier = this.selectedModifiers.find(modifier => modifier.label === toggledModifierLabel);
            this.uncheckRelatedModifiers(toggledModifier);
            toggledModifier.isChecked = !toggledModifier.isChecked;
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
                this.shouldSlideFromRight = true;
                this.wantsToPlay = true;
                const query = this.getUrlQuery();
                this.wordsToType = await this.requestWords(this.startingWordsToTypeCount, query[0], query[1], query[2]);
                this.requestNextWordsNoWait(this.wordsToTypeCount + 1);
            } catch (err) {
                window.alert(err);
            }
        },

        async requestWords(wordCount, queryParameter, queryValue, option = '', filterAgainstRules = true) {
            try {
                let unformattedData = [];
                let i = 1;
                while (unformattedData.length < wordCount) {
                    if (i > 1) {
                        queryParameter = 'ml=';
                        if (i > 2) {
                            queryValue = 'effect';
                        }
                    }
                    const response = await fetch(this.apiEndpoint + queryParameter + queryValue + option + '&md=f');
                    unformattedData.push(...await response.json());
                    i += 1;
                }
                return this.selectWords(unformattedData, wordCount, filterAgainstRules);
            } catch (err) {
                throw new Error(err);
            }
        },

        requestNextWordsNoWait(wordCount) {
            const query = this.getUrlQuery();
            fetch(this.apiEndpoint + query[0] + query[1] + query[2] + '&md=f').then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            }).then(unformattedData => {
                this.nextWordsToType = this.selectWords(unformattedData, Math.min(wordCount, unformattedData.length));
            }).catch((err) => window.alert(err));
        },

        selectWords(jsonResponse, wordCount, filterAgainstRules = true) {
            let selectedWords = [];
            const filteredData = filterAgainstRules ? wordSelectionRules.filterWordsOnRule(jsonResponse, this.gameLevel, gameTuning.isMasochist(this.difficulties), wordCount) : jsonResponse;
            for (let i = 1; i <= wordCount; i++) {
                const wordData = filteredData.splice(random.randomNum(filteredData.length, 0), 1)[0];
                selectedWords.push(this.mayMutateCase(wordData.word));
            }
            return selectedWords;
        },

        mayMutateCase(word) {
            const rand = random.randomNum(3, 0);
            if (!rand && ((gameTuning.isMasochist(this.difficulties) && this.gameLevel >= 3) || this.gameLevel >= 5)) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
            return word;
        },

        async nextLevel() {
            this.gameLevel += 1;
            while (this.nextWordsToType.length < this.wordsToTypeCount) {
                const remainingWordCount = this.wordsToTypeCount - this.nextWordsToType.length;
                const query = this.getUrlQuery();
                this.nextWordsToType.push(...await this.requestWords(remainingWordCount, query[0], query[1], query[2]));
            }
            this.wordsToType = this.nextWordsToType;
            this.requestNextWordsNoWait(this.wordsToTypeCount + 1);
        },

        getUrlQuery() {
            const checkedMods = this.selectedModifiers.filter(mod => !!mod.isChecked);
            const randWordModifier = this.modifiers.find(mod => mod.modCluster === 'word');
            let param = 'ml=';
            let value = !randWordModifier ? 'care' : randWordModifier.value;
            let option = '';
            if (checkedMods.length) {
                param = this.getParamFromMods(checkedMods) || param;
                value = this.getValueFromMods(checkedMods) || value;
                option = this.getOptionFromMods(checkedMods) || option;
            }
            const levelTheme = this.thematiseGame();
            if (levelTheme) {
                value = levelTheme;
            }
            return [param, value, option];
        },

        getParamFromMods(mods) {
            const m = mods.filter(mod => mod.param !== '');
            if (m.length === 1) {
                return m[0].param;
            }
        },

        getValueFromMods(mods) {
            const m = mods.filter(mod => mod.value !== '');
            if (m.length === 1) {
                return m[0].value;
            }
        },

        getOptionFromMods(mods) {
            const m = mods.filter(mod => mod.option !== '');
            if (m.length === 1) {
                return m[0].option;
            }
        },

        thematiseGame() {
            if (this.nextWordsToType.length) {
                return this.nextWordsToType[this.nextWordsToType.length - 1];
            } else if (this.wordsToType.length) {
                return this.wordsToType[this.wordsToType.length - 1];
            }
            return null;
        },

        async setModifiers() {
            const accentValues = ['*é*', '*è*', '*ê*', '*ë*', '*â*', '*ï*', '*ô*', '*û*'];
            const rareAccentValues = ['*ä*', '*á*', '*å*', '*ë*', '*â*', '*í*', '*ö*', '*ó*', '*ü*', '*ú*'];
            let mods = [(await this.requestWords(1, 'ml=', 'toujours', '&max=50', false))[0]];
            mods.push((await this.requestWords(1, 'ml=', 'voiture', '&max=50', false))[0]);
            mods.push((await this.requestWords(1, 'ml=', 'people', '&max=50', false))[0]);
            mods.push((await this.requestWords(1, 'ml=', 'places', '&max=50', false))[0]);
            mods.push((await this.requestWords(1, 'ml=', 'because', '&max=50', false))[0]);
            mods.push((await this.requestWords(1, 'sp=', accentValues[random.randomNum(accentValues.length, 0)], '&max=50', false))[0]);
            mods.push((await this.requestWords(1, 'sp=', rareAccentValues[random.randomNum(rareAccentValues.length, 0)], '&max=50', false))[0]);
            mods.forEach(mod => {
                this.modifiers.push(
                    {
                        label: '"' + mod + '"',
                        param: '',
                        value: mod,
                        option: '',
                        isChecked: false,
                        modCluster: 'word',
                        description: 'Suggest the game to search for words around "' + mod + '".',
                    }
                );
            });
            for (let i = 0; i < 4; i++) {
                this.selectedModifiers.splice(i, 1, this.modifiers.splice(random.randomNum(this.modifiers.length, 0), 1)[0]);
            }
        },

        toggleDifficulties(toggledDifficultyLabel) {
            const toggledDifficulty = this.difficulties.find(dif => dif.label === toggledDifficultyLabel);
            toggledDifficulty.isChecked = !toggledDifficulty.isChecked;
            if (toggledDifficultyLabel === 'snail') {
                this.wordsPerMinute = this.wordsPerMinute === 30 ? 10 : 30;
            }
        },

        restartGame() {
            this.shouldSlideFromRight = false;
            this.wantsToPlay = false;
        },
    },

    computed: {
        wordsToTypeCount() {
            return this.startingWordsToTypeCount + this.gameLevel - 1;
        },

        slideTransition() {
            return this.shouldSlideFromRight ? 'slide-fade-right' : 'slide-fade-left';
        },
    },

    mounted() {
        if (this.shouldShuffleTitle) {
            this.timeOut = window.setTimeout(() => {
                this.overwriteTitle();
            }, this.firstTimeOut);
        };
        this.setModifiers();
    },
};
</script>

<style lang="scss" scoped>
    @import '../styles/common';
    @import '../styles/slides';

    header {
        height: 200px;
        position: relative;
        padding: 50px 0;
        h1 {
            margin: 0;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }

    section {
        width: 100%;
        height: 100%;
        text-align: center;

        &>div {
            width: 100%;
            height: 100%;

        }
    }

    h1 {
        font-weight: $bold-weight;
        font-size: $big-font-size;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        display: inline-block;
        margin: 0 10px;
    }

    .modifier-container {
        display: flex;
        justify-content: center;
    }
</style>
