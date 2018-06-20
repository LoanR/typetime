<template>
    <section>
        <game-hub-component v-if="wantsToPlay"
            :words="wordsToType"
            :level="gameLevel"
            :levelWordsCount="wordsToTypeCount"
            :wordsPerMinute="wordsPerMinute"
            :isResilient="isResilient()"
            :isEconomist="isEconomist()"
            @nextLevel="nextLevel">
        </game-hub-component>
        <div v-else>
            <header>
                <img src="../assets/logo.png">
                <h1>{{title}}</h1>
            </header>
            <button-component :content="startContent" @lauchGame="launchGame"></button-component>
            <checkboxes-component
                :modifiers="selectedModifiers"
                @toggleCheck="toggleModifiers">
            </checkboxes-component>
            <checkboxes-component
                :modifiers="difficulties"
                @toggleCheck="toggleDifficulties">
            </checkboxes-component>
            <nav>
                <router-link v-bind:to="'/about'">About</router-link>
            </nav>
        </div>

    </section>
</template>

<script>
import random from '../js/random.js';

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
            shouldShuffleTitle: true,
            timeOut: null,
            firstTimeOut: 3000,
            wantsToPlay: false,
            startContent: 'start',
            selectedModifiers: [],
            modifiers: [
                {
                    label: 'lexical',
                    param: 'rel_trg=',
                    value: '',
                    option: '',
                    isChecked: false,
                    modCluster: 'parameter',
                },
                {
                    label: 'semantic',
                    param: 'ml=',
                    value: '',
                    option: '',
                    isChecked: false,
                    modCluster: 'parameter',
                },
                {
                    label: 'phonetic',
                    param: 'sl=',
                    value: '',
                    option: '',
                    isChecked: false,
                    modCluster: 'parameter',
                },
                {
                    label: 'rhyme',
                    param: 'rel_rhy=',
                    value: '',
                    option: '',
                    isChecked: false,
                    modCluster: 'parameter',
                },
                {
                    label: 'español',
                    param: 'ml=',
                    value: 'ahora',
                    option: '&v=es',
                    isChecked: false,
                    modCluster: 'all',
                },
            ],
            difficulties: [
                {
                    label: 'snail',
                    isChecked: false,
                    stringOrder: 3,
                },
                {
                    label: 'economist',
                    isChecked: false,
                    stringOrder: 1,
                },
                {
                    label: 'resilient',
                    isChecked: false,
                    stringOrder: 0,
                },
                {
                    label: 'occultist',
                    isChecked: false,
                    stringOrder: 2,
                },
            ],
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
            this.title = this.shuffleTitle();
            this.timeOut = window.setTimeout(() => {
                this.overwriteTitle();
            }, random.randomNum(3000, 200));
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
                this.wantsToPlay = true;
                const query = this.getUrlQuery();
                this.wordsToType = await this.requestWords(this.startingWordsToTypeCount, query[0], query[1], query[2]);
                this.requestNextWordsNoWait(this.wordsToTypeCount + 1);
            } catch (err) {
                window.alert(err);
            }
        },

        async requestWords(wordCount, queryParameter, queryValue, option = '') {
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
                    const response = await fetch(this.apiEndpoint + queryParameter + queryValue + option); // new word on each request
                    unformattedData.push(...await response.json());
                    i += 1;
                }
                return this.selectWords(unformattedData, wordCount);
            } catch (err) {
                throw new Error(err);
            }
        },

        requestNextWordsNoWait(wordCount) {
            const query = this.getUrlQuery();
            fetch(this.apiEndpoint + query[0] + query[1] + query[2]).then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            }).then(unformattedData => {
                this.nextWordsToType = this.selectWords(unformattedData, Math.min(wordCount, unformattedData.length));
            }).catch((err) => window.alert(err));
        },

        selectWords(jsonResponse, wordCount) {
            let selectedWords = [];
            for (let i = 1; i <= wordCount; i++) {
                const wordData = jsonResponse.splice(random.randomNum(jsonResponse.length, 0), 1)[0];
                selectedWords.push(wordData.word);
            }
            return selectedWords;
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
                param = this.getParamFromMods(checkedMods);
                value = this.getValueFromMods(checkedMods);
                option = this.getOptionFromMods(checkedMods);
            }
            const levelTheme = this.thematiseGame();
            if (levelTheme) {
                value = levelTheme;
            }
            return [param, value, option];
        },

        thematiseGame() {
            if (this.nextWordsToType.length) {
                return this.cleanQueryValue(this.nextWordsToType[this.nextWordsToType.length - 1]);
            } else if (this.wordsToType.length) {
                return this.cleanQueryValue(this.wordsToType[this.wordsToType.length - 1]);
            }
            return null;
        },

        cleanQueryValue(string) {
            const trimmedStr = string.trim();
            const firstSpaceId = trimmedStr.indexOf(' ');
            return firstSpaceId !== -1 ? trimmedStr.substring(0, firstSpaceId) : trimmedStr;
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

        async setModifiers() {
            let mods = [this.cleanQueryValue((await this.requestWords(1, 'ml=', 'toujours', '&max=50'))[0])];
            mods.push(this.cleanQueryValue((await this.requestWords(1, 'ml=', 'voiture', '&max=50'))[0]));
            mods.push(this.cleanQueryValue((await this.requestWords(1, 'ml=', 'people', '&max=50'))[0]));
            mods.push(this.cleanQueryValue((await this.requestWords(1, 'ml=', 'places', '&max=50'))[0]));
            mods.push(this.cleanQueryValue((await this.requestWords(1, 'ml=', 'because', '&max=50'))[0]));
            mods.forEach(mod => {
                this.modifiers.push(
                    {
                        label: '"' + mod + '"',
                        param: '',
                        value: mod,
                        option: '',
                        isChecked: false,
                        modCluster: 'word',
                    }
                );
            });
            for (let i = 0; i < 4; i++) {
                this.selectedModifiers.push(this.modifiers.splice(random.randomNum(this.modifiers.length, 0), 1)[0]);
            }
        },

        toggleDifficulties(toggledDifficultyLabel) {
            const toggledDifficulty = this.difficulties.find(dif => dif.label === toggledDifficultyLabel);
            toggledDifficulty.isChecked = !toggledDifficulty.isChecked;
            if (toggledDifficultyLabel === 'snail') {
                this.wordsPerMinute = this.wordsPerMinute === 30 ? 10 : 30;
            }
        },

        isAnEspagnolRun() {
            const checkedMods = this.selectedModifiers.filter(mod => !!mod.isChecked);
            if (checkedMods.length) {
                const m = checkedMods.find(mod => mod.label === 'español');
                if (m) {
                    return m.param + m.value + m.option;
                }
            }
            return false;
        },

        isResilient() {
            return this.difficulties.find(dif => dif.label === 'resilient').isChecked;
        },

        isEconomist() {
            return this.difficulties.find(dif => dif.label === 'economist').isChecked;
        },

        isOccultist() {
            return this.difficulties.find(dif => dif.label === 'occultist').isChecked;
        },
    },

    computed: {
        wordsToTypeCount() {
            return this.startingWordsToTypeCount + this.gameLevel - 1;
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
