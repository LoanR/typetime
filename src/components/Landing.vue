<template>
    <section>
        <game-hub-component v-if="wantsToPlay"
            :words="wordsToType"
            :level="gameLevel"
            :levelWordsCount="wordsToTypeCount"
            :wordsPerMinute="wordsPerMinute"
            :isSnail="isSnail()"
            :isEconomist="isEconomist()"
            :isResilient="isResilient()"
            :isMasochist="isMasochist()"
            @nextLevel="nextLevel"
            @rematch="restartGame">
        </game-hub-component>
        <div v-else>
            <header>
                <img src="../assets/logo.png">
                <h1>{{title}}</h1>
            </header>
            <button-component :content="startContent" @bigButtonClick="launchGame"></button-component>
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
                    stringOrder: 2,
                },
                {
                    label: 'resilient',
                    isChecked: false,
                    stringOrder: 0,
                },
                {
                    label: 'masochist',
                    isChecked: false,
                    stringOrder: 1,
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
            const filteredData = filterAgainstRules ? wordSelectionRules.filterWordsOnRule(jsonResponse, this.gameLevel, this.isMasochist(), wordCount) : jsonResponse;
            for (let i = 1; i <= wordCount; i++) {
                const wordData = filteredData.splice(random.randomNum(filteredData.length, 0), 1)[0];
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

        // cleanQueryValue(string) {
        //     const trimmedStr = string.trim();
        //     const firstSpaceId = trimmedStr.indexOf(' ');
        //     return firstSpaceId !== -1 ? trimmedStr.substring(0, firstSpaceId) : trimmedStr;
        // },

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

        isSnail() {
            return this.difficulties.find(dif => dif.label === 'snail').isChecked;
        },

        isEconomist() {
            return this.difficulties.find(dif => dif.label === 'economist').isChecked;
        },

        isResilient() {
            return this.difficulties.find(dif => dif.label === 'resilient').isChecked;
        },

        isMasochist() {
            return this.difficulties.find(dif => dif.label === 'masochist').isChecked;
        },

        restartGame() {
            this.wantsToPlay = false;
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
